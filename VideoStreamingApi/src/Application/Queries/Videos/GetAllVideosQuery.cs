using MediatR;
using VideoStreamingApi.Application.DTOs;

namespace VideoStreamingApi.Application.Queries.Videos
{
    public class GetAllVideosQuery : IRequest<VideoListResponseDto>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<string>? Tags { get; set; }
    }
}
