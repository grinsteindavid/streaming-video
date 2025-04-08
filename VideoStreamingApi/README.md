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
- **User Interactions**: Store ratings, likes, and comments
- **Performance Metrics**: Monitor streaming quality and errors

## Tech Stack
- **Framework**: .NET 8 Minimal API
- **Database**: PostgreSQL
- **Media Processing**: FFmpeg
- **Storage**: File system for raw and processed videos

## Database Schema

### Videos
- `id` (UUID) - Primary key
- `title` (string) - Video title
- `description` (text) - Video description
- `status` (enum) - Processing status
- `thumbnail_url` (string) - URL to thumbnail
- `tags` (string[]) - Array of tags
- `timestamp` (timestamp) - When the video was created
- `is_featured` (boolean) - Whether the video is featured
- `is_new` (boolean) - Whether the video is new


### VideoFiles
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `file_path` (string) - Path to HLS playlist
- `duration` (int) - Duration in seconds
- `size` (long) - File size in bytes
- `timestamp` (timestamp) - When the file was created

### ViewStats
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `user_id` (UUID) - Foreign key to Users (nullable)
- `timestamp` (timestamp) - When the view occurred
- `watch_duration` (int) - Seconds watched

### Ratings
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `user_id` (UUID) - Foreign key to Users
- `rating` (int) - Rating value (1-5)
- `timestamp` (timestamp) - When the rating was given

### Subtitles
- `id` (UUID) - Primary key
- `video_id` (UUID) - Foreign key to Videos
- `language` (string) - Subtitle language code
- `file_path` (string) - Path to subtitle file
- `timestamp` (timestamp) - When the subtitle was created

## Getting Started

### Prerequisites
Option 1 (Local Development):
- .NET 8 SDK
- PostgreSQL 14+
- FFmpeg

Option 2 (Docker):
- Docker
- Docker Compose

### Installation

#### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/grinsteindavid/video-streaming-api.git

# Navigate to the project directory
cd video-streaming-api

# Install dependencies
dotnet restore

# Install EF Core tools if not already installed
dotnet tool install --global dotnet-ef

# Set up the database
dotnet ef database update

# Start the API
dotnet run
```

#### Option 2: Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/grinsteindavid/video-streaming-api.git

# Navigate to the project directory
cd video-streaming-api

# Start the services with Docker Compose
docker-compose up -d

# The API will be available at http://localhost:5000
```

### Environment Variables
For local development, create a `.env` file with the following variables:
```
DB_CONNECTION_STRING=Host=localhost;Database=videostreaming;Username=postgres;Password=postgres
STORAGE_PATH=/path/to/video/storage
FFMPEG_PATH=/usr/bin/ffmpeg
```

When using Docker, these variables are already configured in the docker-compose.yml file.

## License
MIT
