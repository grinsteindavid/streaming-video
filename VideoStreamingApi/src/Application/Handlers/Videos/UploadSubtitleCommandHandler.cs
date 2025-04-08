using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    /// <summary>
    /// Handler for uploading subtitle files for videos
    /// </summary>
    public class UploadSubtitleCommandHandler : IRequestHandler<UploadSubtitleCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UploadSubtitleCommandHandler> _logger;

        /// <summary>
        /// Initializes a new instance of the UploadSubtitleCommandHandler class
        /// </summary>
        public UploadSubtitleCommandHandler(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<UploadSubtitleCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Handles the command to upload a subtitle file
        /// </summary>
        public async Task<VideoDto> Handle(UploadSubtitleCommand request, CancellationToken cancellationToken)
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
                var subtitlesDirectory = Path.Combine(videoDirectory, "subtitles");
                Directory.CreateDirectory(subtitlesDirectory);

                // Generate a safe filename based on language code
                var safeLanguage = request.Language.Replace(".", "").Replace("/", "").Replace("\\", "");
                var subtitleFileName = $"{safeLanguage}.vtt";
                var subtitlePath = Path.Combine(subtitlesDirectory, subtitleFileName);

                // Save the uploaded subtitle file
                using (var stream = new FileStream(subtitlePath, FileMode.Create))
                {
                    await request.SubtitleFile.CopyToAsync(stream, cancellationToken);
                }

                // Create subtitle entity
                var subtitle = new Subtitle
                {
                    Id = Guid.NewGuid(),
                    VideoId = request.VideoId,
                    Language = request.Language,
                    FilePath = subtitlePath,
                    Timestamp = DateTime.UtcNow
                };

                // Add to video's subtitles collection
                video.Subtitles.Add(subtitle);

                // Save to database
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();

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
                    SubtitleLanguages = video.Subtitles.Select(s => s.Language).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading subtitle for video {VideoId}", request.VideoId);
                throw;
            }
        }
    }
}
