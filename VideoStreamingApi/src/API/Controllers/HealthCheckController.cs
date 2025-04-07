using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using VideoStreamingApi.Infrastructure.Data;

namespace VideoStreamingApi.API.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthCheckController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly ILogger<HealthCheckController> _logger;

        public HealthCheckController(
            ApplicationDbContext dbContext,
            IConfiguration configuration,
            ILogger<HealthCheckController> logger)
        {
            _dbContext = dbContext;
            _configuration = configuration;
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
                    Version = GetApplicationVersion(),
                    Environment = _configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production",
                    Database = await CheckDatabaseConnection(),
                    Storage = CheckStorageAccess(),
                    FFmpeg = CheckFFmpegAccess()
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

        private string GetApplicationVersion()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var version = assembly.GetName().Version;
            return version?.ToString() ?? "1.0.0";
        }

        private async Task<object> CheckDatabaseConnection()
        {
            try
            {
                // Check if the database is available
                var canConnect = await _dbContext.Database.CanConnectAsync();
                
                if (!canConnect)
                {
                    return new { Status = "Unhealthy", Message = "Cannot connect to database" };
                }

                // Get database provider and connection string (masked for security)
                var provider = _dbContext.Database.ProviderName;
                var connectionString = _configuration["DB_CONNECTION_STRING"] ?? "Not configured";
                var maskedConnectionString = MaskConnectionString(connectionString);

                return new
                {
                    Status = "Healthy",
                    Provider = provider,
                    ConnectionString = maskedConnectionString
                };
            }
            catch (Exception ex)
            {
                return new { Status = "Unhealthy", Message = ex.Message };
            }
        }

        private object CheckStorageAccess()
        {
            try
            {
                var storagePath = _configuration["STORAGE_PATH"] ?? "./videos";
                var directoryExists = Directory.Exists(storagePath);
                var isWritable = false;

                if (directoryExists)
                {
                    // Check if directory is writable by creating a temporary file
                    var tempFilePath = Path.Combine(storagePath, $"health_check_{Guid.NewGuid()}.tmp");
                    try
                    {
                        using (var fs = System.IO.File.Create(tempFilePath, 1, FileOptions.DeleteOnClose))
                        {
                            // If we get here, the directory is writable
                            isWritable = true;
                        }
                    }
                    catch
                    {
                        isWritable = false;
                    }
                }

                return new
                {
                    Status = directoryExists && isWritable ? "Healthy" : "Unhealthy",
                    Path = storagePath,
                    Exists = directoryExists,
                    Writable = isWritable
                };
            }
            catch (Exception ex)
            {
                return new { Status = "Unhealthy", Message = ex.Message };
            }
        }

        private object CheckFFmpegAccess()
        {
            try
            {
                var ffmpegPath = _configuration["FFMPEG_PATH"] ?? "/usr/bin/ffmpeg";
                var fileExists = System.IO.File.Exists(ffmpegPath);

                // Try to execute ffmpeg -version to check if it's working
                var isExecutable = false;
                var version = "Unknown";

                if (fileExists)
                {
                    try
                    {
                        var startInfo = new System.Diagnostics.ProcessStartInfo
                        {
                            FileName = ffmpegPath,
                            Arguments = "-version",
                            RedirectStandardOutput = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        };

                        using (var process = System.Diagnostics.Process.Start(startInfo))
                        {
                            if (process != null)
                            {
                                version = process.StandardOutput.ReadLine() ?? "Unknown";
                                process.WaitForExit(1000);
                                isExecutable = process.ExitCode == 0;
                            }
                        }
                    }
                    catch
                    {
                        isExecutable = false;
                    }
                }

                return new
                {
                    Status = fileExists && isExecutable ? "Healthy" : "Unhealthy",
                    Path = ffmpegPath,
                    Exists = fileExists,
                    Executable = isExecutable,
                    Version = version
                };
            }
            catch (Exception ex)
            {
                return new { Status = "Unhealthy", Message = ex.Message };
            }
        }

        private string MaskConnectionString(string connectionString)
        {
            // Mask password in connection string for security
            if (string.IsNullOrEmpty(connectionString))
            {
                return connectionString;
            }

            var parts = connectionString.Split(';');
            for (int i = 0; i < parts.Length; i++)
            {
                if (parts[i].StartsWith("Password=", StringComparison.OrdinalIgnoreCase) ||
                    parts[i].StartsWith("Pwd=", StringComparison.OrdinalIgnoreCase))
                {
                    var keyValue = parts[i].Split('=', 2);
                    if (keyValue.Length == 2)
                    {
                        parts[i] = $"{keyValue[0]}=*****";
                    }
                }
            }

            return string.Join(';', parts);
        }
    }
}
