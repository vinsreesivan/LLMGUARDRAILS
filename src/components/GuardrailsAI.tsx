import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { useConfigStore } from '@/store/configStore';
import { Shield, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { Guard, Validator } from '@/types';
import toast from 'react-hot-toast';

export const GuardrailsAI: React.FC = () => {
  const { config, updateGuardrailsAI } = useConfigStore();
  const [editingGuard, setEditingGuard] = useState<string | null>(null);

  const handleUpdateAuth = (field: 'token' | 'baseUrl', value: string) => {
    updateGuardrailsAI({
      hubAuth: {
        ...config.guardrailsAI.hubAuth,
        [field]: value,
      },
    });
    toast.success('Authentication settings updated');
  };

  const handleUpdateServer = (field: 'host' | 'port', value: string | number) => {
    updateGuardrailsAI({
      server: {
        ...config.guardrailsAI.server,
        [field]: value,
      },
    });
    toast.success('Server settings updated');
  };

  const handleUpdateApiKey = (provider: string, value: string) => {
    updateGuardrailsAI({
      server: {
        ...config.guardrailsAI.server,
        llmApiKeys: {
          ...config.guardrailsAI.server.llmApiKeys,
          [provider]: value,
        },
      },
    });
    toast.success(`${provider} API key updated`);
  };

  const handleAddGuard = () => {
    const newGuard: Guard = {
      id: generateId(),
      name: 'New Guard',
      description: '',
      validators: [],
      createdAt: new Date().toISOString(),
    };
    updateGuardrailsAI({
      guards: [...config.guardrailsAI.guards, newGuard],
    });
    setEditingGuard(newGuard.id);
    toast.success('Guard created');
  };

  const handleDeleteGuard = (id: string) => {
    updateGuardrailsAI({
      guards: config.guardrailsAI.guards.filter((g) => g.id !== id),
    });
    toast.success('Guard deleted');
  };

  const handleUpdateGuard = (id: string, updates: Partial<Guard>) => {
    updateGuardrailsAI({
      guards: config.guardrailsAI.guards.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    });
    toast.success('Guard updated');
  };

  const handleAddValidator = (guardId: string) => {
    const newValidator: Validator = {
      id: generateId(),
      name: 'New Validator',
      type: 'custom',
      parameters: {},
      enabled: true,
    };

    updateGuardrailsAI({
      guards: config.guardrailsAI.guards.map((g) =>
        g.id === guardId
          ? { ...g, validators: [...g.validators, newValidator] }
          : g
      ),
    });
    toast.success('Validator added');
  };

  const handleDeleteValidator = (guardId: string, validatorId: string) => {
    updateGuardrailsAI({
      guards: config.guardrailsAI.guards.map((g) =>
        g.id === guardId
          ? { ...g, validators: g.validators.filter((v) => v.id !== validatorId) }
          : g
      ),
    });
    toast.success('Validator deleted');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Guardrails.AI Configuration</h2>
        <p className="text-gray-600">Configure your Guardrails.AI settings and guards</p>
      </div>

      {/* Hub Authentication */}
      <Card title="Hub Authentication" description="Configure authentication with Guardrails Hub">
        <div className="space-y-4">
          <Input
            label="JWT Token"
            type="password"
            placeholder="Enter your Hub authentication token"
            value={config.guardrailsAI.hubAuth.token}
            onChange={(e) => handleUpdateAuth('token', e.target.value)}
          />
          <Input
            label="Base URL"
            type="url"
            placeholder="https://api.guardrailsai.com"
            value={config.guardrailsAI.hubAuth.baseUrl}
            onChange={(e) => handleUpdateAuth('baseUrl', e.target.value)}
          />
        </div>
      </Card>

      {/* Server Configuration */}
      <Card title="Server Configuration" description="Configure the Guardrails server settings">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Host"
              placeholder="localhost"
              value={config.guardrailsAI.server.host}
              onChange={(e) => handleUpdateServer('host', e.target.value)}
            />
            <Input
              label="Port"
              type="number"
              placeholder="8000"
              value={config.guardrailsAI.server.port}
              onChange={(e) => handleUpdateServer('port', parseInt(e.target.value))}
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">LLM API Keys</h4>
            <div className="space-y-3">
              <Input
                label="OpenAI API Key"
                type="password"
                placeholder="sk-..."
                value={config.guardrailsAI.server.llmApiKeys.openai || ''}
                onChange={(e) => handleUpdateApiKey('openai', e.target.value)}
              />
              <Input
                label="Anthropic API Key"
                type="password"
                placeholder="sk-ant-..."
                value={config.guardrailsAI.server.llmApiKeys.anthropic || ''}
                onChange={(e) => handleUpdateApiKey('anthropic', e.target.value)}
              />
              <Input
                label="Cohere API Key"
                type="password"
                placeholder="..."
                value={config.guardrailsAI.server.llmApiKeys.cohere || ''}
                onChange={(e) => handleUpdateApiKey('cohere', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card title="Preferences" description="Configure telemetry and inferencing options">
        <div className="space-y-4">
          <Toggle
            label="Enable Telemetry"
            description="Allow data collection for analytics and improvements"
            enabled={config.guardrailsAI.telemetry.enabled}
            onChange={(enabled) =>
              updateGuardrailsAI({
                telemetry: { ...config.guardrailsAI.telemetry, enabled },
              })
            }
          />
          <Toggle
            label="Remote Inferencing"
            description="Execute validators on Hub infrastructure"
            enabled={config.guardrailsAI.remoteInferencing.enabled}
            onChange={(enabled) =>
              updateGuardrailsAI({
                remoteInferencing: {
                  ...config.guardrailsAI.remoteInferencing,
                  enabled,
                },
              })
            }
          />
        </div>
      </Card>

      {/* Guards Management */}
      <Card
        title="Guards"
        description="Create and manage your Guardrails guards and validators"
      >
        <div className="space-y-4">
          <Button onClick={handleAddGuard} variant="primary" className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Guard
          </Button>

          <div className="space-y-4">
            {config.guardrailsAI.guards.map((guard) => (
              <div
                key={guard.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {editingGuard === guard.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Guard Name"
                          value={guard.name}
                          onChange={(e) =>
                            handleUpdateGuard(guard.id, { name: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Description"
                          value={guard.description}
                          onChange={(e) =>
                            handleUpdateGuard(guard.id, { description: e.target.value })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          {guard.name}
                        </h4>
                        {guard.description && (
                          <p className="text-sm text-gray-600 mt-1">{guard.description}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingGuard(editingGuard === guard.id ? null : guard.id)
                      }
                    >
                      {editingGuard === guard.id ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteGuard(guard.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Validators</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddValidator(guard.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Validator
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {guard.validators.map((validator) => (
                      <div
                        key={validator.id}
                        className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium">{validator.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({validator.type})</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteValidator(guard.id, validator.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {guard.validators.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No validators configured
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {config.guardrailsAI.guards.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No guards configured. Click &quot;Add New Guard&quot; to get started.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
