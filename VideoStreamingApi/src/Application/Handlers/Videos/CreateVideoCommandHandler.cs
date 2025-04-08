using MediatR;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    public class CreateVideoCommandHandler : IRequestHandler<CreateVideoCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CreateVideoCommandHandler> _logger;

        public CreateVideoCommandHandler(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<CreateVideoCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<VideoDto> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Create storage directory if it doesn't exist
                var storagePath = _configuration["STORAGE_PATH"] ?? "./videos";
                Directory.CreateDirectory(storagePath);

                // Generate unique ID for the video
                var videoId = Guid.NewGuid();
                var videoDirectory = Path.Combine(storagePath, videoId.ToString());
                Directory.CreateDirectory(videoDirectory);

                // Save the uploaded file
                var rawFilePath = Path.Combine(videoDirectory, "raw.mp4");
                using (var stream = new FileStream(rawFilePath, FileMode.Create))
                {
                    await request.VideoFile.CopyToAsync(stream, cancellationToken);
                }

                // Create video entity
                var video = new Video
                {
                    Id = videoId,
                    Title = request.Title,
                    Description = request.Description,
                    UploadDate = DateTime.UtcNow,
                    Status = VideoStatus.Uploading,
                    Tags = request.Tags,
                    // Temporary thumbnail, will be replaced after processing
                    ThumbnailUrl = "/default-thumbnail.jpg"
                };

                // Create video file entity
                var videoFile = new VideoFile
                {
                    Id = Guid.NewGuid(),
                    VideoId = videoId,
                    FilePath = rawFilePath,
                    Size = new FileInfo(rawFilePath).Length
                };

                video.VideoFiles.Add(videoFile);

                // Save to database
                await _videoRepository.AddAsync(video);
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
                    UploadDate = video.UploadDate,
                    Status = video.Status.ToString(),
                    ThumbnailUrl = video.ThumbnailUrl,
                    Tags = video.Tags
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating video");
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
                video.ThumbnailUrl = $"/api/videos/{video.Id}/thumbnail.jpg";

                // Add HLS playlist file
                var hlsFile = new VideoFile
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    FilePath = $"{Path.GetDirectoryName(rawFilePath)}/playlist.m3u8",
                    Size = 1024 // Placeholder size
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
