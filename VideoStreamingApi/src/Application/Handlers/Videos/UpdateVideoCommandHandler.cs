using MediatR;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    public class UpdateVideoCommandHandler : IRequestHandler<UpdateVideoCommand, VideoDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<UpdateVideoCommandHandler> _logger;

        public UpdateVideoCommandHandler(
            IVideoRepository videoRepository,
            ILogger<UpdateVideoCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        public async Task<VideoDto> Handle(UpdateVideoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var video = await _videoRepository.GetByIdAsync(request.Id);
                
                if (video == null)
                {
                    throw new KeyNotFoundException($"Video with ID {request.Id} not found");
                }

                // Update properties
                video.Title = request.Title;
                video.Description = request.Description;
                video.Tags = request.Tags;

                // Save changes
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();

                // Return updated DTO
                return new VideoDto
                {
                    Id = video.Id,
                    Title = video.Title,
                    Description = video.Description,
                    Duration = video.Duration,
                    UploadDate = video.Timestamp,
                    Status = video.Status.ToString(),
                    ThumbnailUrl = video.ThumbnailUrl,
                    Tags = video.Tags
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating video {VideoId}", request.Id);
                throw;
            }
        }
    }
}
