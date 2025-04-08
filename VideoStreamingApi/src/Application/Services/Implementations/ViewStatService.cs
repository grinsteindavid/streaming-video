using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Services.Interfaces;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Services.Implementations
{
    /// <summary>
    /// Implementation of the view statistics service
    /// </summary>
    public class ViewStatService : IViewStatService
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<ViewStatService> _logger;

        public ViewStatService(
            IVideoRepository videoRepository,
            ILogger<ViewStatService> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        /// <summary>
        /// Records a view for the specified video
        /// </summary>
        /// <param name="videoId">The ID of the video being viewed</param>
        public async Task RecordViewAsync(Guid videoId)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(videoId);
                
                if (video == null)
                {
                    return;
                }

                // Create view stat
                var viewStat = new ViewStat
                {
                    Id = Guid.NewGuid(),
                    VideoId = videoId,
                    UserId = null, // Anonymous view
                    Timestamp = DateTime.UtcNow,
                    WatchDuration = 0 // Initial duration, would be updated later in a real app
                };

                video.ViewStats.Add(viewStat);
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording view stat for video {VideoId}", videoId);
            }
        }
    }
}
