import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NebulaGateAI - Guardrails Management Platform',
  description: 'Comprehensive frontend for Guardrails.AI and NeMo Guardrails configuration',
  keywords: ['Guardrails', 'AI Safety', 'NeMo', 'LLM', 'Security'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
