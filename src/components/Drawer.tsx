import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Map, Mail, Briefcase } from 'lucide-react';

export const Drawer: React.FC = () => {
  const { drawerOpen, setDrawerOpen, currentScreen, setCurrentScreen } = useApp();

  if (!drawerOpen) return null;

  const navigateTo = (screen: 'kalendar' | 'qidiruv' | 'xabarlar' | 'xarita') => {
    setCurrentScreen(screen);
    setDrawerOpen(false);
  };

  return (
    <aside className="fixed inset-0 z-[5000] md:hidden">
      {/* Overlay backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer content */}
      <nav className="relative w-64 h-full bg-white p-5 flex flex-col gap-6 shadow-2xl transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-brand-outline-variant pb-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Briefcase size={22} className="fill-brand-primary/10" />
            <span className="font-display text-lg font-bold">Baito</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 rounded-full hover:bg-brand-surface-low text-brand-text-variant hover:text-brand-text cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigateTo('kalendar')}
            className={`flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer ${
              currentScreen === 'kalendar'
                ? 'bg-brand-surface-low text-brand-primary font-bold'
                : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
            }`}
          >
            <Calendar size={18} />
            <span>Kalendar</span>
          </button>

          <button
            onClick={() => navigateTo('xarita')}
            className={`flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer ${
              currentScreen === 'qidiruv' || currentScreen === 'xarita'
                ? 'bg-brand-surface-low text-brand-primary font-bold'
                : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
            }`}
          >
            <Map size={18} />
            <span>Ish qidirish</span>
          </button>

          <button
            onClick={() => navigateTo('xabarlar')}
            className={`flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer ${
              currentScreen === 'xabarlar' || currentScreen === 'chat'
                ? 'bg-brand-surface-low text-brand-primary font-bold'
                : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
            }`}
          >
            <Mail size={18} />
            <span>Xabarlar</span>
          </button>
        </div>

        <div className="mt-auto border-t border-brand-outline-variant pt-4 text-center">
          <p className="text-xs text-brand-text-variant opacity-60">Baito Uzbekistan v1.0.0</p>
        </div>
      </nav>
    </aside>
  );
};
