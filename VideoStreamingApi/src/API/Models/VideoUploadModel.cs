using Microsoft.AspNetCore.Http;

namespace VideoStreamingApi.API.Models
{
    /// <summary>
    /// Model for video file upload requests
    /// </summary>
    public class VideoUploadModel
    {
        /// <summary>
        /// The video file to upload
        /// </summary>
        public IFormFile File { get; set; } = null!;
    }
}
