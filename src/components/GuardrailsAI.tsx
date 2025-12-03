import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { useConfigStore } from '@/store/configStore';
import { Shield, Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { Guard, Validator } from '@/types';
import toast from 'react-hot-toast';
import { GuardTemplates } from './GuardTemplates';
import { ValidatorLibrary } from './ValidatorLibrary';
import { VALIDATOR_TEMPLATES } from '@/data/validatorTemplates';

export const GuardrailsAI: React.FC = () => {
  const { config, updateGuardrailsAI } = useConfigStore();
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [guardName, setGuardName] = useState('');
  const [guardDescription, setGuardDescription] = useState('');
  const [showGuardBuilder, setShowGuardBuilder] = useState(false);

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

  const handleToggleValidator = (validatorId: string) => {
    setSelectedValidators((prev) =>
      prev.includes(validatorId)
        ? prev.filter((id) => id !== validatorId)
        : [...prev, validatorId]
    );
  };

  const handleSelectAllInCategory = (category: string) => {
    const categoryValidators = VALIDATOR_TEMPLATES
      .filter((v) => v.category === category)
      .map((v) => v.id);

    setSelectedValidators((prev) => {
      const allSelected = categoryValidators.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !categoryValidators.includes(id));
      } else {
        return [...new Set([...prev, ...categoryValidators])];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedValidators([]);
    toast.success('All validators cleared');
  };

  const handleApplyTemplate = (validatorIds: string[], templateName: string) => {
    setSelectedValidators(validatorIds);
    setGuardName(templateName);
    setGuardDescription(`Guard based on ${templateName} template`);
    setShowGuardBuilder(true);
    toast.success(`Applied ${templateName} template`);
  };

  const handleApplySecurityPreset = (validatorIds: string[], presetName: string) => {
    setSelectedValidators(validatorIds);
    setGuardName(presetName);
    setGuardDescription(`Security preset: ${presetName}`);
    setShowGuardBuilder(true);
    toast.success(`Applied ${presetName} security preset`);
  };

  const handleCreateGuard = () => {
    if (!guardName.trim()) {
      toast.error('Please enter a guard name');
      return;
    }

    if (selectedValidators.length === 0) {
      toast.error('Please select at least one validator');
      return;
    }

    const validators: Validator[] = selectedValidators.map((validatorId) => {
      const template = VALIDATOR_TEMPLATES.find((v) => v.id === validatorId);
      return {
        id: generateId(),
        name: template?.name || validatorId,
        type: template?.category || 'custom',
        parameters: template?.defaultParameters || {},
        enabled: true,
        category: template?.category,
        description: template?.description,
        infrastructure: template?.infrastructure,
        useCases: template?.useCases,
        riskCategories: template?.riskCategories,
      };
    });

    const newGuard: Guard = {
      id: generateId(),
      name: guardName,
      description: guardDescription || 'Custom guard configuration',
      validators,
      createdAt: new Date().toISOString(),
    };

    updateGuardrailsAI({
      guards: [...config.guardrailsAI.guards, newGuard],
    });

    toast.success(`Guard "${guardName}" created with ${validators.length} validators`);
    setGuardName('');
    setGuardDescription('');
    setSelectedValidators([]);
    setShowGuardBuilder(false);
  };

  const handleDeleteGuard = (id: string) => {
    updateGuardrailsAI({
      guards: config.guardrailsAI.guards.filter((g) => g.id !== id),
    });
    toast.success('Guard deleted');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Guardrails.AI Configuration
        </h2>
        <p className="text-gray-600">
          Configure Guardrails.AI server and manage your guards
        </p>
      </div>

      {/* Server Configuration */}
      <Card title="Server Configuration" description="Configure Guardrails.AI server settings">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Server Host"
              placeholder="localhost:8000"
              value={config.guardrailsAI.server.host}
              onChange={(e) => handleUpdateServer('host', e.target.value)}
            />
            <Input
              label="Server Port"
              type="number"
              placeholder="8000"
              value={config.guardrailsAI.server.port}
              onChange={(e) => handleUpdateServer('port', parseInt(e.target.value))}
            />
          </div>
        </div>
      </Card>

      {/* Hub Authentication */}
      <Card title="Hub Authentication" description="Configure Guardrails Hub access">
        <div className="space-y-4">
          <Input
            label="Hub Token"
            type="password"
            placeholder="Your Guardrails Hub token"
            value={config.guardrailsAI.hubAuth.token}
            onChange={(e) => handleUpdateAuth('token', e.target.value)}
          />
          <Input
            label="Hub Base URL"
            placeholder="https://api.guardrailsai.com"
            value={config.guardrailsAI.hubAuth.baseUrl}
            onChange={(e) => handleUpdateAuth('baseUrl', e.target.value)}
          />
        </div>
      </Card>

      {/* LLM API Keys */}
      <Card title="LLM API Keys" description="Configure API keys for LLM providers">
        <div className="space-y-4">
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
      </Card>

      {/* Telemetry & Remote Inferencing */}
      <Card title="Advanced Settings" description="Telemetry and remote inferencing configuration">
        <div className="space-y-4">
          <Toggle
            label="Enable Telemetry"
            description="Send anonymous usage data to improve Guardrails.AI"
            enabled={config.guardrailsAI.telemetry.enabled}
            onChange={(enabled) =>
              updateGuardrailsAI({
                telemetry: { ...config.guardrailsAI.telemetry, enabled },
              })
            }
          />
          <Toggle
            label="Remote Inferencing"
            description="Use Guardrails Hub infrastructure for inferencing"
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

      {/* Guard Management */}
      <Card
        title="Guards"
        description="Create and manage your guards with pre-configured templates"
      >
        <div className="space-y-6">
          {/* Existing Guards */}
          {config.guardrailsAI.guards.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Your Guards</h4>
              {config.guardrailsAI.guards.map((guard) => (
                <div
                  key={guard.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <h5 className="font-semibold text-gray-900">{guard.name}</h5>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {guard.validators.length} validators
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{guard.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {guard.validators.slice(0, 5).map((validator) => (
                          <span
                            key={validator.id}
                            className="text-xs px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded"
                          >
                            {validator.name}
                          </span>
                        ))}
                        {guard.validators.length > 5 && (
                          <span className="text-xs px-2 py-1 text-gray-500">
                            +{guard.validators.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteGuard(guard.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create New Guard Button */}
          {!showGuardBuilder && (
            <Button
              onClick={() => setShowGuardBuilder(true)}
              variant="primary"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Guard
            </Button>
          )}

          {/* Guard Builder */}
          {showGuardBuilder && (
            <div className="space-y-6 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Guard Builder</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowGuardBuilder(false);
                    setSelectedValidators([]);
                    setGuardName('');
                    setGuardDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>

              {/* Guard Details */}
              <div className="space-y-4">
                <Input
                  label="Guard Name"
                  placeholder="e.g., Customer Support Guard"
                  value={guardName}
                  onChange={(e) => setGuardName(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe what this guard protects against..."
                    value={guardDescription}
                    onChange={(e) => setGuardDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Templates & Presets */}
              <GuardTemplates
                onApplyTemplate={handleApplyTemplate}
                onApplySecurityPreset={handleApplySecurityPreset}
              />

              {/* Validator Library */}
              <ValidatorLibrary
                selectedValidators={selectedValidators}
                onToggleValidator={handleToggleValidator}
                onSelectAll={handleSelectAllInCategory}
                onClearAll={handleClearAll}
              />

              {/* Create Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedValidators.length} validators selected
                </div>
                <Button
                  onClick={handleCreateGuard}
                  variant="primary"
                  disabled={!guardName || selectedValidators.length === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Guard
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
