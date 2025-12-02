import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NebulaGateConfig, GuardrailsAIConfig, NemoGuardrailsConfig } from '@/types';

interface ConfigStore {
  config: NebulaGateConfig;
  updateGuardrailsAI: (config: Partial<GuardrailsAIConfig>) => void;
  updateNemoGuardrails: (config: Partial<NemoGuardrailsConfig>) => void;
  resetConfig: () => void;
  importConfig: (config: NebulaGateConfig) => void;
  exportConfig: () => NebulaGateConfig;
}

const defaultConfig: NebulaGateConfig = {
  guardrailsAI: {
    hubAuth: {
      token: '',
      baseUrl: 'https://api.guardrailsai.com',
    },
    telemetry: {
      enabled: false,
    },
    remoteInferencing: {
      enabled: false,
      hubInfrastructure: false,
    },
    server: {
      host: 'localhost',
      port: 8000,
      llmApiKeys: {},
    },
    guards: [],
  },
  nemoGuardrails: {
    models: [],
    instructions: [],
    rails: {
      input: [],
      output: [],
      retrieval: [],
    },
    security: {
      jailbreakDetection: true,
      contentSafety: true,
      topicControl: false,
    },
    caching: {
      enabled: true,
      strategy: 'LFU',
      maxSize: 1000,
    },
    multimodal: {
      enabled: false,
      supportedFormats: ['image/png', 'image/jpeg'],
    },
  },
  metadata: {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,

      updateGuardrailsAI: (newConfig) =>
        set((state) => ({
          config: {
            ...state.config,
            guardrailsAI: {
              ...state.config.guardrailsAI,
              ...newConfig,
            },
            metadata: {
              ...state.config.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      updateNemoGuardrails: (newConfig) =>
        set((state) => ({
          config: {
            ...state.config,
            nemoGuardrails: {
              ...state.config.nemoGuardrails,
              ...newConfig,
            },
            metadata: {
              ...state.config.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      resetConfig: () =>
        set({
          config: {
            ...defaultConfig,
            metadata: {
              version: '1.0.0',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }),

      importConfig: (config) =>
        set({
          config: {
            ...config,
            metadata: {
              ...config.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
        }),

      exportConfig: () => get().config,
    }),
    {
      name: 'nebula-gate-config',
    }
  )
);
