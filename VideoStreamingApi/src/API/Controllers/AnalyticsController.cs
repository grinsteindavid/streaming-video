using Microsoft.AspNetCore.Mvc;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.API.Controllers
{
    [ApiController]
    [Route("api/analytics")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IVideoRepository _videoRepository;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(
            IVideoRepository videoRepository,
            ILogger<AnalyticsController> logger)
        {
            _videoRepository = videoRepository;
            _logger = logger;
        }

        // GET: api/analytics/videos/{id}
        [HttpGet("videos/{id}")]
        public async Task<IActionResult> GetVideoAnalytics(Guid id)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(id);
                
                if (video == null)
                {
                    return NotFound($"Video with ID {id} not found");
                }

                // Calculate analytics
                var totalViews = video.ViewStats.Count;
                var uniqueViewers = video.ViewStats.Select(vs => vs.UserId).Where(id => id != null).Distinct().Count();
                var averageWatchDuration = video.ViewStats.Any() ? video.ViewStats.Average(vs => vs.WatchDuration) : 0;
                var averageRating = video.Ratings.Any() ? video.Ratings.Average(r => r.RatingValue) : 0;
                var ratingDistribution = new int[5];
                
                foreach (var rating in video.Ratings)
                {
                    if (rating.RatingValue >= 1 && rating.RatingValue <= 5)
                    {
                        ratingDistribution[rating.RatingValue - 1]++;
                    }
                }

                // Group views by day
                var viewsByDay = video.ViewStats
                    .GroupBy(vs => vs.Timestamp.Date)
                    .Select(g => new { Date = g.Key, Count = g.Count() })
                    .OrderBy(x => x.Date)
                    .ToList();

                return Ok(new
                {
                    VideoId = video.Id,
                    Title = video.Title,
                    TotalViews = totalViews,
                    UniqueViewers = uniqueViewers,
                    AverageWatchDuration = averageWatchDuration,
                    AverageRating = averageRating,
                    RatingDistribution = ratingDistribution,
                    ViewsByDay = viewsByDay
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics for video {VideoId}", id);
                return StatusCode(500, "An error occurred while retrieving video analytics");
            }
        }
    }
}
