using Microsoft.AspNetCore.Mvc;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.API.Controllers
{
    [ApiController]
    [Route("api/streaming/videos/{id}")]
    public class StreamingController : ControllerBase
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<StreamingController> _logger;

        public StreamingController(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<StreamingController> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        // GET: api/videos/{id}/streaming
        [HttpGet]
        public async Task<IActionResult> StreamVideo(Guid id)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(id);
                
                if (video == null)
                {
                    return NotFound($"Video with ID {id} not found");
                }

                if (video.Status != VideoStatus.Ready)
                {
                    return BadRequest($"Video is not ready for streaming. Current status: {video.Status}");
                }

                // Find the HLS playlist file
                var hlsFile = video.VideoFiles.FirstOrDefault(vf => vf.FilePath.EndsWith(".m3u8"));
                
                if (hlsFile == null)
                {
                    return NotFound("HLS playlist not found for this video");
                }

                // In a real application, we would serve the HLS playlist
                // For now, we'll just return a placeholder response
                return Ok(new { StreamUrl = $"/api/videos/{id}/streaming/hls/playlist.m3u8" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error streaming video {VideoId}", id);
                return StatusCode(500, "An error occurred while streaming the video");
            }
        }

        // GET: api/videos/{id}/streaming/hls/{filename}
        [HttpGet("hls/{filename}")]
        public async Task<IActionResult> GetHlsFile(Guid id, string filename)
        {
            try
            {
                var video = await _videoRepository.GetByIdAsync(id);
                
                if (video == null)
                {
                    return NotFound($"Video with ID {id} not found");
                }

                var storagePath = _configuration["STORAGE_PATH"] ?? "./videos";
                var videoDirectory = Path.Combine(storagePath, id.ToString());
                var filePath = Path.Combine(videoDirectory, filename);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound($"File {filename} not found for video {id}");
                }

                // Record view statistic asynchronously (don't wait for it to complete)
                _ = Task.Run(() => RecordViewStatAsync(id));

                // Determine content type based on file extension
                var contentType = filename.EndsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/MP2T";

                // Stream the file
                var fileStream = System.IO.File.OpenRead(filePath);
                return File(fileStream, contentType, enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error serving HLS file {Filename} for video {VideoId}", filename, id);
                return StatusCode(500, "An error occurred while serving the video file");
            }
        }

        // GET: api/videos/{id}/streaming/thumbnail
        [HttpGet("thumbnail")]
        public async Task<IActionResult> GetThumbnail(Guid id)
        {
            try
            {
                var video = await _videoRepository.GetByIdAsync(id);
                
                if (video == null)
                {
                    return NotFound($"Video with ID {id} not found");
                }

                var storagePath = _configuration["STORAGE_PATH"] ?? "./videos";
                var thumbnailPath = Path.Combine(storagePath, id.ToString(), "thumbnail.jpg");

                if (!System.IO.File.Exists(thumbnailPath))
                {
                    // Return default thumbnail
                    return File("~/default-thumbnail.jpg", "image/jpeg");
                }

                var fileStream = System.IO.File.OpenRead(thumbnailPath);
                return File(fileStream, "image/jpeg");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error serving thumbnail for video {VideoId}", id);
                return StatusCode(500, "An error occurred while serving the thumbnail");
            }
        }

        private async Task RecordViewStatAsync(Guid videoId)
        {
            try
            {
                var video = await _videoRepository.GetVideoWithDetailsAsync(videoId);
                
                if (video == null)
                {
                    return;
                }

                // Create view stat
                var viewStat = new ViewStat
                {
                    Id = Guid.NewGuid(),
                    VideoId = videoId,
                    UserId = null, // Anonymous view
                    Timestamp = DateTime.UtcNow,
                    WatchDuration = 0 // Initial duration, would be updated later in a real app
                };

                video.ViewStats.Add(viewStat);
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording view stat for video {VideoId}", videoId);
            }
        }
    }
}
