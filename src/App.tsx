import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Drawer } from './components/Drawer';
import { JobSearchScreen } from './components/JobSearchScreen';
import { MapViewScreen } from './components/MapViewScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ChatScreen } from './components/ChatScreen';
import { RegionSelector } from './components/RegionSelector';

function AppContent() {
  const { currentScreen } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'kalendar':
        return <CalendarScreen />;
      case 'xabarlar':
        return <MessagesScreen />;
      case 'xarita':
        return <MapViewScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'qidiruv':
      default:
        return <JobSearchScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text antialiased font-sans selection:bg-brand-primary-container selection:text-white">
      {/* Dynamic Header */}
      <Header />

      {/* Sidebar Drawer Menu for Mobile view */}
      <Drawer />

      {/* Main Content Layout */}
      <main className={`flex-1 w-full ${currentScreen === 'xarita' ? 'max-w-none px-0 md:px-0' : 'max-w-7xl mx-auto px-4 md:px-6'}`}>
        {renderActiveScreen()}
      </main>

      {/* Bottom Nav Bar (Mobile view only) */}
      <BottomNav />

      {/* Region selector full screen overlay */}
      <RegionSelector />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
