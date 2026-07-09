import React from 'react';
import { useApp, ScreenType } from '../context/AppContext';
import { Calendar, Map, Mail } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  if (currentScreen === 'chat') return null;

  const handleNavClick = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const isTabActive = (tab: 'kalendar' | 'qidiruv' | 'xabarlar') => {
    if (tab === 'kalendar') return currentScreen === 'kalendar';
    if (tab === 'qidiruv') return currentScreen === 'qidiruv' || currentScreen === 'xarita';
    if (tab === 'xabarlar') return currentScreen === 'xabarlar' || currentScreen === 'chat';
    return false;
  };

  const isMapScreen = currentScreen === 'xarita';

  return (
    <nav className={`fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-white pb-safe h-16 md:hidden transition-all ${
      isMapScreen ? 'shadow-none' : 'shadow-[0_-4px_24px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.03)]'
    }`}>
      <button
        onClick={() => handleNavClick('kalendar')}
        className={`flex flex-col items-center justify-center pt-1 w-full hover:bg-brand-surface-low active:scale-95 transition-all cursor-pointer relative h-full ${
          isTabActive('kalendar')
            ? 'text-brand-primary font-bold'
            : 'text-brand-text-variant'
        }`}
      >
        <Calendar size={22} className="mb-1" />
        <span className="text-[11px] font-medium leading-tight">Kalendar</span>
      </button>

      <button
        onClick={() => handleNavClick('xarita')}
        className={`flex flex-col items-center justify-center pt-1 w-full hover:bg-brand-surface-low active:scale-95 transition-all cursor-pointer relative h-full ${
          isTabActive('qidiruv')
            ? 'text-brand-primary font-bold'
            : 'text-brand-text-variant'
        }`}
      >
        <Map size={22} className="mb-1" />
        <span className="text-[11px] font-medium leading-tight">Ish qidirish</span>
      </button>

      <button
        onClick={() => handleNavClick('xabarlar')}
        className={`flex flex-col items-center justify-center pt-1 w-full hover:bg-brand-surface-low active:scale-95 transition-all cursor-pointer relative h-full ${
          isTabActive('xabarlar')
            ? 'text-brand-primary font-bold'
            : 'text-brand-text-variant'
        }`}
      >
        <Mail size={22} className="mb-1" />
        <span className="text-[11px] font-medium leading-tight">Xabarlar</span>
      </button>
    </nav>
  );
};
