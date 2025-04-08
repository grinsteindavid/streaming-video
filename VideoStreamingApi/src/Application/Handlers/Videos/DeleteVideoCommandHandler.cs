using MediatR;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.Videos
{
    public class DeleteVideoCommandHandler : IRequestHandler<DeleteVideoCommand, bool>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<DeleteVideoCommandHandler> _logger;

        public DeleteVideoCommandHandler(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<DeleteVideoCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> Handle(DeleteVideoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(request.Id);
                
                if (video == null)
                {
                    return false;
                }

                // Delete video files from storage
                var storagePath = _configuration["STORAGE_PATH"] ?? "./videos";
                var videoDirectory = Path.Combine(storagePath, video.Id.ToString());
                
                if (Directory.Exists(videoDirectory))
                {
                    Directory.Delete(videoDirectory, true);
                }

                // Delete from database
                await _videoRepository.DeleteAsync(video);
                await _videoRepository.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting video {VideoId}", request.Id);
                return false;
            }
        }
    }
}
