using MediatR;
using Microsoft.AspNetCore.Http;
using VideoStreamingApi.Application.DTOs;

namespace VideoStreamingApi.Application.Commands.Videos
{
    public class UploadThumbnailCommand : IRequest<VideoDto>
    {
        public Guid VideoId { get; set; }
        public IFormFile ThumbnailFile { get; set; } = null!;
    }
}
