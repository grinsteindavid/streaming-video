using System;
using System.Threading.Tasks;

namespace VideoStreamingApi.Application.Services.Interfaces
{
    /// <summary>
    /// Service for managing video view statistics
    /// </summary>
    public interface IViewStatService
    {
        /// <summary>
        /// Records a view for the specified video
        /// </summary>
        /// <param name="videoId">The ID of the video being viewed</param>
        Task RecordViewAsync(Guid videoId);
    }
}
