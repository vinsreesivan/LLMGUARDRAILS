import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
