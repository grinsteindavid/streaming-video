#!/bin/bash

set -e

echo "Building local Docker images for Video Streaming Platform"

# Build Video Streaming API image
echo "\n🔨 Building Video Streaming API image..."
cd VideoStreamingApi
docker build -t video-streaming-api:local -f Dockerfile.dev .
cd ..

# Build Admin Panel image
echo "\n🔨 Building Admin Panel image..."
cd admin-panel
docker build -t video-streaming-admin:local -f Dockerfile.dev .
cd ..

# Build Landing Page image
echo "\n🔨 Building Landing Page image..."
cd landing-page
docker build -t video-streaming-landing:local -f Dockerfile.dev .
cd ..

echo "\n✅ All local Docker images have been built successfully!"
echo "Run 'docker-compose up' to start the development environment."
