using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    /// <summary>
    /// Handler for creating a new video (metadata only)
    /// </summary>
    public class CreateVideoCommandHandler : IRequestHandler<CreateVideoCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<CreateVideoCommandHandler> _logger;

        public CreateVideoCommandHandler(
            IVideoRepository videoRepository,
            ILogger<CreateVideoCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        public async Task<VideoDto> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Create video entity with metadata only
                var video = new Video
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Description = request.Description,
                    Timestamp = DateTime.UtcNow,
                    Status = VideoStatus.Uploading, // Initial status before file upload
                    Tags = request.Tags,
                    IsFeatured = request.IsFeatured,
                    IsNew = request.IsNew,
                    // Default thumbnail until one is uploaded
                    ThumbnailUrl = "/default-thumbnail.jpg"
                };

                // Save to database
                await _videoRepository.AddAsync(video);
                await _videoRepository.SaveChangesAsync();

                // Return DTO
                return new VideoDto
                {
                    Id = video.Id,
                    Title = video.Title,
                    Description = video.Description,
                    Duration = 0, // No duration yet since no file is uploaded
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
                _logger.LogError(ex, "Error creating video metadata");
                throw;
            }
        }
    }
}
