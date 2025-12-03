// Guardrails.AI Configuration Types
export interface GuardrailsAIConfig {
  hubAuth: {
    token: string;
    baseUrl: string;
  };
  telemetry: {
    enabled: boolean;
    endpoint?: string;
  };
  remoteInferencing: {
    enabled: boolean;
    hubInfrastructure: boolean;
  };
  server: {
    host: string;
    port: number;
    llmApiKeys: {
      openai?: string;
      anthropic?: string;
      cohere?: string;
    };
  };
  guards: Guard[];
}

export interface Guard {
  id: string;
  name: string;
  description: string;
  validators: Validator[];
  createdAt: string;
}

export interface Validator {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  enabled: boolean;
  category?: string;
  description?: string;
  infrastructure?: 'ML' | 'LLM' | 'Rule-based' | 'SQL';
  useCases?: string[];
  riskCategories?: string[];
}

// NeMo Guardrails Configuration Types
export interface NemoGuardrailsConfig {
  models: ModelConfig[];
  instructions: Instruction[];
  rails: {
    input: RailConfig[];
    output: RailConfig[];
    retrieval: RailConfig[];
  };
  security: {
    jailbreakDetection: boolean;
    contentSafety: boolean;
    topicControl: boolean;
  };
  caching: {
    enabled: boolean;
    strategy: 'LFU' | 'LRU' | 'FIFO';
    maxSize: number;
  };
  multimodal: {
    enabled: boolean;
    supportedFormats: string[];
  };
}

export interface ModelConfig {
  id: string;
  name: string;
  engine: 'nim' | 'trt-llm' | 'ollama' | 'openai';
  baseUrl?: string;
  parameters: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
    repetitionPenalty?: number;
    lengthPenalty?: number;
  };
  apiKey?: string;
}

export interface Instruction {
  id: string;
  type: 'general' | 'specific';
  content: string;
  enabled: boolean;
}

export interface RailConfig {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  priority: number;
  config: Record<string, any>;
}

// Combined Application Config
export interface NebulaGateConfig {
  guardrailsAI: GuardrailsAIConfig;
  nemoGuardrails: NemoGuardrailsConfig;
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

// UI State Types
export interface Tab {
  id: string;
  name: string;
  icon: string;
}

export type ConfigSection = 'guardrails-ai' | 'nemo-guardrails' | 'dashboard' | 'export';
