using System;

namespace VideoStreamingApi.Domain.Entities
{
    public class Rating
    {
        public Guid Id { get; set; }
        public Guid VideoId { get; set; }
        public Guid UserId { get; set; }
        public int RatingValue { get; set; }
        public DateTime Timestamp { get; set; }
        
        // Navigation property
        public Video? Video { get; set; }
    }
}
