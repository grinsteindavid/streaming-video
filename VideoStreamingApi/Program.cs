using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.IIS;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using HealthChecks.UI.Client;
using VideoStreamingApi.Domain.Interfaces;
using VideoStreamingApi.Infrastructure.Data;
using VideoStreamingApi.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure database
var connectionString = builder.Configuration["DB_CONNECTION_STRING"] ?? 
    "Host=localhost;Database=videostreaming;Username=postgres;Password=postgres";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IVideoRepository, VideoRepository>();

// Register services
builder.Services.AddScoped<VideoStreamingApi.Application.Services.Interfaces.IViewStatService, VideoStreamingApi.Application.Services.Implementations.ViewStatService>();
builder.Services.AddScoped<VideoStreamingApi.Application.Services.Interfaces.IHealthCheckService, VideoStreamingApi.Application.Services.Implementations.HealthCheckService>();

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
            ? Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("Storage is accessible")
            : Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Unhealthy("Storage is not accessible");
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
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Run();
