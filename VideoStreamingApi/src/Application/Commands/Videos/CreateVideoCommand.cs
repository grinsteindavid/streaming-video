using MediatR;
using VideoStreamingApi.Application.DTOs;

namespace VideoStreamingApi.Application.Commands.Videos
{
    public class CreateVideoCommand : IRequest<VideoDto>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public IFormFile VideoFile { get; set; } = null!;
    }
}
