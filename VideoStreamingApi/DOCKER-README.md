# Docker Setup for Video Streaming API

This document explains how to use the Docker setup for both development and production environments.

## Directory Structure

```
VideoStreamingApi/
├── data/
│   ├── postgres/  # Persistent PostgreSQL data
│   └── videos/    # Persistent video storage
├── docker-compose.yml        # Development setup
├── docker-compose.prod.yml   # Production setup
├── Dockerfile.dev            # Development Dockerfile with hot reload
└── Dockerfile.prod           # Production Dockerfile
```

## Development Environment

The development environment is configured to support real-time code changes with hot reload.

### Features

- **Hot Reload**: Changes to C# code are automatically detected and the application restarts
- **Persistent Storage**: Data is stored in local directories
- **Source Code Mounting**: The entire project is mounted into the container

### Usage

```bash
# Start the development environment
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop the environment
docker-compose down
```

## Production Environment

The production environment is optimized for performance and stability.

### Features

- **Optimized Build**: Application is compiled in Release mode
- **Persistent Storage**: Data is still stored in local directories for persistence
- **Restart Policy**: Containers automatically restart unless explicitly stopped

### Usage

```bash
# Start the production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop the environment
docker-compose -f docker-compose.prod.yml down
```

## Data Persistence

Both environments store data in the following local directories:

- **PostgreSQL Data**: `./data/postgres/`
- **Video Files**: `./data/videos/`

These directories persist data even when containers are stopped or removed.

## Health Checks

Both environments include health checks for the API and PostgreSQL services. You can check the health status with:

```bash
# For development
docker-compose ps

# For production
docker-compose -f docker-compose.prod.yml ps
```

You can also access the health check endpoint directly at: `http://localhost:5000/api/health`

## Switching Between Environments

When switching between development and production environments, make sure to stop one before starting the other to avoid port conflicts:

```bash
# Switch from development to production
docker-compose down
docker-compose -f docker-compose.prod.yml up -d

# Switch from production to development
docker-compose -f docker-compose.prod.yml down
docker-compose up -d
```
