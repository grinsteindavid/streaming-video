using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.IIS;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using HealthChecks.UI.Client;
using VideoStreamingApi.Domain.Interfaces;
using VideoStreamingApi.Infrastructure.Data;
using VideoStreamingApi.Infrastructure.Repositories;
using VideoStreamingApi.Application.Services.Interfaces;
using VideoStreamingApi.Application.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(options => 
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Video Streaming API", Version = "v1" });
});

// Configure database
var connectionString = builder.Configuration["DB_CONNECTION_STRING"] ?? 
    "Host=localhost;Database=videostreaming;Username=postgres;Password=postgres";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));


// Register repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IVideoRepository, VideoRepository>();

// Register services
builder.Services.AddScoped<IVideoProcessingService, VideoProcessingService>();

// Register MediatR and handlers
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("Database")
    .AddCheck("Storage", () => {
        var storagePath = builder.Configuration["STORAGE_PATH"] ?? "./videos";
        var directoryExists = Directory.Exists(storagePath);
        var isWritable = false;

        if (directoryExists)
        {
            try
            {
                var tempFilePath = Path.Combine(storagePath, $"health_check_{Guid.NewGuid()}.tmp");
                using (var fs = System.IO.File.Create(tempFilePath, 1, FileOptions.DeleteOnClose))
                {
                    isWritable = true;
                }
            }
            catch
            {
                isWritable = false;
            }
        }

        return directoryExists && isWritable 
            ? HealthCheckResult.Healthy("Storage is accessible")
            : HealthCheckResult.Unhealthy("Storage is not accessible");
    })
    .AddCheck("FFmpeg", () => {
        try
        {
            var ffmpegPath = builder.Configuration["FFMPEG_PATH"] ?? "/usr/bin/ffmpeg";
            var fileExists = File.Exists(ffmpegPath);

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

            var data = new Dictionary<string, object>
            {
                { "Path", ffmpegPath },
                { "Exists", fileExists },
                { "Executable", isExecutable },
                { "Version", version }
            };

            return fileExists && isExecutable 
                ? HealthCheckResult.Healthy("FFmpeg is accessible", data: data)
                : HealthCheckResult.Unhealthy("FFmpeg is not accessible", data: data);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"Error checking FFmpeg: {ex.Message}");
        }
    })
    .AddCheck("AppInfo", () => {
        try
        {
            var assembly = System.Reflection.Assembly.GetEntryAssembly();
            var version = assembly?.GetName().Version?.ToString() ?? "1.0.0";
            var startTime = System.Diagnostics.Process.GetCurrentProcess().StartTime;
            var uptime = DateTime.Now - startTime;

            var data = new Dictionary<string, object>
            {
                { "Version", version },
                { "StartTime", startTime.ToString("o") },
                { "Uptime", $"{uptime.Days}d {uptime.Hours}h {uptime.Minutes}m {uptime.Seconds}s" }
            };

            return HealthCheckResult.Healthy("Application is running", data: data);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"Error retrieving application info: {ex.Message}");
        }
    });


// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Configure file upload size limit
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 1073741824; // 1 GB
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1073741824; // 1 GB
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAll");

// Create storage directory if it doesn't exist
var storagePath = builder.Configuration["STORAGE_PATH"] ?? Path.Combine(app.Environment.ContentRootPath, "videos");
Directory.CreateDirectory(storagePath);

app.UseAuthorization();

app.MapControllers();

// Map health check endpoint with UI
app.MapHealthChecks("/health-check", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Run();
