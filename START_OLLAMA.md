# Starting Ollama Server

## Quick Start

To start your Ollama server on port 11502:

```bash
OLLAMA_HOST=0.0.0.0:11502 ollama serve
```

Or to run it in the background:

```bash
OLLAMA_HOST=0.0.0.0:11502 ollama serve > ollama.log 2>&1 &
```

## Verify Ollama is Running

After starting, test the connection:

```bash
./test-ollama.sh
```

Or manually:

```bash
# Check if Ollama is responding
curl http://localhost:11502/api/tags

# List available models
curl http://localhost:11502/api/tags | jq '.models'
```

## Pull a Model (if needed)

If you don't have any models, pull one:

```bash
OLLAMA_HOST=0.0.0.0:11502 ollama pull llama2
# or
OLLAMA_HOST=0.0.0.0:11502 ollama pull mistral
```

## Start the Next.js Application

Once Ollama is running and you have models:

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:3699

## API Endpoints Available

Once the Next.js app is running, these endpoints will be available:

- `GET /api/ollama/health` - Check Ollama server status
- `GET /api/ollama/models` - List available models
- `POST /api/ollama/chat` - Send chat completion request
- `POST /api/ollama/generate` - Send text generation request

## Testing the API

### Check Health
```bash
curl http://localhost:3699/api/ollama/health
```

### List Models
```bash
curl http://localhost:3699/api/ollama/models
```

### Chat Completion
```bash
curl -X POST http://localhost:3699/api/ollama/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "messages": [
      {"role": "user", "content": "Hello! How are you?"}
    ]
  }'
```

### Generate Text
```bash
curl -X POST http://localhost:3699/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "prompt": "Tell me a short story"
  }'
```

## Troubleshooting

### Ollama not responding
- Check if Ollama process is running: `ps aux | grep ollama`
- Check if port is listening: `netstat -tuln | grep 11502` or `ss -tuln | grep 11502`
- Check logs: `tail -f ollama.log`

### Port already in use
If port 11502 is already in use, either:
1. Stop the other service using that port
2. Use a different port and update `.env` file:
   ```
   OLLAMA_BASE_URL=http://localhost:11434
   ```

### Connection refused from Next.js
- Ensure Ollama is bound to `0.0.0.0` not just `127.0.0.1`
- Check firewall rules
- Verify the port in `.env` matches where Ollama is running
