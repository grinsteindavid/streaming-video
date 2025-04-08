using Microsoft.AspNetCore.Http;

namespace VideoStreamingApi.API.Models
{
    /// <summary>
    /// Model for subtitle upload requests
    /// </summary>
    public class SubtitleUploadModel
    {
        /// <summary>
        /// Language code for the subtitle (e.g., "en-US", "es", "fr")
        /// </summary>
        public string Language { get; set; } = string.Empty;
        
        /// <summary>
        /// The subtitle file to upload
        /// </summary>
        public IFormFile File { get; set; } = null!;
    }
}
