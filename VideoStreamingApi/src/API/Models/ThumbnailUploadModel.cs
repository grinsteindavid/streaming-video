using Microsoft.AspNetCore.Http;

namespace VideoStreamingApi.API.Models
{
    /// <summary>
    /// Model for thumbnail upload requests
    /// </summary>
    public class ThumbnailUploadModel
    {
        /// <summary>
        /// The thumbnail image file to upload
        /// </summary>
        public IFormFile File { get; set; } = null!;
    }
}
