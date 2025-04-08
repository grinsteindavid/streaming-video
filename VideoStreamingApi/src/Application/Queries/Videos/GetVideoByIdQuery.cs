using MediatR;
using VideoStreamingApi.Application.DTOs;

namespace VideoStreamingApi.Application.Queries.Videos
{
    public class GetVideoByIdQuery : IRequest<VideoDetailsDto>
    {
        public Guid Id { get; set; }
    }
}
