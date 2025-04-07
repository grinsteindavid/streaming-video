using VideoStreamingApi.Domain.Entities;

namespace VideoStreamingApi.Application.DTOs
{
    public class VideoDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        public DateTime UploadDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class VideoDetailsDto : VideoDto
    {
        public IEnumerable<VideoFileDto> VideoFiles { get; set; } = new List<VideoFileDto>();
        public int ViewCount { get; set; }
        public double AverageRating { get; set; }
    }

    public class VideoFileDto
    {
        public Guid Id { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public long Size { get; set; }
    }

    public class VideoListResponseDto
    {
        public IEnumerable<VideoDto> Videos { get; set; } = new List<VideoDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
