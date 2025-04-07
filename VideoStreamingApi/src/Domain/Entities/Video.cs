using System;
using System.Collections.Generic;

namespace VideoStreamingApi.Domain.Entities
{
    public class Video
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        public DateTime UploadDate { get; set; }
        public VideoStatus Status { get; set; }
        public string ThumbnailUrl { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        
        // Navigation properties
        public ICollection<VideoFile> VideoFiles { get; set; } = new List<VideoFile>();
        public ICollection<ViewStat> ViewStats { get; set; } = new List<ViewStat>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }

    public enum VideoStatus
    {
        Uploading,
        Processing,
        Ready,
        Failed
    }
}
