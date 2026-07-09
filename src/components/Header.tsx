import React from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Map, LayoutList, Calendar, Mail, Search, Bell, User, Briefcase, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentScreen, setCurrentScreen, setDrawerOpen, unreadNotificationsCount, setShowRegionSelector, messagesSearchOpen, setMessagesSearchOpen } = useApp();

  const getMobileTitle = () => {
    switch (currentScreen) {
      case 'kalendar':
        return 'Kalendar';
      case 'xabarlar':
        return 'Xabarlar';
      case 'xarita':
      case 'qidiruv':
      default:
        return 'Ish qidirish';
    }
  };

  const renderMobileActions = () => {
    switch (currentScreen) {
      case 'kalendar':
        return (
          <div className="relative p-2 cursor-pointer text-brand-primary hover:bg-brand-surface-low rounded-full transition-colors">
            <Bell size={22} />
            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unreadNotificationsCount}
            </span>
          </div>
        );
      case 'xabarlar':
        return (
          <button 
            onClick={() => setMessagesSearchOpen(!messagesSearchOpen)}
            className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${
              messagesSearchOpen 
                ? 'text-white bg-brand-primary shadow-sm hover:bg-brand-primary/95 scale-105' 
                : 'text-brand-primary hover:bg-brand-surface-low'
            }`}
          >
            <Search size={22} />
          </button>
        );
      case 'xarita':
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentScreen('qidiruv')}
              className="p-2 cursor-pointer text-brand-primary hover:bg-brand-surface-low rounded-full transition-colors"
              title="Ro'yxat ko'rinishi"
            >
              <LayoutList size={22} />
            </button>
          </div>
        );
      case 'qidiruv':
      default:
        return (
          <button
            onClick={() => setCurrentScreen('xarita')}
            className="p-2 cursor-pointer text-brand-primary hover:bg-brand-surface-low rounded-full transition-colors"
            title="Xarita ko'rinishi"
          >
            <Map size={22} />
          </button>
        );
    }
  };

  return (
    <>
      {/* Mobile Top App Bar */}
      {currentScreen !== 'chat' && (
        <header className="flex md:hidden justify-between items-center px-4 h-14 w-full z-50 bg-white shadow-[0_0_24px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.04)] fixed top-0 left-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center p-2 rounded-full hover:bg-brand-surface-low transition-colors text-brand-primary cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-display text-lg font-bold text-brand-primary truncate flex-1 text-center">
            {getMobileTitle()}
          </h1>
          <div className="flex items-center">
            {renderMobileActions()}
          </div>
        </header>
      )}

      {/* Desktop Top Nav */}
      <header className="hidden md:flex justify-between items-center px-6 h-16 w-full z-50 bg-white shadow-[0_0_24px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.04)] sticky top-0">
        <div className="flex items-center gap-8">
          <div
            onClick={() => setCurrentScreen('xarita')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Briefcase size={26} className="text-brand-primary group-hover:scale-110 transition-transform fill-brand-primary/10" />
            <span className="font-display text-xl font-bold text-brand-primary tracking-tight">Baito</span>
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentScreen('kalendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
                currentScreen === 'kalendar'
                  ? 'text-brand-primary bg-brand-surface-low font-bold border-b-2 border-brand-primary rounded-b-none'
                  : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
              }`}
            >
              <Calendar size={18} />
              Kalendar
            </button>
            <button
              onClick={() => setCurrentScreen('xarita')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
                currentScreen === 'qidiruv' || currentScreen === 'xarita'
                  ? 'text-brand-primary bg-brand-surface-low font-bold border-b-2 border-brand-primary rounded-b-none'
                  : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
              }`}
            >
              <Search size={18} />
              Ish qidirish
            </button>
            <button
              onClick={() => setCurrentScreen('xabarlar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
                currentScreen === 'xabarlar' || currentScreen === 'chat'
                  ? 'text-brand-primary bg-brand-surface-low font-bold border-b-2 border-brand-primary rounded-b-none'
                  : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
              }`}
            >
              <Mail size={18} />
              Xabarlar
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 cursor-pointer hover:bg-brand-surface-low px-3 py-1.5 rounded-full transition-colors border border-brand-outline-variant text-sm font-medium">
            <span className="text-brand-primary">UZ</span>
            <ChevronDown size={14} className="text-brand-text-variant" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-brand-surface-low px-3 py-1.5 rounded-full transition-colors text-sm font-medium text-brand-text-variant">
            <User size={18} />
            <span>Profil</span>
          </div>
        </div>
      </header>
    </>
  );
};
