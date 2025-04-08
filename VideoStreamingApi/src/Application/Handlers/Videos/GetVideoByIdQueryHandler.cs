using MediatR;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Application.Queries.Videos;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    public class GetVideoByIdQueryHandler : IRequestHandler<GetVideoByIdQuery, VideoDetailsDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<GetVideoByIdQueryHandler> _logger;

        public GetVideoByIdQueryHandler(
            IVideoRepository videoRepository,
            ILogger<GetVideoByIdQueryHandler> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        public async Task<VideoDetailsDto> Handle(GetVideoByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(request.Id);
                
                if (video == null)
                {
                    throw new KeyNotFoundException($"Video with ID {request.Id} not found");
                }

                // Calculate view count and average rating
                var viewCount = video.ViewStats.Count;
                var averageRating = video.Ratings.Any() 
                    ? video.Ratings.Average(r => r.RatingValue) 
                    : 0;

                // Map to DTO
                var videoDetailsDto = new VideoDetailsDto
                {
                    Id = video.Id,
                    Title = video.Title,
                    Description = video.Description,
                    Duration = video.Duration,
                    UploadDate = video.UploadDate,
                    Status = video.Status.ToString(),
                    ThumbnailUrl = video.ThumbnailUrl,
                    Tags = video.Tags,
                    ViewCount = viewCount,
                    AverageRating = averageRating,
                    VideoFiles = video.VideoFiles.Select(vf => new VideoFileDto
                    {
                        Id = vf.Id,
                        FilePath = vf.FilePath,
                        Size = vf.Size
                    })
                };

                return videoDetailsDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving video {VideoId}", request.Id);
                throw;
            }
        }
    }
}
