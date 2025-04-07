using MediatR;
using Microsoft.AspNetCore.Mvc;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.Queries.Videos;

namespace VideoStreamingApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<VideosController> _logger;

        public VideosController(IMediator mediator, ILogger<VideosController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/videos
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] List<string>? tags = null)
        {
            try
            {
                var query = new GetAllVideosQuery
                {
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    Tags = tags
                };

                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting videos");
                return StatusCode(500, "An error occurred while retrieving videos");
            }
        }

        // GET: api/videos/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var query = new GetVideoByIdQuery { Id = id };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting video {VideoId}", id);
                return StatusCode(500, "An error occurred while retrieving the video");
            }
        }

        // POST: api/videos
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateVideoCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating video");
                return StatusCode(500, "An error occurred while creating the video");
            }
        }

        // PUT: api/videos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVideoCommand command)
        {
            try
            {
                if (id != command.Id)
                {
                    return BadRequest("ID in URL does not match ID in request body");
                }

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating video {VideoId}", id);
                return StatusCode(500, "An error occurred while updating the video");
            }
        }

        // DELETE: api/videos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var command = new DeleteVideoCommand { Id = id };
                var result = await _mediator.Send(command);

                if (!result)
                {
                    return NotFound($"Video with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting video {VideoId}", id);
                return StatusCode(500, "An error occurred while deleting the video");
            }
        }
    }
}
