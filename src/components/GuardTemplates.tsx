import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { GUARD_TEMPLATES, SECURITY_PRESETS } from '@/data/guardTemplates';
import { Sparkles, Shield, CheckCircle } from 'lucide-react';

interface GuardTemplatesProps {
  onApplyTemplate: (validatorIds: string[], templateName: string) => void;
  onApplySecurityPreset: (validatorIds: string[], presetName: string) => void;
}

export const GuardTemplates: React.FC<GuardTemplatesProps> = ({
  onApplyTemplate,
  onApplySecurityPreset,
}) => {
  return (
    <div className="space-y-6">
      {/* Security Presets */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span>Security Presets</span>
          </div>
        }
        description="Quick-apply security configurations based on your risk tolerance"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECURITY_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{preset.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                    <p className="text-xs text-gray-500 uppercase">{preset.level}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {preset.validators.length} validators
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onApplySecurityPreset(preset.validators, preset.name)
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Guard Templates */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Guard Templates</span>
          </div>
        }
        description="Pre-configured guard setups for common use cases"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUARD_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`
                border rounded-lg p-4 transition-all
                ${
                  template.recommended
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-200'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{template.icon}</span>
                {template.recommended && (
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {template.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>

              {/* Use Case Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Validator Count */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3" />
                  <span>{template.validators.length} validators</span>
                </div>
                <Button
                  size="sm"
                  variant={template.recommended ? 'primary' : 'outline'}
                  onClick={() =>
                    onApplyTemplate(template.validators, template.name)
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Custom Guard Builder Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Need something custom?
            </h4>
            <p className="text-sm text-blue-700">
              Use the Validator Library below to build your own custom guard configuration.
              Select individual validators to create a guard tailored to your specific needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
