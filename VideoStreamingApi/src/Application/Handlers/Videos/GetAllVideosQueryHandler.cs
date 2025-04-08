using MediatR;
using VideoStreamingApi.Application.DTOs;
using VideoStreamingApi.Application.Queries.Videos;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    public class GetAllVideosQueryHandler : IRequestHandler<GetAllVideosQuery, VideoListResponseDto>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<GetAllVideosQueryHandler> _logger;

        public GetAllVideosQueryHandler(
            IVideoRepository videoRepository,
            ILogger<GetAllVideosQueryHandler> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        public async Task<VideoListResponseDto> Handle(GetAllVideosQuery request, CancellationToken cancellationToken)
        {
            try
            {
                IEnumerable<Domain.Entities.Video> videos;
                int totalCount;

                // Filter by tags if provided
                if (request.Tags != null && request.Tags.Any())
                {
                    videos = await _videoRepository.GetByTagsAsync(request.Tags);
                    totalCount = videos.Count();
                    
                    // Apply pagination manually
                    videos = videos
                        .Skip((request.PageNumber - 1) * request.PageSize)
                        .Take(request.PageSize);
                }
                else
                {
                    // Get paginated videos
                    videos = await _videoRepository.GetAllWithPaginationAsync(request.PageNumber, request.PageSize);
                    totalCount = await _videoRepository.GetTotalCountAsync();
                }

                // Map to DTOs
                var videoDtos = videos.Select(v => new VideoDto
                {
                    Id = v.Id,
                    Title = v.Title,
                    Description = v.Description,
                    Duration = v.Duration,
                    UploadDate = v.Timestamp,
                    Status = v.Status.ToString(),
                    ThumbnailUrl = v.ThumbnailUrl,
                    Tags = v.Tags
                });

                // Create response
                var response = new VideoListResponseDto
                {
                    Videos = videoDtos,
                    TotalCount = totalCount,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving videos");
                throw;
            }
        }
    }
}
