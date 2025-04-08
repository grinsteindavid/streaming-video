using System;

namespace VideoStreamingApi.Domain.Entities
{
    /// <summary>
    /// Represents a subtitle file for a video
    /// </summary>
    public class Subtitle
    {
        /// <summary>
        /// Unique identifier for the subtitle
        /// </summary>
        public Guid Id { get; set; }
        
        /// <summary>
        /// Foreign key to the associated video
        /// </summary>
        public Guid VideoId { get; set; }
        
        /// <summary>
        /// Language code (e.g., "en-US", "es", "fr")
        /// </summary>
        public string Language { get; set; } = string.Empty;
        
        /// <summary>
        /// Path to the subtitle file
        /// </summary>
        public string FilePath { get; set; } = string.Empty;
        
        /// <summary>
        /// When the subtitle was created/uploaded
        /// </summary>
        public DateTime Timestamp { get; set; }
        
        /// <summary>
        /// Navigation property to the associated video
        /// </summary>
        public Video? Video { get; set; }
    }
}
