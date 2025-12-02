# Docker Build Guide for NebulaGateAI

## Quick Fix: Rebuild Without Cache

The easiest way to rebuild after code changes:

```bash
./docker-rebuild.sh
```

Or manually:

```bash
# Stop containers
docker-compose down

# Remove old images
docker rmi nebula-gate-ai-nebulagate-ui:latest

# Rebuild without cache
docker-compose build --no-cache nebulagate-ui

# Start services
docker-compose up -d
```

## Why Docker Build Failed

Docker uses layer caching for faster builds. When you make code changes, Docker might use cached layers from previous builds. The `--no-cache` flag forces a fresh build.

## Building with Docker Compose

### Development Build

```bash
docker-compose up --build
```

### Production Build (No Cache)

```bash
docker-compose build --no-cache
docker-compose up -d
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nebulagate-ui
```

### Stop Services

```bash
docker-compose down
```

## Dockerfile Configuration

The Dockerfile uses a multi-stage build:

1. **deps** - Installs dependencies
2. **builder** - Builds the Next.js application
3. **runner** - Production runtime image

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://host.docker.internal:11502

# Guardrails.AI
GUARDRAILS_TOKEN=your_token_here
GUARDRAILS_BASE_URL=https://api.guardrailsai.com

# LLM API Keys (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
COHERE_API_KEY=...

# Application Settings
NODE_ENV=production
PORT=3699
```

### Important: Ollama in Docker

When Ollama runs on the host machine and the app runs in Docker:

```bash
# Use this URL in .env
OLLAMA_BASE_URL=http://host.docker.internal:11502
```

When Ollama runs in a Docker container:

```bash
# Use the container name
OLLAMA_BASE_URL=http://ollama:11502
```

## Accessing the Application

Once running:

- **Frontend**: http://localhost:3699
- **Guardrails.AI Server**: http://localhost:8000
- **NeMo Guardrails**: http://localhost:8001

## Troubleshooting

### Build fails with CSS errors

This usually means Docker is using cached layers. Solution:

```bash
docker-compose build --no-cache nebulagate-ui
```

### Can't connect to Ollama from Docker

1. Check Ollama is running: `curl http://localhost:11502/api/tags`
2. Use `host.docker.internal` instead of `localhost` in `.env`
3. Ensure Ollama binds to `0.0.0.0`: `OLLAMA_HOST=0.0.0.0:11502 ollama serve`

### Port already in use

Check if the port is already in use:

```bash
lsof -i :3699
# or
netstat -tuln | grep 3699
```

Kill the process or change the port in `docker-compose.yml`:

```yaml
ports:
  - "3700:3699"  # External:Internal
```

### View build output

```bash
docker-compose build --no-cache --progress=plain nebulagate-ui
```

### Remove all containers and images

```bash
docker-compose down --rmi all --volumes --remove-orphans
```

### Clean Docker cache completely

```bash
docker system prune -a --volumes
```

**Warning**: This removes all unused containers, networks, images, and volumes!

## Performance Tips

1. **Use .dockerignore** to exclude unnecessary files:
   ```
   node_modules
   .next
   .git
   *.log
   ```

2. **Layer caching**: Don't change package.json frequently. It triggers rebuild of all layers.

3. **Build time**: Initial build takes 2-5 minutes. Subsequent builds with cache are faster.

## Production Deployment

For production, ensure:

1. Set `NODE_ENV=production` in environment
2. Use proper secrets management (not .env files)
3. Set up proper logging and monitoring
4. Configure restart policies in docker-compose.yml
5. Use Docker secrets for sensitive data

## Monitoring

```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Inspect container
docker inspect nebulagate-ui

# Execute commands in container
docker exec -it nebulagate-ui sh
```
