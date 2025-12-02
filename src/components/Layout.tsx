import React, { useState } from 'react';
import {
  Shield,
  Settings,
  LayoutDashboard,
  Download,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export type NavItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'guardrails-ai', name: 'Guardrails.AI', icon: <Shield className="w-5 h-5" /> },
  { id: 'nemo-guardrails', name: 'NeMo Guardrails', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'export', name: 'Export & Deploy', icon: <Download className="w-5 h-5" /> },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-nebula rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-nebula bg-clip-text text-transparent">
                    NebulaGateAI
                  </h1>
                  <p className="text-xs text-gray-500">Guardrails Management Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">v1.0.0</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40',
            sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          )}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                  activeTab === item.id
                    ? 'bg-gradient-nebula text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { activeTab });
              }
              return child;
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
