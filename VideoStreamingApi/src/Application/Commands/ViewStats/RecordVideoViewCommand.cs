using MediatR;
using System;

namespace VideoStreamingApi.Application.Commands.ViewStats
{
    /// <summary>
    /// Command to record a view for a specific video
    /// </summary>
    public class RecordVideoViewCommand : IRequest<bool>
    {
        /// <summary>
        /// The ID of the video being viewed
        /// </summary>
        public Guid VideoId { get; set; }
        
        /// <summary>
        /// Optional user ID for authenticated users
        /// </summary>
        public Guid? UserId { get; set; }
        
        /// <summary>
        /// Initial watch duration in seconds (can be updated later)
        /// </summary>
        public int WatchDuration { get; set; }
    }
}
