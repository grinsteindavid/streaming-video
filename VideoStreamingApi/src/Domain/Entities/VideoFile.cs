using System;

namespace VideoStreamingApi.Domain.Entities
{
    public class VideoFile
    {
        public Guid Id { get; set; }
        public Guid VideoId { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public long Size { get; set; }
        public DateTime Timestamp { get; set; }
        
        // Navigation property
        public Video? Video { get; set; }
    }
}
