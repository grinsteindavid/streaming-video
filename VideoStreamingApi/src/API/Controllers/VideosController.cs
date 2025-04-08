using MediatR;
using Microsoft.AspNetCore.Mvc;
using VideoStreamingApi.Application.Commands.Videos;
using VideoStreamingApi.Application.Queries.Videos;

namespace VideoStreamingApi.API.Controllers
{
    /// <summary>
    /// Controller for managing video metadata and content
    /// </summary>
    [ApiController]
    [Route("api/videos")]
    public class VideosController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<VideosController> _logger;

        public VideosController(IMediator mediator, ILogger<VideosController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Get all videos with optional filtering
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving videos");
            }
        }

        /// <summary>
        /// Get a specific video by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the video");
            }
        }

        /// <summary>
        /// Create a new video (metadata only)
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] CreateVideoCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating video");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the video");
            }
        }

        /// <summary>
        /// Upload a video file for an existing video
        /// </summary>
        [HttpPost("{id}/upload")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UploadVideo(Guid id, [FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file was uploaded");
                }

                var command = new UploadVideoFileCommand
                {
                    VideoId = id,
                    VideoFile = file
                };

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading video file for video {VideoId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while uploading the video file");
            }
        }

        /// <summary>
        /// Upload a thumbnail for an existing video
        /// </summary>
        [HttpPost("{id}/thumbnail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UploadThumbnail(Guid id, [FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file was uploaded");
                }

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return BadRequest("Invalid file type. Only JPEG and PNG are allowed.");
                }

                var command = new UploadThumbnailCommand
                {
                    VideoId = id,
                    ThumbnailFile = file
                };

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading thumbnail for video {VideoId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while uploading the thumbnail");
            }
        }

        /// <summary>
        /// Upload a subtitle file for an existing video
        /// </summary>
        [HttpPost("{id}/upload-subtitle")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UploadSubtitle(Guid id, [FromForm] string language, [FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file was uploaded");
                }

                if (string.IsNullOrWhiteSpace(language))
                {
                    return BadRequest("Language code is required");
                }

                // Validate file type
                var allowedExtensions = new[] { ".vtt", ".srt", ".sbv" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest($"Invalid file type. Allowed formats: {string.Join(", ", allowedExtensions)}");
                }

                var command = new UploadSubtitleCommand
                {
                    VideoId = id,
                    Language = language,
                    SubtitleFile = file
                };

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading subtitle for video {VideoId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while uploading the subtitle");
            }
        }

        /// <summary>
        /// Update a video's metadata
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the video");
            }
        }

        /// <summary>
        /// Delete a video
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the video");
            }
        }
    }
}
