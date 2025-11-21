import React from 'react';
import { MessageSquare, Eye, PenTool, Layers } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: AppView.CHAT, label: 'Nexus Chat', icon: MessageSquare },
    { id: AppView.VISION, label: 'Vision Lab', icon: Eye },
    { id: AppView.WRITER, label: 'Writer Studio', icon: PenTool },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Layers className="text-white w-5 h-5" />
        </div>
        <h1 className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Nexus
        </h1>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className={`hidden md:block font-medium ${isActive ? 'text-indigo-300' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto hidden md:block w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-lg p-3 hidden md:block">
          <p className="text-xs text-slate-500">Powered by</p>
          <p className="text-sm font-semibold text-slate-300">Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};