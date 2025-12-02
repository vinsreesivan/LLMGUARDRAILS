# NebulaGateAI Setup Guide

Complete installation and setup guide for NebulaGateAI and its backend services: Guardrails AI, NeMo Guardrails (with NemoGuard), and Ollama.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installing Guardrails AI](#installing-guardrails-ai)
- [Installing NeMo Guardrails with NemoGuard](#installing-nemo-guardrails-with-nemoguard)
- [Installing Ollama](#installing-ollama)
- [Installing NebulaGateAI](#installing-nebulagateai)
- [Integration & Verification](#integration--verification)
- [Troubleshooting](#troubleshooting)

## Overview

NebulaGateAI is a frontend UI for managing two powerful guardrails systems:
- **Guardrails AI**: Enterprise-grade LLM guardrails with validators and Hub integration
- **NeMo Guardrails**: NVIDIA's programmable guardrails toolkit with NemoGuard security features

This guide covers setting up all components from scratch.

## Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows (WSL2 recommended)
- **Python**: 3.8 or later (3.10+ recommended)
- **Node.js**: 20.x or later
- **RAM**: Minimum 8GB (16GB+ recommended for local LLMs)
- **Disk Space**: 10GB+ (more for local LLM models)

### Development Tools
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm git curl

# macOS (using Homebrew)
brew install python node git

# Windows (using WSL2)
# Install WSL2 first, then follow Ubuntu instructions
```

## Installing Guardrails AI

Guardrails AI provides enterprise-grade validation and guardrails for LLM applications.

### 1. Install Guardrails AI

```bash
# Create a virtual environment
python3 -m venv guardrails-env
source guardrails-env/bin/activate  # On Windows: guardrails-env\Scripts\activate

# Install guardrails-ai
pip install guardrails-ai

# Verify installation
guardrails --version
```

### 2. Configure Guardrails Hub

```bash
# Create a Guardrails Hub account (if you don't have one)
# Visit: https://hub.guardrailsai.com/

# Login to the Hub
guardrails configure

# Enter your credentials when prompted:
# - Email
# - Password
# - Organization (optional)

# Your JWT token will be saved automatically
```

### 3. Install Validators

```bash
# Install common validators
guardrails hub install hub://guardrails/toxic_language
guardrails hub install hub://guardrails/regex_match
guardrails hub install hub://guardrails/profanity_free
guardrails hub install hub://guardrails/valid_length
guardrails hub install hub://guardrails/detect_pii

# List installed validators
guardrails hub list
```

### 4. Start Guardrails Server

```bash
# Start the server (default port 8000)
guardrails start --port 8000

# Or with specific configuration
guardrails start --port 8000 --host 0.0.0.0

# Verify server is running
curl http://localhost:8000/health
```

### 5. Set Environment Variables

```bash
# Get your JWT token
guardrails token

# Add to your .env file
echo "GUARDRAILS_TOKEN=your_jwt_token_here" >> .env
echo "GUARDRAILS_HOST=localhost" >> .env
echo "GUARDRAILS_PORT=8000" >> .env
```

### 6. Configure LLM API Keys

```bash
# Add LLM provider keys to .env
echo "OPENAI_API_KEY=sk-your-openai-key" >> .env
echo "ANTHROPIC_API_KEY=sk-ant-your-anthropic-key" >> .env
echo "COHERE_API_KEY=your-cohere-key" >> .env
```

## Installing NeMo Guardrails with NemoGuard

NeMo Guardrails is NVIDIA's toolkit for building programmable guardrails, including NemoGuard for jailbreak detection.

### 1. Install NeMo Guardrails

```bash
# Create a separate virtual environment
python3 -m venv nemo-env
source nemo-env/bin/activate  # On Windows: nemo-env\Scripts\activate

# Install NeMo Guardrails
pip install nemoguardrails

# For latest development version:
# pip install git+https://github.com/NVIDIA/NeMo-Guardrails.git

# Verify installation
python -c "import nemoguardrails; print(nemoguardrails.__version__)"
```

### 2. Install Additional Dependencies

```bash
# Install optional dependencies for full functionality
pip install sentence-transformers  # For embeddings
pip install annoy                   # For vector search
pip install aiohttp                 # For async HTTP
pip install fastapi uvicorn        # For server mode
```

### 3. Set Up NemoGuard

NemoGuard is built into NeMo Guardrails and provides jailbreak detection capabilities.

```bash
# Download NemoGuard models (automatic on first use)
# Models are downloaded from NVIDIA NGC when needed

# For manual download:
python -c "
from nemoguardrails.integrations.langchain.runnable_rails import RunnableRails
from nemoguardrails import LLMRails, RailsConfig

# This will trigger model download
config = RailsConfig.from_content(
    yaml_content='''
    models:
      - type: main
        engine: openai
        model: gpt-3.5-turbo
    rails:
      input:
        flows:
          - jailbreak detection
    ''',
    config_path='.'
)
"
```

### 4. Configure NeMo Guardrails

Create a configuration file:

```bash
# Create config directory
mkdir -p nemo-config

# Create config.yml
cat > nemo-config/config.yml << 'EOF'
models:
  - type: main
    engine: openai
    model: gpt-3.5-turbo

rails:
  input:
    flows:
      - jailbreak detection  # NemoGuard
      - input moderation
  output:
    flows:
      - output moderation
      - fact checking

# Enable jailbreak detection (NemoGuard)
jailbreak_detection:
  enabled: true
  threshold: 0.85

# Content safety moderation
content_moderation:
  enabled: true
  check_input: true
  check_output: true
EOF
```

### 5. Start NeMo Guardrails Server

```bash
# Start server with config
nemoguardrails server --config nemo-config --port 8001

# Or with verbose logging
nemoguardrails server --config nemo-config --port 8001 --verbose

# Verify server is running
curl http://localhost:8001/v1/rails/configs
```

### 6. Configure NVIDIA API Keys (for NIM models)

```bash
# Get your NVIDIA API key from: https://build.nvidia.com/

# Add to .env
echo "NVIDIA_API_KEY=nvapi-your-key-here" >> .env
```

## Installing Ollama

Ollama allows you to run open-source LLMs locally, providing a privacy-focused alternative to cloud APIs.

### 1. Install Ollama

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**macOS:**
```bash
# Download from https://ollama.com/download
# Or use Homebrew
brew install ollama
```

**Windows:**
Download installer from https://ollama.com/download

### 2. Start Ollama Service

```bash
# Start Ollama (runs on port 11434 by default)
ollama serve

# On macOS/Windows, Ollama runs as a background service automatically
```

### 3. Download Models

```bash
# Download popular models
ollama pull llama3          # Meta Llama 3 (8B)
ollama pull llama3:70b      # Meta Llama 3 (70B) - requires more RAM
ollama pull mistral         # Mistral 7B
ollama pull phi3            # Microsoft Phi-3
ollama pull codellama       # Code Llama

# List installed models
ollama list

# Test a model
ollama run llama3 "Hello, how are you?"
```

### 4. Configure Ollama with NeMo Guardrails

```bash
# Update nemo-config/config.yml
cat > nemo-config/config.yml << 'EOF'
models:
  - type: main
    engine: ollama
    model: llama3
    parameters:
      temperature: 0.7
      max_tokens: 2048
      top_p: 1.0
    base_url: http://localhost:11434

rails:
  input:
    flows:
      - jailbreak detection
      - input moderation
  output:
    flows:
      - output moderation

jailbreak_detection:
  enabled: true
  threshold: 0.85
EOF
```

### 5. Verify Ollama Integration

```bash
# Test Ollama API
curl http://localhost:11434/api/tags

# Test with NeMo Guardrails
curl -X POST http://localhost:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Installing NebulaGateAI

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/nebula-gate-ai.git
cd nebula-gate-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Add all your API keys and tokens:

```env
# Guardrails.AI Configuration
GUARDRAILS_TOKEN=your_jwt_token_from_guardrails_configure
GUARDRAILS_BASE_URL=https://api.guardrailsai.com
GUARDRAILS_HOST=localhost
GUARDRAILS_PORT=8000

# LLM API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
COHERE_API_KEY=your-cohere-key

# NVIDIA API Key (for NIM models)
NVIDIA_API_KEY=nvapi-your-nvidia-key

# Application Settings
NODE_ENV=development
PORT=3699
```

### 4. Start Development Server

```bash
npm run dev
```

Access at: http://localhost:3699

## Integration & Verification

### Complete System Check

With all services running, verify each component:

```bash
# 1. Check NebulaGateAI UI
curl http://localhost:3699
# Should return HTML

# 2. Check Guardrails AI Server
curl http://localhost:8000/health
# Should return: {"status": "healthy"}

# 3. Check NeMo Guardrails Server
curl http://localhost:8001/v1/rails/configs
# Should return config list

# 4. Check Ollama
curl http://localhost:11434/api/tags
# Should return model list
```

### Test End-to-End Flow

1. **Open NebulaGateAI UI**: http://localhost:3699

2. **Configure Guardrails AI**:
   - Navigate to "Guardrails.AI" tab
   - Your JWT token should auto-populate from .env
   - Add a test guard with validators

3. **Configure NeMo Guardrails with Ollama**:
   - Navigate to "NeMo Guardrails" tab
   - Click "Add Model"
   - Select engine: "Ollama"
   - Model: "llama3"
   - Base URL: "http://localhost:11434"
   - Enable "Jailbreak Detection" (NemoGuard)
   - Enable "Content Safety"

4. **Export Configuration**:
   - Navigate to "Export & Deploy"
   - Click "Export Configuration"
   - Verify all settings are correct

### Using Docker Compose (All-in-One)

For production deployment, use Docker Compose to run all services:

```bash
# Copy configuration files
cp .env.example .env
cp nemo-config.example.json nemo-config.json

# Edit configurations
nano .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Services will be available at:
- **NebulaGateAI UI**: http://localhost:3699
- **Guardrails AI**: http://localhost:8000
- **NeMo Guardrails**: http://localhost:8001

## Troubleshooting

### Guardrails AI Issues

**Issue: "guardrails: command not found"**
```bash
# Ensure virtual environment is activated
source guardrails-env/bin/activate

# Or install globally (not recommended)
pip install --user guardrails-ai
```

**Issue: "Token not found"**
```bash
# Reconfigure Guardrails
guardrails configure

# Manually get token
guardrails token

# Add to .env
export GUARDRAILS_TOKEN="your_token_here"
```

**Issue: "Validator not found"**
```bash
# Reinstall validator
guardrails hub install hub://guardrails/validator_name

# Check installed validators
guardrails hub list
```

### NeMo Guardrails Issues

**Issue: "ModuleNotFoundError: No module named 'nemoguardrails'"**
```bash
# Activate virtual environment
source nemo-env/bin/activate

# Reinstall
pip install --upgrade nemoguardrails
```

**Issue: "NemoGuard models not loading"**
```bash
# Check internet connection (models download on first use)
# Verify sufficient disk space (models can be large)

# Manual model cache location:
# ~/.cache/nemo_guardrails/

# Clear cache and retry
rm -rf ~/.cache/nemo_guardrails/
```

**Issue: "Server won't start on port 8001"**
```bash
# Check if port is in use
lsof -i :8001

# Use different port
nemoguardrails server --config nemo-config --port 8002
```

### Ollama Issues

**Issue: "Ollama service not running"**
```bash
# Start Ollama service
ollama serve

# On systemd Linux:
sudo systemctl start ollama
sudo systemctl enable ollama

# Check status
systemctl status ollama
```

**Issue: "Model download failed"**
```bash
# Check disk space
df -h

# Check internet connection
ping ollama.com

# Retry download
ollama pull llama3
```

**Issue: "Out of memory when running model"**
```bash
# Use a smaller model
ollama pull phi3  # 3.8B parameters

# Or quantized version
ollama pull llama3:7b-q4  # 4-bit quantized
```

### NebulaGateAI UI Issues

**Issue: "Port 3699 already in use"**
```bash
# Use different port
PORT=3700 npm run dev
```

**Issue: "Cannot connect to backend services"**
```bash
# Verify services are running
curl http://localhost:8000/health  # Guardrails AI
curl http://localhost:8001/v1/rails/configs  # NeMo
curl http://localhost:11434/api/tags  # Ollama

# Check firewall
sudo ufw allow 8000
sudo ufw allow 8001
sudo ufw allow 11434
```

### Docker Issues

**Issue: "Container fails to start"**
```bash
# Check logs
docker-compose logs nebulagate-ui
docker-compose logs guardrails-server
docker-compose logs nemo-guardrails

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Issue: "Permission denied"**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again, or:
newgrp docker
```

## Performance Optimization

### Ollama Performance

**GPU Acceleration:**
```bash
# Ollama automatically uses GPU if available
# Check GPU usage:
nvidia-smi  # NVIDIA GPUs
rocm-smi    # AMD GPUs
```

**CPU Optimization:**
```bash
# Set thread count
export OLLAMA_NUM_THREADS=8

# Restart Ollama
ollama serve
```

### NeMo Guardrails Performance

**Enable Caching:**
```yaml
# In nemo-config/config.yml
caching:
  enabled: true
  strategy: LFU  # Least Frequently Used
  max_size: 1000
  ttl: 3600  # Time to live in seconds
```

**Optimize Embeddings:**
```yaml
# Use faster embedding models
embeddings:
  model: all-MiniLM-L6-v2  # Fast, lightweight
  # vs paraphrase-MiniLM-L12-v2 (slower, more accurate)
```

## Next Steps

1. ✅ **Explore the UI**: Navigate through all tabs in NebulaGateAI
2. ✅ **Create Guards**: Set up your first Guardrails AI guard with validators
3. ✅ **Configure Models**: Add multiple LLM models (OpenAI, Ollama, etc.)
4. ✅ **Enable Security**: Turn on NemoGuard jailbreak detection
5. ✅ **Test Guardrails**: Send test prompts through your configured guardrails
6. ✅ **Export Config**: Save your configuration for production deployment
7. ✅ **Deploy**: Use Docker Compose for production deployment

## Additional Resources

### Official Documentation
- [Guardrails AI Docs](https://docs.guardrailsai.com/)
- [NeMo Guardrails Docs](https://docs.nvidia.com/nemo/guardrails/)
- [Ollama Documentation](https://ollama.com/docs)
- [NebulaGateAI GitHub](https://github.com/yourusername/nebula-gate-ai)

### Community Resources
- [Guardrails AI GitHub](https://github.com/guardrails-ai/guardrails)
- [NeMo Guardrails GitHub](https://github.com/NVIDIA/NeMo-Guardrails)
- [Ollama GitHub](https://github.com/ollama/ollama)

### Video Tutorials
- [Guardrails AI Getting Started](https://www.youtube.com/guardrailsai)
- [NVIDIA NeMo Guardrails](https://www.nvidia.com/en-us/ai-data-science/nemo/)
- [Ollama Quickstart](https://www.youtube.com/ollama)

## Support

Need help?
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/nebula-gate-ai/issues)
- **Documentation**: Check README.md, QUICKSTART.md, DEPLOYMENT.md
- **Community**: Join discussions in GitHub Discussions

---

**Built with ❤️ for the AI Safety Community**

*Making AI guardrails accessible, secure, and easy to deploy*
