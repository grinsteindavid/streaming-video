# Video Streaming API

## Overview
This is the backend API for our video streaming platform, built with C# and .NET 8. It provides endpoints for video management, streaming, and analytics.

## Features

### Video Management
- **Upload**: Secure video upload with progress tracking
- **Metadata Management**: Update titles, descriptions, and tags
- **Batch Operations**: Process multiple videos simultaneously
- **FFmpeg Integration**: Automatic conversion to HLS format

### Streaming
- **HLS Delivery**: Stream videos using HTTP Live Streaming protocol
- **Adaptive Bitrate**: Multiple quality levels based on bandwidth
- **Subtitle Support**: Manage and serve captions in multiple languages

### Analytics
- **View Tracking**: Record video views and watch duration
- **User Interactions**: Store ratings, likes, and comments
- **Performance Metrics**: Monitor streaming quality and errors

## Tech Stack
- **Framework**: .NET 8 Minimal API
- **Database**: PostgreSQL
- **Media Processing**: FFmpeg
- **Storage**: File system for raw and processed videos

## API Endpoints

### Video Management
- `POST /api/videos` - Upload a new video
- `PUT /api/videos/{id}` - Update video metadata
- `DELETE /api/videos/{id}` - Remove a video
- `GET /api/videos` - List all videos with pagination and filtering

### Video Streaming
- `GET /api/videos/{id}/stream` - Stream video in HLS format
- `GET /api/videos/{id}/subtitles/{language}` - Get subtitles
- `GET /api/videos/{id}/subtitles` - Get all available subtitles

### Analytics
- `GET /api/analytics/videos/{id}` - Get video performance metrics
- `POST /api/analytics/videos/{id}/view` - Record a video view

## Database Schema

### Videos
- `id` (UUID) - Primary key
- `title` (string) - Video title
- `description` (text) - Video description
- `duration` (int) - Duration in seconds
- `upload_date` (timestamp) - When the video was uploaded
- `status` (enum) - Processing status
- `thumbnail_url` (string) - URL to thumbnail
- `tags` (string[]) - Array of tags

### VideoFiles
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `quality` (string) - Resolution/quality level
- `file_path` (string) - Path to HLS playlist
- `size` (long) - File size in bytes

### ViewStats
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `user_id` (UUID) - Foreign key to Users (nullable)
- `timestamp` (timestamp) - When the view occurred
- `watch_duration` (int) - Seconds watched
- `ip_address` (string) - Viewer's IP address

### Ratings
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `user_id` (UUID) - Foreign key to Users
- `rating` (int) - Rating value (1-5)
- `timestamp` (timestamp) - When the rating was given

## Getting Started

### Prerequisites
- .NET 8 SDK
- PostgreSQL 14+
- FFmpeg

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/video-streaming-api.git

# Navigate to the project directory
cd video-streaming-api

# Install dependencies
dotnet restore

# Set up the database
dotnet ef database update

# Start the API
dotnet run
```

### Environment Variables
Create a `.env` file with the following variables:
```
DB_CONNECTION_STRING=Host=localhost;Database=videostreaming;Username=postgres;Password=yourpassword
STORAGE_PATH=/path/to/video/storage
FFMPEG_PATH=/usr/bin/ffmpeg
```

## License
MIT
