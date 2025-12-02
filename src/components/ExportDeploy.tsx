import React, { useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useConfigStore } from '@/store/configStore';
import {
  Download,
  Upload,
  FileJson,
  Code,
  Copy,
  CheckCircle,
  Package,
} from 'lucide-react';
import { downloadJSON, readJSONFile } from '@/lib/utils';
import toast from 'react-hot-toast';

export const ExportDeploy: React.FC = () => {
  const { config, importConfig } = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleExportConfig = () => {
    downloadJSON(config, `nebula-gate-config-${Date.now()}.json`);
    toast.success('Configuration exported successfully');
  };

  const handleImportConfig = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJSONFile(file);
      importConfig(data);
      toast.success('Configuration imported successfully');
    } catch (error) {
      toast.error('Failed to import configuration');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const generateGuardrailsConfig = () => {
    return `# Guardrails.AI Configuration
GUARDRAILS_TOKEN=${config.guardrailsAI.hubAuth.token}
GUARDRAILS_BASE_URL=${config.guardrailsAI.hubAuth.baseUrl}
GUARDRAILS_HOST=${config.guardrailsAI.server.host}
GUARDRAILS_PORT=${config.guardrailsAI.server.port}
${config.guardrailsAI.server.llmApiKeys.openai ? `OPENAI_API_KEY=${config.guardrailsAI.server.llmApiKeys.openai}` : ''}
${config.guardrailsAI.server.llmApiKeys.anthropic ? `ANTHROPIC_API_KEY=${config.guardrailsAI.server.llmApiKeys.anthropic}` : ''}
${config.guardrailsAI.server.llmApiKeys.cohere ? `COHERE_API_KEY=${config.guardrailsAI.server.llmApiKeys.cohere}` : ''}
GUARDRAILS_TELEMETRY=${config.guardrailsAI.telemetry.enabled}
`;
  };

  const generateNemoConfig = () => {
    const models = config.nemoGuardrails.models.map((model) => ({
      type: model.engine,
      engine: model.engine,
      model: model.name,
      parameters: model.parameters,
      ...(model.baseUrl && { base_url: model.baseUrl }),
      ...(model.apiKey && { api_key: model.apiKey }),
    }));

    const instructions = config.nemoGuardrails.instructions
      .filter((i) => i.enabled)
      .map((i) => ({
        type: i.type,
        content: i.content,
      }));

    return JSON.stringify(
      {
        models,
        instructions,
        rails: config.nemoGuardrails.rails,
        security: config.nemoGuardrails.security,
        caching: config.nemoGuardrails.caching,
        multimodal: config.nemoGuardrails.multimodal,
      },
      null,
      2
    );
  };

  const generateDockerfile = () => {
    return `# NebulaGateAI Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
`;
  };

  const generateDockerCompose = () => {
    return `version: '3.8'

services:
  nebulagate-ui:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  guardrails-server:
    image: guardrailsai/guardrails:latest
    ports:
      - "${config.guardrailsAI.server.port}:${config.guardrailsAI.server.port}"
    environment:
      - GUARDRAILS_TOKEN=${config.guardrailsAI.hubAuth.token}
      - GUARDRAILS_BASE_URL=${config.guardrailsAI.hubAuth.baseUrl}
      ${config.guardrailsAI.server.llmApiKeys.openai ? `- OPENAI_API_KEY=${config.guardrailsAI.server.llmApiKeys.openai}` : ''}
      ${config.guardrailsAI.server.llmApiKeys.anthropic ? `- ANTHROPIC_API_KEY=${config.guardrailsAI.server.llmApiKeys.anthropic}` : ''}
    restart: unless-stopped

  nemo-guardrails:
    image: nvcr.io/nvidia/nemo/guardrails:latest
    ports:
      - "8001:8001"
    volumes:
      - ./nemo-config.json:/app/config.json
    restart: unless-stopped
`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Export & Deploy</h2>
        <p className="text-gray-600">Export your configuration and deploy with Docker</p>
      </div>

      {/* Import/Export */}
      <Card title="Configuration Management" description="Import or export your configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleExportConfig} variant="primary" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Configuration
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Configuration
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportConfig}
            className="hidden"
          />
        </div>
      </Card>

      {/* Guardrails.AI Environment */}
      <Card title="Guardrails.AI Environment Variables" description="Copy these to your .env file">
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {generateGuardrailsConfig()}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => copyToClipboard(generateGuardrailsConfig(), 'guardrails-env')}
          >
            {copied === 'guardrails-env' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* NeMo Guardrails Config */}
      <Card title="NeMo Guardrails Configuration" description="Copy this config.json file">
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
            {generateNemoConfig()}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => copyToClipboard(generateNemoConfig(), 'nemo-config')}
          >
            {copied === 'nemo-config' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* Docker Deployment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Dockerfile" description="Save as Dockerfile">
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-80">
              {generateDockerfile()}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={() => copyToClipboard(generateDockerfile(), 'dockerfile')}
            >
              {copied === 'dockerfile' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>

        <Card title="Docker Compose" description="Save as docker-compose.yml">
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-80">
              {generateDockerCompose()}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={() =>
                copyToClipboard(generateDockerCompose(), 'docker-compose')
              }
            >
              {copied === 'docker-compose' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Deployment Instructions */}
      <Card title="Deployment Instructions">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Quick Deploy with Docker
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Copy the Dockerfile and docker-compose.yml to your project directory</li>
              <li>Save the NeMo configuration as <code className="bg-blue-100 px-1 rounded">nemo-config.json</code></li>
              <li>Run: <code className="bg-blue-100 px-2 py-0.5 rounded">docker-compose up -d</code></li>
              <li>Access NebulaGateAI at <code className="bg-blue-100 px-1 rounded">http://localhost:3000</code></li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <FileJson className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <h5 className="font-medium text-gray-900">UI</h5>
              <p className="text-sm text-gray-600">Port 3000</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <Code className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <h5 className="font-medium text-gray-900">Guardrails.AI</h5>
              <p className="text-sm text-gray-600">Port {config.guardrailsAI.server.port}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <Package className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <h5 className="font-medium text-gray-900">NeMo Guardrails</h5>
              <p className="text-sm text-gray-600">Port 8001</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
