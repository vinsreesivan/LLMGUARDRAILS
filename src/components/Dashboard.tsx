import React from 'react';
import { Card } from './ui/Card';
import { useConfigStore } from '@/store/configStore';
import { Shield, Sparkles, CheckCircle, AlertCircle, Settings } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { config } = useConfigStore();

  const stats = [
    {
      title: 'Guardrails.AI Status',
      value: config.guardrailsAI.hubAuth.token ? 'Connected' : 'Not Connected',
      icon: <Shield className="w-8 h-8" />,
      color: config.guardrailsAI.hubAuth.token ? 'text-green-600' : 'text-orange-600',
      bg: config.guardrailsAI.hubAuth.token ? 'bg-green-100' : 'bg-orange-100',
    },
    {
      title: 'NeMo Guardrails',
      value: `${config.nemoGuardrails.models.length} Models`,
      icon: <Sparkles className="w-8 h-8" />,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Active Guards',
      value: config.guardrailsAI.guards.length,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Security Features',
      value: Object.values(config.nemoGuardrails.security).filter(Boolean).length,
      icon: <AlertCircle className="w-8 h-8" />,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your Guardrails configuration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Guardrails.AI Configuration">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Server Host</span>
              <span className="text-sm font-medium">{config.guardrailsAI.server.host}:{config.guardrailsAI.server.port}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Telemetry</span>
              <span className={`text-sm font-medium ${config.guardrailsAI.telemetry.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.guardrailsAI.telemetry.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Remote Inferencing</span>
              <span className={`text-sm font-medium ${config.guardrailsAI.remoteInferencing.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                {config.guardrailsAI.remoteInferencing.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="NeMo Guardrails Security">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Jailbreak Detection</span>
              <span className={`text-sm font-medium ${config.nemoGuardrails.security.jailbreakDetection ? 'text-green-600' : 'text-gray-400'}`}>
                {config.nemoGuardrails.security.jailbreakDetection ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Content Safety</span>
              <span className={`text-sm font-medium ${config.nemoGuardrails.security.contentSafety ? 'text-green-600' : 'text-gray-400'}`}>
                {config.nemoGuardrails.security.contentSafety ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Caching Strategy</span>
              <span className="text-sm font-medium">{config.nemoGuardrails.caching.strategy}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Start Guide">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-medium text-gray-900">Configure Guardrails.AI</h4>
              <p className="text-sm text-gray-600">Set up your Hub authentication and server settings</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-medium text-gray-900">Configure NeMo Guardrails</h4>
              <p className="text-sm text-gray-600">Add models and configure security features</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-medium text-gray-900">Export & Deploy</h4>
              <p className="text-sm text-gray-600">Download your configuration or deploy with Docker</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
