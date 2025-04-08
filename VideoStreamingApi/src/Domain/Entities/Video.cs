using System;
using System.Collections.Generic;

namespace VideoStreamingApi.Domain.Entities
{
    /// <summary>
    /// Represents a video in the system
    /// </summary>
    public class Video
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        public DateTime Timestamp { get; set; } // Renamed from UploadDate to match schema
        public VideoStatus Status { get; set; }
        public string ThumbnailUrl { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public bool IsFeatured { get; set; }
        public bool IsNew { get; set; }
        
        // Navigation properties
        public ICollection<VideoFile> VideoFiles { get; set; } = new List<VideoFile>();
        public ICollection<ViewStat> ViewStats { get; set; } = new List<ViewStat>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
        public ICollection<Subtitle> Subtitles { get; set; } = new List<Subtitle>();
    }

    public enum VideoStatus
    {
        Uploading,
        Processing,
        Ready,
        Failed
    }
}
