# Starting Guardrails.AI Server

## Quick Start

Guardrails.AI is now installed. Here's how to start it:

### Option 1: Using the config file (Recommended)

```bash
cd ~/Documents/02AI/LLMGuard/nebula-gate-ai
guardrails start --config config.py --port 8000
```

### Option 2: Using .guardrailsrc

```bash
cd ~/Documents/02AI/LLMGuard/nebula-gate-ai
guardrails start
```

The `.guardrailsrc` file will be automatically detected.

### Option 3: With environment variables

```bash
export GUARDRAILS_USE_IN_MEMORY_STORAGE=true
guardrails start --port 8000
```

## Verify It's Running

Once started, test the server:

```bash
# Health check
curl http://localhost:8000/health

# API docs
curl http://localhost:8000/docs
```

Or open in browser:
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Configure in NebulaGateAI UI

1. Open http://localhost:3699
2. Click **"Guardrails.AI"** in the sidebar
3. Configure:
   - **Server Host**: `localhost:8000`
   - **Hub Token**: (Get from https://hub.guardrailsai.com if needed)
   - Enable/disable telemetry

## Troubleshooting

### Configuration Error

If you get "Configuration not provided" error:

1. Make sure `config.py` or `.guardrailsrc` exists
2. Run from the project directory
3. Or specify config explicitly: `guardrails start --config ./config.py`

### Port Already in Use

```bash
# Check what's using port 8000
lsof -i :8000

# Or use a different port
guardrails start --port 8001
```

### Permission Denied

```bash
# Use a higher port (> 1024)
guardrails start --port 8000
```

## Using with API Keys

To use LLM providers with Guardrails.AI:

### Set via Environment Variables

```bash
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export COHERE_API_KEY="..."

guardrails start --port 8000
```

### Or Update config.py

Edit `config.py` and add your keys:

```python
llm_api_keys={
    "openai": "sk-...",
    "anthropic": "sk-ant-...",
    "cohere": "...",
}
```

## Running in Background

### Using nohup

```bash
nohup guardrails start --port 8000 > guardrails.log 2>&1 &
```

### Using screen

```bash
screen -S guardrails
guardrails start --port 8000
# Press Ctrl+A, then D to detach
```

### Check if running

```bash
ps aux | grep guardrails
curl http://localhost:8000/health
```

## Stopping the Server

```bash
# Find the process
ps aux | grep guardrails

# Kill it
kill <PID>

# Or if you know the port
lsof -ti:8000 | xargs kill
```

## Next Steps

1. Start Guardrails.AI server
2. Configure it in the NebulaGateAI UI
3. Create guards and validators
4. Test with your LLM applications

## Learn More

- **Documentation**: https://docs.guardrailsai.com
- **Hub (Validators)**: https://hub.guardrailsai.com
- **Examples**: https://github.com/guardrails-ai/guardrails
