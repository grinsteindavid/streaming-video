using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Commands.ViewStats;

namespace VideoStreamingApi.API.Controllers
{
    /// <summary>
    /// Controller responsible for handling video view statistics
    /// </summary>
    [ApiController]
    [Route("api/streaming/videos")]
    public class StreamingController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<StreamingController> _logger;

        /// <summary>
        /// Initializes a new instance of the StreamingController
        /// </summary>
        /// <param name="mediator">Mediator for handling commands</param>
        /// <param name="logger">Logger for the controller</param>
        public StreamingController(
            IMediator mediator,
            ILogger<StreamingController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Records a view for the specified video
        /// </summary>
        /// <param name="videoId">The ID of the video being viewed</param>
        /// <returns>A result indicating success or failure</returns>
        [HttpPost("{videoId}/record-view")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RecordView(Guid videoId)
        {
            try
            {
                if (videoId == Guid.Empty)
                {
                    return BadRequest("Invalid video ID");
                }

                var command = new RecordVideoViewCommand
                {
                    VideoId = videoId,
                    UserId = null, // Could be extracted from authenticated user in a real app
                    WatchDuration = 0 // Initial duration, would be updated later in a real app
                };

                var result = await _mediator.Send(command);
                
                if (!result)
                {
                    return NotFound($"Video with ID {videoId} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording view for video {VideoId}", videoId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while recording the view");
            }
        }
    }
}
