using Microsoft.AspNetCore.Mvc;
using VideoStreamingApi.Application.Services.Interfaces;

namespace VideoStreamingApi.API.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthCheckController : ControllerBase
    {
        private readonly IHealthCheckService _healthCheckService;
        private readonly ILogger<HealthCheckController> _logger;

        public HealthCheckController(
            IHealthCheckService healthCheckService,
            ILogger<HealthCheckController> logger)
        {
            _healthCheckService = healthCheckService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> CheckHealth()
        {
            try
            {
                var healthStatus = new
                {
                    Status = "Healthy",
                    Timestamp = DateTime.UtcNow,
                    Version = _healthCheckService.GetApplicationVersion(),
                    Environment = "Production",
                    Database = await _healthCheckService.CheckDatabaseConnection(),
                    Storage = _healthCheckService.CheckStorageAccess(),
                    FFmpeg = _healthCheckService.CheckFFmpegAccess()
                };

                return Ok(healthStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking health status");
                
                return StatusCode(500, new
                {
                    Status = "Unhealthy",
                    Timestamp = DateTime.UtcNow,
                    Error = ex.Message
                });
            }
        }


    }
}
