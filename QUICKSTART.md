# NebulaGateAI Quick Start Guide

Get NebulaGateAI up and running in 5 minutes!

> **📘 Need detailed backend setup?** See [SETUP.md](SETUP.md) for complete installation instructions for Guardrails AI, NeMo Guardrails with NemoGuard, and Ollama.

## 🚀 Option 1: Local Development (Fastest)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/nebula-gate-ai.git
cd nebula-gate-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3699
```

That's it! You're ready to configure your guardrails.

## 🐳 Option 2: Docker (Recommended for Production)

```bash
# 1. Clone and setup
git clone https://github.com/yourusername/nebula-gate-ai.git
cd nebula-gate-ai

# 2. Copy example files
cp .env.example .env
cp nemo-config.example.json nemo-config.json

# 3. Edit .env file (add your API keys)
nano .env

# 4. Start all services
docker-compose up -d

# 5. Access the application
# UI: http://localhost:3699
# Guardrails.AI: http://localhost:8000
# NeMo Guardrails: http://localhost:8001
```

## ⚡ First Steps

### 1. Configure Guardrails.AI

1. Click **Guardrails.AI** in the sidebar
2. Enter your Hub JWT token
3. Add your LLM API keys (OpenAI, Anthropic, etc.)
4. Click **Add New Guard** to create your first guard

### 2. Configure NeMo Guardrails

1. Click **NeMo Guardrails** in the sidebar
2. Click **Add Model**
3. Select your model engine (NIM, TensorRT-LLM, Ollama, OpenAI)
4. Configure model parameters
5. Enable security features (Jailbreak Detection, Content Safety)

### 3. Export Your Configuration

1. Click **Export & Deploy** in the sidebar
2. Click **Export Configuration** to save your settings
3. Copy the provided Docker files
4. Deploy to your infrastructure

## 🎯 Common Use Cases

### Use Case 1: OpenAI with Content Safety

```javascript
// 1. Add OpenAI API key in Guardrails.AI section
// 2. In NeMo Guardrails:
//    - Add OpenAI model
//    - Enable Content Safety
//    - Enable Jailbreak Detection
```

### Use Case 2: Local LLM with Ollama

```javascript
// 1. In NeMo Guardrails:
//    - Add Model → Select Ollama
//    - Base URL: http://localhost:11434
//    - Model: llama3
//    - Enable security features
```

### Use Case 3: NVIDIA NIM Models

```javascript
// 1. In NeMo Guardrails:
//    - Add Model → Select NIM
//    - Base URL: https://integrate.api.nvidia.com/v1
//    - Add API key
//    - Configure parameters
```

## 📊 Dashboard Overview

The dashboard shows:
- **Connection Status**: Guardrails.AI and NeMo connection state
- **Active Guards**: Number of configured guards
- **Models**: Number of LLM models configured
- **Security Features**: Active security settings

## 🔑 Environment Variables

Required for full functionality:

```env
# Guardrails.AI
GUARDRAILS_TOKEN=your_jwt_token

# LLM APIs (at least one)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 🆘 Troubleshooting

### Port 3699 already in use
```bash
# Use a different port
PORT=3700 npm run dev
```

### Docker containers not starting
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose down
docker-compose up -d
```

### Configuration not saving
- Clear browser cache
- Check browser console for errors
- Ensure localStorage is enabled

## 📚 Next Steps

1. ✅ **[SETUP.md](SETUP.md)** - Complete installation guide for backend services
2. ✅ Read the full [README.md](README.md)
3. ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. ✅ Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
5. ✅ Explore the [official documentation](#resources)

## 🔗 Resources

- [Guardrails.AI Docs](https://docs.guardrailsai.com/)
- [NeMo Guardrails Docs](https://docs.nvidia.com/nemo/guardrails/)
- [GitHub Issues](https://github.com/yourusername/nebula-gate-ai/issues)

## 💡 Tips

- **Start Simple**: Begin with one model and basic settings
- **Test Frequently**: Use the export feature to backup configurations
- **Security First**: Enable jailbreak detection and content safety
- **Monitor Performance**: Use caching for better performance

---

**Need help?** Open an issue on GitHub or check our documentation!

Happy configuring! 🌌
