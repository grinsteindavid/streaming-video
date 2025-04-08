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
    public class UploadVideoFileCommandHandler : IRequestHandler<UploadVideoFileCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UploadVideoFileCommandHandler> _logger;

        public UploadVideoFileCommandHandler(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<UploadVideoFileCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

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

                // Create video file entity
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

                // Start background processing (in a real app, this would be a background job)
                _ = Task.Run(() => ProcessVideoAsync(video, rawFilePath));

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
                    IsNew = video.IsNew
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading video file");
                throw;
            }
        }

        private async Task ProcessVideoAsync(Video video, string rawFilePath)
        {
            try
            {
                // Update status to processing
                video.Status = VideoStatus.Processing;
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();

                // In a real application, this would use FFmpeg to:
                // 1. Generate thumbnail
                // 2. Convert video to HLS format
                // 3. Create multiple quality variants

                // For now, we'll just simulate processing delay
                await Task.Delay(5000);

                // Update video with processing results
                video.Status = VideoStatus.Ready;
                video.Duration = 120; // Placeholder duration in seconds

                // Add HLS playlist file
                var hlsFile = new VideoFile
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    FilePath = $"{Path.GetDirectoryName(rawFilePath)}/playlist.m3u8",
                    Size = 1024, // Placeholder size
                    Timestamp = DateTime.UtcNow
                };

                video.VideoFiles.Add(hlsFile);

                // Save changes
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing video {VideoId}", video.Id);
                
                // Update status to failed
                video.Status = VideoStatus.Failed;
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
            }
        }
    }
}
