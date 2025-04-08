using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    public class UploadThumbnailCommandHandler : IRequestHandler<UploadThumbnailCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UploadThumbnailCommandHandler> _logger;

        public UploadThumbnailCommandHandler(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<UploadThumbnailCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<VideoDto> Handle(UploadThumbnailCommand request, CancellationToken cancellationToken)
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

                // Save the uploaded thumbnail
                var thumbnailPath = Path.Combine(videoDirectory, "thumbnail.jpg");
                using (var stream = new FileStream(thumbnailPath, FileMode.Create))
                {
                    await request.ThumbnailFile.CopyToAsync(stream, cancellationToken);
                }

                // Update video with thumbnail URL
                video.ThumbnailUrl = $"/api/videos/{video.Id}/thumbnail";

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
                    IsNew = video.IsNew
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading thumbnail for video {VideoId}", request.VideoId);
                throw;
            }
        }
    }
}
