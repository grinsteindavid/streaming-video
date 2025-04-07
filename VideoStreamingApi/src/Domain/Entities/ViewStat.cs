using System;

namespace VideoStreamingApi.Domain.Entities
{
    public class ViewStat
    {
        public Guid Id { get; set; }
        public Guid VideoId { get; set; }
        public Guid? UserId { get; set; }
        public DateTime Timestamp { get; set; }
        public int WatchDuration { get; set; }
        
        // Navigation property
        public Video? Video { get; set; }
    }
}
