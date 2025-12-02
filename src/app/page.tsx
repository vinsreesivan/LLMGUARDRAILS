'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { GuardrailsAI } from '@/components/GuardrailsAI';
import { NemoGuardrails } from '@/components/NemoGuardrails';
import { ExportDeploy } from '@/components/ExportDeploy';
import { Toaster } from 'react-hot-toast';

interface MainContentProps {
  activeTab?: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeTab = 'dashboard' }) => {
  switch (activeTab) {
    case 'guardrails-ai':
      return <GuardrailsAI />;
    case 'nemo-guardrails':
      return <NemoGuardrails />;
    case 'export':
      return <ExportDeploy />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
};

export default function Home() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Layout>
        <MainContent />
      </Layout>
    </>
  );
}
