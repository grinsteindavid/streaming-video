using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using VideoStreamingApi.Application.Services.Interfaces;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;

namespace VideoStreamingApi.Application.Services.Implementations
{
    /// <summary>
    /// Implementation of the video processing service
    /// </summary>
    public class VideoProcessingService : IVideoProcessingService
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<VideoProcessingService> _logger;

        /// <summary>
        /// Initializes a new instance of the VideoProcessingService class
        /// </summary>
        public VideoProcessingService(
            IVideoRepository videoRepository,
            IConfiguration configuration,
            ILogger<VideoProcessingService> logger)
        {
            _videoRepository = videoRepository;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Process a raw video file into HLS format with multiple quality levels
        /// </summary>
        public async Task ProcessVideoAsync(Video video, string rawFilePath)
        {
            try
            {
                // Update status to processing
                video.Status = VideoStatus.Processing;
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();

                // Create HLS directory
                var videoDirectory = Path.GetDirectoryName(rawFilePath) ?? throw new InvalidOperationException("Invalid raw file path");
                var hlsDirectory = Path.Combine(videoDirectory, "hls");
                Directory.CreateDirectory(hlsDirectory);

                // Get FFmpeg path from configuration or use default
                var ffmpegPath = _configuration["FFMPEG_PATH"] ?? "ffmpeg";
                
                // Get video duration using FFmpeg
                var duration = await GetVideoDurationAsync(ffmpegPath, rawFilePath);
                video.Duration = (int)Math.Ceiling(duration);

                // Create HLS variants for different quality levels
                var playlistPath = Path.Combine(hlsDirectory, "playlist.m3u8");
                await CreateHlsVariantsAsync(ffmpegPath, rawFilePath, hlsDirectory);

                // Add HLS playlist file to database
                var hlsFile = new VideoFile
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    FilePath = playlistPath,
                    Size = new FileInfo(playlistPath).Length,
                    Timestamp = DateTime.UtcNow
                };

                video.VideoFiles.Add(hlsFile);
                video.Status = VideoStatus.Ready;

                // Save changes
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
                
                _logger.LogInformation("Successfully processed video {VideoId}", video.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing video {VideoId}", video.Id);
                
                // Update status to failed
                video.Status = VideoStatus.Failed;
                await _videoRepository.UpdateAsync(video);
                await _videoRepository.SaveChangesAsync();
                
                throw;
            }
        }

        /// <summary>
        /// Get video duration using FFmpeg
        /// </summary>
        private async Task<double> GetVideoDurationAsync(string ffmpegPath, string videoPath)
        {
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = $"-i \"{videoPath}\" -show_entries format=duration -v quiet -of csv=\"p=0\" -sexagesimal",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                if (process == null)
                {
                    throw new Exception("Could not start FFmpeg process");
                }

                var output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    throw new Exception($"FFmpeg exited with code {process.ExitCode}");
                }

                // Parse duration (format: HH:MM:SS.MS)
                var timeComponents = output.Trim().Split(':');
                if (timeComponents.Length >= 3)
                {
                    var hours = double.Parse(timeComponents[0]);
                    var minutes = double.Parse(timeComponents[1]);
                    var seconds = double.Parse(timeComponents[2]);
                    return hours * 3600 + minutes * 60 + seconds;
                }

                return 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting video duration for {VideoPath}", videoPath);
                return 0;
            }
        }

        /// <summary>
        /// Create HLS variants for different quality levels
        /// </summary>
        private async Task CreateHlsVariantsAsync(string ffmpegPath, string videoPath, string outputDirectory)
        {
            try
            {
                // Create master playlist and variants for 480p, 720p, and 1080p
                var startInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = $"-i \"{videoPath}\" " +
                               $"-filter_complex \"" +
                               $"[0:v]split=3[v1][v2][v3]; " +
                               $"[v1]scale=w=842:h=480[v1out]; " +
                               $"[v2]scale=w=1280:h=720[v2out]; " +
                               $"[v3]scale=w=1920:h=1080[v3out]\" " +
                               $"-map [v1out] -c:v:0 libx264 -b:v:0 1000k -maxrate:v:0 1200k -bufsize:v:0 1500k " +
                               $"-map [v2out] -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 3000k -bufsize:v:1 3500k " +
                               $"-map [v3out] -c:v:2 libx264 -b:v:2 5000k -maxrate:v:2 5500k -bufsize:v:2 7000k " +
                               $"-map 0:a -c:a aac -b:a 128k -ac 2 " +
                               $"-var_stream_map \"v:0,a:0 v:1,a:0 v:2,a:0\" " +
                               $"-master_pl_name playlist.m3u8 " +
                               $"-f hls -hls_time 6 -hls_list_size 0 " +
                               $"-hls_segment_filename \"{outputDirectory}/stream_%v/segment_%03d.ts\" " +
                               $"\"{outputDirectory}/stream_%v.m3u8\" -y",
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                if (process == null)
                {
                    throw new Exception("Could not start FFmpeg process");
                }

                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    var error = await process.StandardError.ReadToEndAsync();
                    throw new Exception($"FFmpeg exited with code {process.ExitCode}: {error}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating HLS variants for {VideoPath}", videoPath);
                throw;
            }
        }
    }
}
