using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Application.Services.Interfaces;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    /// <summary>
    /// Handler for uploading video files
    /// </summary>
    public class UploadVideoFileCommandHandler : IRequestHandler<UploadVideoFileCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly IVideoProcessingService _videoProcessingService;
        private readonly ILogger<UploadVideoFileCommandHandler> _logger;

        /// <summary>
        /// Initializes a new instance of the UploadVideoFileCommandHandler class
        /// </summary>
        public UploadVideoFileCommandHandler(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            IVideoProcessingService videoProcessingService,
            ILogger<UploadVideoFileCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _videoProcessingService = videoProcessingService;
            _logger = logger;
        }

        /// <summary>
        /// Handles the upload video file command
        /// </summary>
        public async Task<VideoDto> Handle(UploadVideoFileCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Get the video
                var video = await _videoRepository.GetVideoWithDetailsAsync(request.VideoId);
                
                if (video == null)
                {
                    throw new KeyNotFoundException($"Video with ID {request.VideoId} not found");
                }

                // Create storage directory if it doesn't exist
                var storagePath = _configuration["STORAGE_PATH"] ?? "./videos";
                var videoDirectory = Path.Combine(storagePath, request.VideoId.ToString());
                Directory.CreateDirectory(videoDirectory);

                // Save the uploaded file
                var rawFilePath = Path.Combine(videoDirectory, "raw.mp4");
                using (var stream = new FileStream(rawFilePath, FileMode.Create))
                {
                    await request.VideoFile.CopyToAsync(stream, cancellationToken);
                }

                // Create video file entity for the raw file
                var videoFile = new VideoFile
                {
                    Id = Guid.NewGuid(),
                    VideoId = request.VideoId,
                    FilePath = rawFilePath,
                    Size = new FileInfo(rawFilePath).Length,
                    Timestamp = DateTime.UtcNow
                };

                video.VideoFiles.Add(videoFile);
                video.Status = VideoStatus.Uploading;

                // Save to database
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();

                // Start background processing using the VideoProcessingService
                // This is done asynchronously to not block the response
                _ = Task.Run(() => _videoProcessingService.ProcessVideoAsync(video, rawFilePath));

                // Return DTO
                return new VideoDto
                {
                    Id = video.Id,
                    Title = video.Title,
                    Description = video.Description,
                    Duration = video.Duration,
                    UploadDate = video.Timestamp,
                    Status = video.Status.ToString(),
                    ThumbnailUrl = video.ThumbnailUrl,
                    Tags = video.Tags,
                    IsFeatured = video.IsFeatured,
                    IsNew = video.IsNew,
                    SubtitleLanguages = video.Subtitles?.Select(s => s.Language).ToList() ?? new List<string>()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading video file for video {VideoId}", request.VideoId);
                throw;
            }
        }


    }
}
