# NebulaGateAI 🌌

> **Comprehensive Frontend for Guardrails.AI and NeMo Guardrails**

NebulaGateAI is a modern, user-friendly web interface for managing and configuring both Guardrails.AI and NVIDIA NeMo Guardrails. Built with Next.js 14, TypeScript, and Tailwind CSS, it provides an intuitive way to configure, manage, and deploy AI guardrails for your LLM applications.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)

## ✨ Features

### 🛡️ Guardrails.AI Management
- **Hub Authentication**: Secure JWT token management
- **Server Configuration**: Configure host, port, and LLM API keys
- **Guards Management**: Create, edit, and delete guards with validators
- **Telemetry Controls**: Enable/disable data collection
- **Remote Inferencing**: Configure Hub infrastructure execution

### 🚀 NeMo Guardrails Management
- **Multi-Model Support**: Configure NIM, TensorRT-LLM, Ollama, and OpenAI models
- **Security Features**:
  - Jailbreak Detection with NemoGuard
  - Content Safety moderation
  - Topic Control
- **Performance Optimization**:
  - LFU/LRU/FIFO caching strategies
  - Configurable cache size
- **Multimodal Support**: Text and image input/output rails
- **Instructions Management**: General and specific system prompts
- **Rails Configuration**: Input, output, and retrieval rails

### 🎨 User Experience
- **Modern UI**: Beautiful gradient-based design with smooth animations
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Instant configuration changes with Zustand state management
- **Toast Notifications**: Clear feedback for all actions
- **Dark Code Blocks**: Syntax-highlighted configuration previews

### 📦 Export & Deployment
- **Configuration Export/Import**: JSON-based config management
- **Docker Support**: Pre-configured Dockerfile and docker-compose.yml
- **Environment Variables**: Easy copy-paste .env configuration
- **One-Click Deploy**: Simple Docker deployment process

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nebula-gate-ai.git
cd nebula-gate-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3699](http://localhost:3699)

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Copy example configurations**
```bash
cp .env.example .env
cp nemo-config.example.json nemo-config.json
```

2. **Edit configurations**
Update `.env` with your API keys and tokens

3. **Start all services**
```bash
docker-compose up -d
```

4. **Access the services**
- NebulaGateAI UI: http://localhost:3699
- Guardrails.AI Server: http://localhost:8000
- NeMo Guardrails: http://localhost:8001

### Manual Docker Build

```bash
# Build the image
docker build -t nebulagate-ai .

# Run the container
docker run -p 3699:3699 nebulagate-ai
```

## 📖 Usage Guide

### Dashboard
The dashboard provides an overview of your configuration:
- Connection status for both Guardrails.AI and NeMo Guardrails
- Active guards and models count
- Security features status
- Quick start guide

### Guardrails.AI Configuration

#### Hub Authentication
1. Navigate to **Guardrails.AI** tab
2. Enter your JWT token from Guardrails Hub
3. Configure the base URL (default: https://api.guardrailsai.com)

#### Server Settings
1. Set the server host and port
2. Add LLM API keys for OpenAI, Anthropic, or Cohere
3. Enable/disable telemetry and remote inferencing

#### Creating Guards
1. Click **Add New Guard**
2. Enter guard name and description
3. Add validators by clicking **Add Validator**
4. Configure validator parameters
5. Save your changes

### NeMo Guardrails Configuration

#### Model Configuration
1. Navigate to **NeMo Guardrails** tab
2. Click **Add Model**
3. Select engine type (NIM, TensorRT-LLM, Ollama, OpenAI)
4. Configure model parameters:
   - Temperature
   - Max Tokens
   - Top P
5. Add base URL and API key if required

#### Security Features
Enable security features based on your needs:
- **Jailbreak Detection**: Prevents prompt injection attacks
- **Content Safety**: Filters harmful content
- **Topic Control**: Restricts conversation topics

#### Caching Configuration
1. Enable caching for improved performance
2. Select cache strategy:
   - **LFU**: Least Frequently Used (recommended)
   - **LRU**: Least Recently Used
   - **FIFO**: First In First Out
3. Set maximum cache size

#### Instructions
1. Click **Add Instruction**
2. Select type (General or Specific)
3. Enter instruction content
4. Enable/disable as needed

### Export & Deploy

#### Export Configuration
1. Navigate to **Export & Deploy** tab
2. Click **Export Configuration**
3. Save the JSON file for backup or sharing

#### Import Configuration
1. Click **Import Configuration**
2. Select a previously exported JSON file
3. Configuration will be loaded automatically

#### Docker Deployment
1. Copy the provided Dockerfile
2. Copy the docker-compose.yml
3. Copy environment variables and NeMo config
4. Run `docker-compose up -d`

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **UI Components**: Custom components with Lucide icons
- **Notifications**: React Hot Toast

### Project Structure
```
nebula-gate-ai/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── page.tsx      # Main page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── Dashboard.tsx
│   │   ├── GuardrailsAI.tsx
│   │   ├── NemoGuardrails.tsx
│   │   ├── ExportDeploy.tsx
│   │   └── Layout.tsx
│   ├── store/            # Zustand store
│   │   └── configStore.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── lib/              # Utilities
│       └── utils.ts
├── public/               # Static assets
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── package.json          # Dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Guardrails.AI Configuration
GUARDRAILS_TOKEN=your_jwt_token_here
GUARDRAILS_BASE_URL=https://api.guardrailsai.com
GUARDRAILS_HOST=localhost
GUARDRAILS_PORT=8000

# LLM API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
COHERE_API_KEY=...

# Application
NODE_ENV=production
PORT=3699
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Guardrails.AI](https://www.guardrailsai.com/) - Enterprise AI guardrails platform
- [NVIDIA NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) - Programmable guardrails toolkit
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set

## 📚 Resources

- [Guardrails.AI Documentation](https://docs.guardrailsai.com/)
- [NeMo Guardrails Documentation](https://docs.nvidia.com/nemo/guardrails/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/yourusername/nebula-gate-ai/issues) page to report bugs or request features.

## 💬 Support

For questions and support:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ for the AI Safety Community**

*Making AI guardrails accessible and user-friendly*
