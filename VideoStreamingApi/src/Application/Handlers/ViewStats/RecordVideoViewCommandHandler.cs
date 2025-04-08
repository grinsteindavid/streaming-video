using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Commands.ViewStats;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Handlers.ViewStats
{
    /// <summary>
    /// Handler for recording video view statistics
    /// </summary>
    public class RecordVideoViewCommandHandler : IRequestHandler<RecordVideoViewCommand, bool>
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<RecordVideoViewCommandHandler> _logger;

        /// <summary>
        /// Initializes a new instance of the RecordVideoViewCommandHandler class
        /// </summary>
        /// <param name="videoRepository">Repository for video operations</param>
        /// <param name="logger">Logger for the handler</param>
        public RecordVideoViewCommandHandler(
            IVideoRepository videoRepository,
            ILogger<RecordVideoViewCommandHandler> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        /// <summary>
        /// Handles the command to record a video view
        /// </summary>
        /// <param name="request">The command containing view information</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>True if the view was recorded successfully</returns>
        public async Task<bool> Handle(RecordVideoViewCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(request.VideoId);
                
                if (video == null)
                {
                    _logger.LogWarning("Attempted to record view for non-existent video {VideoId}", request.VideoId);
                    return false;
                }

                // Create view stat
                var viewStat = new ViewStat
                {
                    Id = Guid.NewGuid(),
                    VideoId = request.VideoId,
                    UserId = request.UserId,
                    Timestamp = DateTime.UtcNow,
                    WatchDuration = request.WatchDuration
                };

                video.ViewStats.Add(viewStat);
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording view stat for video {VideoId}", request.VideoId);
                return false;
            }
        }
    }
}
