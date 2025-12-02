import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { Select } from './ui/Select';
import { useConfigStore } from '@/store/configStore';
import { Sparkles, Plus, Trash2, Edit2, Save, AlertTriangle, Image } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { ModelConfig, Instruction, RailConfig } from '@/types';
import toast from 'react-hot-toast';

export const NemoGuardrails: React.FC = () => {
  const { config, updateNemoGuardrails } = useConfigStore();
  const [editingModel, setEditingModel] = useState<string | null>(null);

  const handleAddModel = () => {
    const newModel: ModelConfig = {
      id: generateId(),
      name: 'New Model',
      engine: 'nim',
      parameters: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1.0,
      },
    };
    updateNemoGuardrails({
      models: [...config.nemoGuardrails.models, newModel],
    });
    setEditingModel(newModel.id);
    toast.success('Model added');
  };

  const handleDeleteModel = (id: string) => {
    updateNemoGuardrails({
      models: config.nemoGuardrails.models.filter((m) => m.id !== id),
    });
    toast.success('Model deleted');
  };

  const handleUpdateModel = (id: string, updates: Partial<ModelConfig>) => {
    updateNemoGuardrails({
      models: config.nemoGuardrails.models.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  const handleUpdateModelParameter = (
    id: string,
    param: string,
    value: number
  ) => {
    const model = config.nemoGuardrails.models.find((m) => m.id === id);
    if (model) {
      handleUpdateModel(id, {
        parameters: {
          ...model.parameters,
          [param]: value,
        },
      });
    }
  };

  const handleAddInstruction = () => {
    const newInstruction: Instruction = {
      id: generateId(),
      type: 'general',
      content: '',
      enabled: true,
    };
    updateNemoGuardrails({
      instructions: [...config.nemoGuardrails.instructions, newInstruction],
    });
    toast.success('Instruction added');
  };

  const handleDeleteInstruction = (id: string) => {
    updateNemoGuardrails({
      instructions: config.nemoGuardrails.instructions.filter((i) => i.id !== id),
    });
    toast.success('Instruction deleted');
  };

  const handleUpdateInstruction = (id: string, updates: Partial<Instruction>) => {
    updateNemoGuardrails({
      instructions: config.nemoGuardrails.instructions.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    });
  };

  const handleAddRail = (railType: 'input' | 'output' | 'retrieval') => {
    const newRail: RailConfig = {
      id: generateId(),
      name: 'New Rail',
      type: 'custom',
      enabled: true,
      priority: 1,
      config: {},
    };
    updateNemoGuardrails({
      rails: {
        ...config.nemoGuardrails.rails,
        [railType]: [...config.nemoGuardrails.rails[railType], newRail],
      },
    });
    toast.success('Rail added');
  };

  const handleDeleteRail = (
    railType: 'input' | 'output' | 'retrieval',
    id: string
  ) => {
    updateNemoGuardrails({
      rails: {
        ...config.nemoGuardrails.rails,
        [railType]: config.nemoGuardrails.rails[railType].filter((r) => r.id !== id),
      },
    });
    toast.success('Rail deleted');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">NeMo Guardrails Configuration</h2>
        <p className="text-gray-600">Configure NVIDIA NeMo Guardrails settings and security features</p>
      </div>

      {/* Model Configuration */}
      <Card title="Model Configuration" description="Configure your LLM models and engines">
        <div className="space-y-4">
          <Button onClick={handleAddModel} variant="primary" className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Model
          </Button>

          <div className="space-y-4">
            {config.nemoGuardrails.models.map((model) => (
              <div
                key={model.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {editingModel === model.id ? (
                      <div className="space-y-3">
                        <Input
                          placeholder="Model Name"
                          value={model.name}
                          onChange={(e) =>
                            handleUpdateModel(model.id, { name: e.target.value })
                          }
                        />
                        <Select
                          label="Engine"
                          value={model.engine}
                          onChange={(e) =>
                            handleUpdateModel(model.id, {
                              engine: e.target.value as any,
                            })
                          }
                          options={[
                            { value: 'nim', label: 'NVIDIA NIM' },
                            { value: 'trt-llm', label: 'TensorRT-LLM' },
                            { value: 'ollama', label: 'Ollama' },
                            { value: 'openai', label: 'OpenAI' },
                          ]}
                        />
                        <Input
                          label="Base URL"
                          placeholder="https://..."
                          value={model.baseUrl || ''}
                          onChange={(e) =>
                            handleUpdateModel(model.id, { baseUrl: e.target.value })
                          }
                        />
                        <Input
                          label="API Key"
                          type="password"
                          placeholder="Optional API key"
                          value={model.apiKey || ''}
                          onChange={(e) =>
                            handleUpdateModel(model.id, { apiKey: e.target.value })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          {model.name}
                        </h4>
                        <p className="text-sm text-gray-600">Engine: {model.engine}</p>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingModel(editingModel === model.id ? null : model.id)
                      }
                    >
                      {editingModel === model.id ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteModel(model.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
                  <Input
                    label="Temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={model.parameters.temperature || 0.7}
                    onChange={(e) =>
                      handleUpdateModelParameter(
                        model.id,
                        'temperature',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Max Tokens"
                    type="number"
                    value={model.parameters.maxTokens || 2048}
                    onChange={(e) =>
                      handleUpdateModelParameter(
                        model.id,
                        'maxTokens',
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Top P"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={model.parameters.topP || 1.0}
                    onChange={(e) =>
                      handleUpdateModelParameter(
                        model.id,
                        'topP',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            ))}
            {config.nemoGuardrails.models.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No models configured. Click &quot;Add Model&quot; to get started.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Security Features */}
      <Card title="Security Features" description="Configure security and safety settings">
        <div className="space-y-4">
          <Toggle
            label="Jailbreak Detection"
            description="Detect and prevent jailbreak attempts with NemoGuard"
            enabled={config.nemoGuardrails.security.jailbreakDetection}
            onChange={(enabled) =>
              updateNemoGuardrails({
                security: {
                  ...config.nemoGuardrails.security,
                  jailbreakDetection: enabled,
                },
              })
            }
          />
          <Toggle
            label="Content Safety"
            description="Enable content moderation and safety checks"
            enabled={config.nemoGuardrails.security.contentSafety}
            onChange={(enabled) =>
              updateNemoGuardrails({
                security: {
                  ...config.nemoGuardrails.security,
                  contentSafety: enabled,
                },
              })
            }
          />
          <Toggle
            label="Topic Control"
            description="Control and restrict conversation topics"
            enabled={config.nemoGuardrails.security.topicControl}
            onChange={(enabled) =>
              updateNemoGuardrails({
                security: {
                  ...config.nemoGuardrails.security,
                  topicControl: enabled,
                },
              })
            }
          />
        </div>
      </Card>

      {/* Caching Configuration */}
      <Card title="Caching" description="Configure in-memory caching for improved performance">
        <div className="space-y-4">
          <Toggle
            label="Enable Caching"
            description="Cache guardrail model calls for reduced latency and costs"
            enabled={config.nemoGuardrails.caching.enabled}
            onChange={(enabled) =>
              updateNemoGuardrails({
                caching: { ...config.nemoGuardrails.caching, enabled },
              })
            }
          />
          {config.nemoGuardrails.caching.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Cache Strategy"
                value={config.nemoGuardrails.caching.strategy}
                onChange={(e) =>
                  updateNemoGuardrails({
                    caching: {
                      ...config.nemoGuardrails.caching,
                      strategy: e.target.value as any,
                    },
                  })
                }
                options={[
                  { value: 'LFU', label: 'LFU (Least Frequently Used)' },
                  { value: 'LRU', label: 'LRU (Least Recently Used)' },
                  { value: 'FIFO', label: 'FIFO (First In First Out)' },
                ]}
              />
              <Input
                label="Max Cache Size"
                type="number"
                value={config.nemoGuardrails.caching.maxSize}
                onChange={(e) =>
                  updateNemoGuardrails({
                    caching: {
                      ...config.nemoGuardrails.caching,
                      maxSize: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      </Card>

      {/* Multimodal Support */}
      <Card title="Multimodal Support" description="Configure support for images and other media">
        <div className="space-y-4">
          <Toggle
            label="Enable Multimodal"
            description="Support for text and image input/output rails"
            enabled={config.nemoGuardrails.multimodal.enabled}
            onChange={(enabled) =>
              updateNemoGuardrails({
                multimodal: { ...config.nemoGuardrails.multimodal, enabled },
              })
            }
          />
          {config.nemoGuardrails.multimodal.enabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Image className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h5 className="font-medium text-blue-900">Supported Formats</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    {config.nemoGuardrails.multimodal.supportedFormats.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card title="Instructions" description="Configure system instructions and prompts">
        <div className="space-y-4">
          <Button
            onClick={handleAddInstruction}
            variant="primary"
            className="w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Instruction
          </Button>

          <div className="space-y-3">
            {config.nemoGuardrails.instructions.map((instruction) => (
              <div
                key={instruction.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Select
                    value={instruction.type}
                    onChange={(e) =>
                      handleUpdateInstruction(instruction.id, {
                        type: e.target.value as any,
                      })
                    }
                    options={[
                      { value: 'general', label: 'General' },
                      { value: 'specific', label: 'Specific' },
                    ]}
                  />
                  <div className="flex items-center space-x-2 ml-4">
                    <Toggle
                      enabled={instruction.enabled}
                      onChange={(enabled) =>
                        handleUpdateInstruction(instruction.id, { enabled })
                      }
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteInstruction(instruction.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <textarea
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter instruction content..."
                  value={instruction.content}
                  onChange={(e) =>
                    handleUpdateInstruction(instruction.id, {
                      content: e.target.value,
                    })
                  }
                />
              </div>
            ))}
            {config.nemoGuardrails.instructions.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No instructions configured. Click &quot;Add Instruction&quot; to get started.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Rails Configuration */}
      <Card title="Rails Configuration" description="Configure input, output, and retrieval rails">
        <div className="space-y-6">
          {/* Input Rails */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Input Rails</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddRail('input')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {config.nemoGuardrails.rails.input.map((rail) => (
                <div
                  key={rail.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-sm">{rail.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Priority: {rail.priority}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRail('input', rail.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Output Rails */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Output Rails</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddRail('output')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {config.nemoGuardrails.rails.output.map((rail) => (
                <div
                  key={rail.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-sm">{rail.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Priority: {rail.priority}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRail('output', rail.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Retrieval Rails */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Retrieval Rails</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddRail('retrieval')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {config.nemoGuardrails.rails.retrieval.map((rail) => (
                <div
                  key={rail.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-sm">{rail.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Priority: {rail.priority}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRail('retrieval', rail.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
