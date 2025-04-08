using System;
using System.Threading.Tasks;
using VideoStreamingApi.Domain.Entities;

namespace VideoStreamingApi.Application.Services.Interfaces
{
    /// <summary>
    /// Service for processing video files
    /// </summary>
    public interface IVideoProcessingService
    {
        /// <summary>
        /// Process a raw video file into HLS format with multiple quality levels
        /// </summary>
        /// <param name="video">The video entity to process</param>
        /// <param name="rawFilePath">Path to the raw video file</param>
        /// <returns>A task representing the asynchronous operation</returns>
        Task ProcessVideoAsync(Video video, string rawFilePath);
    }
}
