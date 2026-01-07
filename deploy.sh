#!/bin/bash

# 1. Pull the latest code
echo "⬇️ Pulling latest changes..."
git pull

# 2. Rebuild and restart containers
echo "🔄 Rebuilding containers..."
docker compose up -d --build --force-recreate

# 3. Cleanup unused images (optional, saves space)
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment Complete!"
