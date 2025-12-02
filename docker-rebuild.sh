#!/bin/bash

# Docker Rebuild Script - Rebuilds without cache to ensure fresh build

echo "🔨 Rebuilding NebulaGateAI Docker container without cache..."
echo ""

# Stop and remove existing containers
echo "1. Stopping existing containers..."
docker-compose down

# Remove the specific image to force rebuild
echo "2. Removing old image..."
docker rmi nebulagate-ui:latest 2>/dev/null || true
docker rmi nebula-gate-ai-nebulagate-ui:latest 2>/dev/null || true

# Build without cache
echo "3. Building without cache..."
docker-compose build --no-cache nebulagate-ui

# Start the services
echo "4. Starting services..."
docker-compose up -d

echo ""
echo "✅ Done! Check the logs with: docker-compose logs -f nebulagate-ui"
