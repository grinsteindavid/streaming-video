using System;
using System.Threading.Tasks;

namespace VideoStreamingApi.Application.Services.Interfaces
{
    /// <summary>
    /// Service for performing health checks on various system components
    /// </summary>
    public interface IHealthCheckService
    {
        /// <summary>
        /// Gets the current application version
        /// </summary>
        string GetApplicationVersion();

        /// <summary>
        /// Checks the database connection status
        /// </summary>
        Task<object> CheckDatabaseConnection();

        /// <summary>
        /// Checks if the storage path is accessible and writable
        /// </summary>
        object CheckStorageAccess();

        /// <summary>
        /// Checks if FFmpeg is installed and accessible
        /// </summary>
        object CheckFFmpegAccess();

        /// <summary>
        /// Masks sensitive information in a connection string
        /// </summary>
        /// <param name="connectionString">The connection string to mask</param>
        string MaskConnectionString(string connectionString);
    }
}
