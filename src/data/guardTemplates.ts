// Pre-configured Guard Templates for Common Use Cases

export interface GuardTemplate {
  id: string;
  name: string;
  description: string;
  useCase: string;
  icon: string;
  validators: string[]; // Array of validator IDs
  recommended: boolean;
  tags: string[];
}

export interface SecurityPreset {
  id: string;
  name: string;
  level: 'basic' | 'standard' | 'strict' | 'enterprise';
  validators: string[];
  description: string;
  icon: string;
}

export const GUARD_TEMPLATES: GuardTemplate[] = [
  {
    id: 'customer-support',
    name: 'Customer Support Chatbot',
    description: 'Safe, professional, and helpful responses for customer service applications',
    useCase: 'customer-support',
    icon: '💬',
    validators: [
      'toxic-language',
      'profanity-free',
      'detect-pii',
      'bias-check',
      'reading-level',
      'competitor-mention',
    ],
    recommended: true,
    tags: ['chatbot', 'support', 'safe'],
  },
  {
    id: 'code-generation',
    name: 'Code Generation Assistant',
    description: 'Secure code generation with validation and safety checks',
    useCase: 'codegen',
    icon: '💻',
    validators: [
      'valid-python',
      'valid-sql',
      'valid-json',
      'secrets-present',
      'invalid-code-detection',
      'detect-jailbreak',
    ],
    recommended: true,
    tags: ['code', 'developer', 'secure'],
  },
  {
    id: 'rag-qa',
    name: 'RAG Q&A System',
    description: 'Factual, grounded responses for retrieval-augmented generation',
    useCase: 'rag',
    icon: '📚',
    validators: [
      'hallucination-check',
      'provenance-llm',
      'saliency-check',
      'context-relevancy',
      'valid-length',
      'reading-level',
    ],
    recommended: true,
    tags: ['rag', 'qa', 'factual'],
  },
  {
    id: 'content-moderation',
    name: 'Content Moderation',
    description: 'Comprehensive content safety and moderation',
    useCase: 'content-moderation',
    icon: '🛡️',
    validators: [
      'toxic-language',
      'profanity-free',
      'nsfw-text',
      'llama-guard',
      'bias-check',
      'detect-jailbreak',
    ],
    recommended: false,
    tags: ['safety', 'moderation', 'compliance'],
  },
  {
    id: 'text-to-sql',
    name: 'Text-to-SQL Generator',
    description: 'Safe SQL generation with injection prevention',
    useCase: 'text-to-sql',
    icon: '🗄️',
    validators: [
      'valid-sql',
      'exclude-sql-predicates',
      'detect-pii',
      'detect-jailbreak',
    ],
    recommended: false,
    tags: ['sql', 'database', 'secure'],
  },
  {
    id: 'summarization',
    name: 'Document Summarization',
    description: 'Accurate and concise document summarization',
    useCase: 'summarization',
    icon: '📄',
    validators: [
      'hallucination-check',
      'saliency-check',
      'redundant-sentences',
      'valid-length',
      'reading-level',
    ],
    recommended: false,
    tags: ['summary', 'document', 'quality'],
  },
  {
    id: 'enterprise-chatbot',
    name: 'Enterprise Chatbot',
    description: 'Maximum security and compliance for enterprise deployments',
    useCase: 'chatbot',
    icon: '🏢',
    validators: [
      'llama-guard',
      'detect-pii',
      'guardrails-pii',
      'secrets-present',
      'detect-jailbreak',
      'prompt-injection',
      'bias-check',
      'competitor-mention',
      'hallucination-check',
      'reading-level',
    ],
    recommended: false,
    tags: ['enterprise', 'secure', 'compliant'],
  },
  {
    id: 'translation',
    name: 'Translation Service',
    description: 'High-quality language translation with validation',
    useCase: 'translation',
    icon: '🌐',
    validators: [
      'translation-quality',
      'detect-pii',
      'profanity-free',
      'bias-check',
    ],
    recommended: false,
    tags: ['translation', 'localization', 'quality'],
  },
];

export const SECURITY_PRESETS: SecurityPreset[] = [
  {
    id: 'basic-safety',
    name: 'Basic Safety',
    level: 'basic',
    validators: [
      'toxic-language',
      'profanity-free',
    ],
    description: 'Essential content moderation for low-risk applications',
    icon: '🟢',
  },
  {
    id: 'standard-security',
    name: 'Standard Security',
    level: 'standard',
    validators: [
      'toxic-language',
      'profanity-free',
      'detect-pii',
      'detect-jailbreak',
      'bias-check',
    ],
    description: 'Recommended security level for most applications',
    icon: '🟡',
  },
  {
    id: 'strict-security',
    name: 'Strict Security',
    level: 'strict',
    validators: [
      'llama-guard',
      'toxic-language',
      'profanity-free',
      'detect-pii',
      'guardrails-pii',
      'secrets-present',
      'detect-jailbreak',
      'prompt-injection',
      'bias-check',
      'web-sanitization',
    ],
    description: 'High security for sensitive applications',
    icon: '🟠',
  },
  {
    id: 'enterprise-security',
    name: 'Enterprise Security',
    level: 'enterprise',
    validators: [
      'llama-guard',
      'shield-gemma',
      'toxic-language',
      'profanity-free',
      'nsfw-text',
      'detect-pii',
      'guardrails-pii',
      'secrets-present',
      'detect-jailbreak',
      'prompt-injection',
      'bias-check',
      'web-sanitization',
      'competitor-mention',
      'hallucination-check',
      'provenance-llm',
    ],
    description: 'Maximum security and compliance for enterprise deployments',
    icon: '🔴',
  },
];

export const MODEL_PRESETS = [
  {
    id: 'gpt4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai' as const,
    modelName: 'gpt-4-turbo-preview',
    engine: 'openai' as const,
    baseUrl: 'https://api.openai.com/v1',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
    },
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai' as const,
    modelName: 'gpt-3.5-turbo',
    engine: 'openai' as const,
    baseUrl: 'https://api.openai.com/v1',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
    },
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic' as const,
    modelName: 'claude-3-5-sonnet-20241022',
    engine: 'openai' as const,
    baseUrl: 'https://api.anthropic.com/v1',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
    },
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic' as const,
    modelName: 'claude-3-haiku-20240307',
    engine: 'openai' as const,
    baseUrl: 'https://api.anthropic.com/v1',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
    },
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B (Ollama)',
    provider: 'ollama' as const,
    modelName: 'llama3.1:8b',
    engine: 'ollama' as const,
    baseUrl: 'http://localhost:11502',
    parameters: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
    },
  },
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B (Ollama)',
    provider: 'ollama' as const,
    modelName: 'llama3.1:70b',
    engine: 'ollama' as const,
    baseUrl: 'http://localhost:11502',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
    },
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B (Ollama)',
    provider: 'ollama' as const,
    modelName: 'mistral:7b',
    engine: 'ollama' as const,
    baseUrl: 'http://localhost:11502',
    parameters: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
    },
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B (Ollama)',
    provider: 'ollama' as const,
    modelName: 'mixtral:8x7b',
    engine: 'ollama' as const,
    baseUrl: 'http://localhost:11502',
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
    },
  },
];
