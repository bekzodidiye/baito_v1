import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Chat, Message } from '../types';
import { initialJobs, initialChats } from '../mockData';

export type ScreenType = 'kalendar' | 'qidiruv' | 'xabarlar' | 'xarita' | 'chat';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  sortBy: 'yangilari' | 'maosh';
  setSortBy: (sort: 'yangilari' | 'maosh') => void;
  applyToJob: (jobId: string) => void;
  toggleBookmark: (jobId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
  addNewMessage: (chatId: string, sender: 'user' | 'recruiter', text: string, hasMap?: boolean, mapLocation?: string) => void;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>;
  activeCalendarFilter: 'all' | 'applied' | 'confirmed' | 'todo' | 'completed';
  setActiveCalendarFilter: (filter: 'all' | 'applied' | 'confirmed' | 'todo' | 'completed') => void;
  activeCalendarDay: string; // YYYY-MM-DD format
  setActiveCalendarDay: (day: string) => void;
  showRegionSelector: boolean;
  setShowRegionSelector: (show: boolean) => void;
  mapFocusedJobId: string | null;
  setMapFocusedJobId: (id: string | null) => void;
  messagesSearchOpen: boolean;
  setMessagesSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage is not accessible in this environment:', e);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage is not accessible in this environment:', e);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('xarita');
  const [jobs, setJobs] = useState<Job[]>(() => {
    const cached = safeGetItem('projob_jobs');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const containsOldData = parsed.some((j: any) => j.title === 'Katta Buxgalter' || j.title === 'Sotuv bo\'yicha menejer' || j.company === '"Artel Electronics" MChJ');
        if (parsed.length === initialJobs.length && !containsOldData) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing jobs cache:', e);
      }
    }
    safeSetItem('projob_jobs', JSON.stringify(initialJobs));
    return initialJobs;
  });
  const [chats, setChats] = useState<Chat[]>(() => {
    const cached = safeGetItem('projob_chats_v4');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const containsOldChats = parsed.some((c: any) => 
          c.companyName === 'Artel Kitchen' || 
          c.companyName === 'Korzinka.uz' || 
          c.companyName === 'Murad Buildings' || 
          c.companyName === 'Akfa Group' ||
          c.companyName === 'Apex Logistics' ||
          c.companyName === 'Toshkent City Mall' ||
          (c.messages && c.messages.some((m: any) => m.text.toLowerCase().includes('suhbat')))
        );
        if (!containsOldChats) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing chats cache:', e);
      }
    }
    safeSetItem('projob_chats_v4', JSON.stringify(initialChats));
    return initialChats;
  });
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('Barchasi');
  const [filterType, setFilterType] = useState('Barchasi');
  const [sortBy, setSortBy] = useState<'yangilari' | 'maosh'>('yangilari');
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [mapFocusedJobId, setMapFocusedJobId] = useState<string | null>(null);
  const [messagesSearchOpen, setMessagesSearchOpen] = useState(false);

  // Calendar State
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(1);
  const [activeCalendarFilter, setActiveCalendarFilter] = useState<'all' | 'applied' | 'confirmed' | 'todo' | 'completed'>('all');
  const [activeCalendarDay, setActiveCalendarDay] = useState('2026-06-12'); // Mocking June 12, 2026 as active/today

  useEffect(() => {
    safeSetItem('projob_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    safeSetItem('projob_chats_v4', JSON.stringify(chats));
  }, [chats]);

  const toggleBookmark = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, bookmarked: !job.bookmarked } : job
      )
    );
  };

  const applyToJob = (jobId: string) => {
    // Apply status and calendar event update
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, applied: true, status: 'applied' } : job
      )
    );

    // Dynamic message creation
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      // Find if chat exists, if not create it
      const existingChat = chats.find(c => c.companyName.toLowerCase().includes(job.company.toLowerCase()) || job.company.toLowerCase().includes(c.companyName.toLowerCase()));
      
      const timeNow = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: Math.random().toString(),
        sender: 'user',
        text: `Assalomu alaykum! Men sizning "${job.title}" ishingizga ariza topshirdim. Mening rezyumem bilan tanishishingizni so'rayman.`,
        time: timeNow
      };

      if (existingChat) {
        setChats(prevChats =>
          prevChats.map(c =>
            c.id === existingChat.id
              ? {
                  ...c,
                  messages: [...c.messages, newMsg],
                  lastMessageTime: timeNow,
                }
              : c
          )
        );
      } else {
        const newChatId = 'c_' + Date.now();
        const newChat: Chat = {
          id: newChatId,
          companyName: job.company.replace(/"/g, ''),
          logoUrl: job.logoUrl,
          recruiterName: 'Mas\'ul xodim',
          recruiterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          online: true,
          unreadCount: 0,
          lastMessageTime: timeNow,
          messages: [newMsg]
        };
        setChats(prevChats => [newChat, ...prevChats]);
      }
    }
  };

  const addNewMessage = (chatId: string, sender: 'user' | 'recruiter', text: string, hasMap?: boolean, mapLocation?: string) => {
    const timeNow = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Math.random().toString(),
      sender,
      text,
      time: timeNow,
      hasMap,
      mapLocation
    };

    setChats(prevChats =>
      prevChats.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessageTime: timeNow,
            unreadCount: sender === 'recruiter' && selectedChatId !== chatId ? c.unreadCount + 1 : c.unreadCount
          };
        }
        return c;
      })
    );
  };

  const sendMessage = (chatId: string, text: string) => {
    addNewMessage(chatId, 'user', text);

    // Recruiters reply sequence
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setTimeout(() => {
        let reply = 'Tushunarli. Batafsil ma\'lumot va yo\'llanma bo\'yicha tez orada xabar beramiz.';
        let hasMap = false;
        let mapLocation = '';

        const txt = text.toLowerCase();
        if (txt.includes('salom') || txt.includes('assalom')) {
          reply = `Assalomu alaykum! Xabaringiz uchun rahmat. Ushbu kunlik ish yoki smena bo'yicha qanday qo'shimcha savollaringiz bor?`;
        } else if (txt.includes('maosh') || txt.includes('oylik') || txt.includes('pul') || txt.includes('to\'lov') || txt.includes('tolov')) {
          reply = `Kunlik ish haqi har bir smena yakunlanishi bilan shu kunning o'zidayoq naqd yoki plastik kartangizga to'liq o'tkazib beriladi.`;
        } else if (txt.includes('manzil') || txt.includes('qayerda') || txt.includes('joylashgan')) {
          reply = `Ish joyi manzilini va uchrashish nuqtasini mana bu xarita orqali ko'rib olishingiz mumkin.`;
          hasMap = true;
          mapLocation = 'Tashkent, O\'zbekiston';
        } else if (txt.includes('rahmat') || txt.includes('yaxshi') || txt.includes('ok') || txt.includes('tushunarli')) {
          reply = `Arziydi! Biz sizni kutamiz. Savollar tug'ilsa, bemalol yozishingiz mumkin.`;
        } else if (txt.includes('diplom') || txt.includes('sertifikat') || txt.includes('hujjat')) {
          reply = `Kunlik va qisqa muddatli ishlar uchun diplom yoki sertifikat shart emas. Kelganda shaxsingizni tasdiqlovchi hujjat (pasport yoki ID karta) bo'lsa kifoya.`;
        }

        addNewMessage(chatId, 'recruiter', reply, hasMap, mapLocation);
      }, 2500);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        jobs,
        setJobs,
        chats,
        setChats,
        selectedChatId,
        setSelectedChatId,
        drawerOpen,
        setDrawerOpen,
        searchTerm,
        setSearchTerm,
        filterLocation,
        setFilterLocation,
        filterType,
        setFilterType,
        sortBy,
        setSortBy,
        applyToJob,
        toggleBookmark,
        sendMessage,
        addNewMessage,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        activeCalendarFilter,
        setActiveCalendarFilter,
        activeCalendarDay,
        setActiveCalendarDay,
        showRegionSelector,
        setShowRegionSelector,
        mapFocusedJobId,
        setMapFocusedJobId,
        messagesSearchOpen,
        setMessagesSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
