# NebulaGateAI Deployment Guide

This guide covers various deployment options for NebulaGateAI.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Manual Deployment](#manual-deployment)
- [Environment Configuration](#environment-configuration)

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed (optional but recommended)

### Using Docker Compose (Recommended)

1. **Prepare configuration files**
```bash
# Copy example files
cp .env.example .env
cp nemo-config.example.json nemo-config.json

# Edit .env with your credentials
nano .env
```

2. **Configure environment variables**
```env
GUARDRAILS_TOKEN=your_jwt_token_here
GUARDRAILS_BASE_URL=https://api.guardrailsai.com
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

3. **Start services**
```bash
docker-compose up -d
```

4. **Verify deployment**
```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f nebulagate-ui
```

5. **Access the application**
- UI: http://localhost:3699
- Guardrails.AI: http://localhost:8000
- NeMo Guardrails: http://localhost:8001

### Manual Docker Build

```bash
# Build the image
docker build -t nebulagate-ai:latest .

# Run the container
docker run -d \
  -p 3699:3699 \
  --name nebulagate-ui \
  nebulagate-ai:latest

# View logs
docker logs -f nebulagate-ui
```

### Docker Best Practices

**Production Configuration**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nebulagate-ui:
    image: nebulagate-ai:latest
    restart: always
    ports:
      - "3699:3699"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3699"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nebula-gate-ai)

### Manual Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure Environment Variables**
Go to your Vercel dashboard and add environment variables from `.env.example`

## Manual Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "nebulagate-ai" -- start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

## Environment Configuration

### Required Environment Variables

```env
# Application
NODE_ENV=production
PORT=3699

# Guardrails.AI
GUARDRAILS_TOKEN=your_token
GUARDRAILS_BASE_URL=https://api.guardrailsai.com

# LLM API Keys (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
COHERE_API_KEY=...
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3699;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

### Health Checks

```bash
# Check application health
curl http://localhost:3699

# Check Docker container health
docker inspect --format='{{.State.Health.Status}}' nebulagate-ui
```

### Logs

```bash
# Docker logs
docker-compose logs -f nebulagate-ui

# PM2 logs
pm2 logs nebulagate-ai

# Application logs
tail -f /var/log/nebulagate/app.log
```

## Scaling

### Horizontal Scaling with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml nebulagate

# Scale services
docker service scale nebulagate_nebulagate-ui=3
```

### Load Balancing

Use Nginx or a cloud load balancer to distribute traffic across multiple instances.

## Security Considerations

1. **Use HTTPS** in production
2. **Secure environment variables** - never commit .env files
3. **Regular updates** - keep dependencies updated
4. **Rate limiting** - implement rate limiting for API endpoints
5. **CORS configuration** - configure allowed origins

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port 3699
lsof -i :3699

# Kill process
kill -9 <PID>
```

**Permission denied**
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
```

**Build failures**
```bash
# Clear cache and rebuild
docker-compose build --no-cache
```

## Backup and Restore

### Backup Configuration

```bash
# Backup all configs
tar -czf nebulagate-backup-$(date +%Y%m%d).tar.gz \
  .env nemo-config.json docker-compose.yml
```

### Restore Configuration

```bash
# Extract backup
tar -xzf nebulagate-backup-20250101.tar.gz
```

## Support

For deployment issues:
- Check the [GitHub Issues](https://github.com/yourusername/nebula-gate-ai/issues)
- Review documentation
- Contact support

---

**Happy Deploying! 🚀**
