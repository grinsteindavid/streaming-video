using MediatR;
using Microsoft.AspNetCore.Http;
using VideoStreamingApi.Application.DTOs;

namespace VideoStreamingApi.Application.Commands.Videos
{
    public class UploadVideoFileCommand : IRequest<VideoDto>
    {
        public Guid VideoId { get; set; }
        public IFormFile VideoFile { get; set; } = null!;
    }
}
