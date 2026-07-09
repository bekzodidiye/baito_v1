import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, SquarePen, Inbox, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MessagesScreen: React.FC = () => {
  const { chats, setChats, setSelectedChatId, setCurrentScreen, messagesSearchOpen, setMessagesSearchOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeCompany, setComposeCompany] = useState('');
  const [composeMessage, setComposeMessage] = useState('');

  const filteredChats = chats.filter(chat => {
    return (
      chat.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleChatClick = (chatId: string) => {
    // Clear unread count for this chat
    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChatId(chatId);
    setCurrentScreen('chat');
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeCompany || !composeMessage) return;

    const timeNow = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const newChatId = 'c_' + Date.now();
    const newChat = {
      id: newChatId,
      companyName: composeCompany,
      recruiterName: 'Mas\'ul xodim',
      logoUrl: undefined,
      recruiterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true,
      unreadCount: 0,
      lastMessageTime: timeNow,
      messages: [
        {
          id: 'm1',
          sender: 'user' as const,
          text: composeMessage,
          time: timeNow
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setComposeOpen(false);
    setComposeCompany('');
    setComposeMessage('');
    setSelectedChatId(newChatId);
    setCurrentScreen('chat');
  };

  return (
    <div className="flex flex-col gap-4 pb-20 pt-16 md:pt-4">
      {/* Search Bar */}
      <AnimatePresence>
        {messagesSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 4 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04),_0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/5 transition-all duration-300 h-12 px-4 group/search">
              <Search className="text-slate-400 group-focus-within/search:text-brand-primary transition-colors flex-shrink-0" size={18} />
              <input
                type="text"
                autoFocus
                className="w-full h-full pl-3 pr-8 bg-transparent text-sm font-sans focus:outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-800"
                placeholder="Ish beruvchi yoki xabarni izlash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {(searchQuery || messagesSearchOpen) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setMessagesSearchOpen(false);
                  }}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat List */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),_0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden">
        {filteredChats.map((chat, idx) => {
          const lastMsg = chat.messages[chat.messages.length - 1];

          return (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleChatClick(chat.id)}
              className="flex items-center px-4 py-4 hover:bg-brand-surface-low transition-colors cursor-pointer border-b border-brand-surface-low last:border-none group relative"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-surface-low border border-brand-outline-variant">
                  {chat.recruiterAvatar ? (
                    <img src={chat.recruiterAvatar} alt={chat.recruiterName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-primary text-white font-bold text-sm">
                      {chat.companyName.charAt(0)}
                    </div>
                  )}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-secondary border-2 border-white rounded-full" />
                )}
              </div>

              <div className="ml-4 flex-grow min-w-0 pr-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-display font-bold text-sm text-brand-primary truncate group-hover:text-brand-primary-container transition-colors">
                    {chat.companyName}
                  </h3>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${
                    chat.unreadCount > 0 ? 'text-brand-primary font-bold' : 'text-brand-text-variant'
                  }`}>
                    {chat.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-xs truncate pr-4 ${
                    chat.unreadCount > 0 ? 'text-brand-text font-semibold' : 'text-brand-text-variant font-medium'
                  }`}>
                    {lastMsg?.text || 'Muloqot boshlanmadi'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="flex-shrink-0 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="p-8 text-center text-brand-text-variant">
            <Inbox size={40} className="mx-auto text-brand-outline-variant mb-2" />
            <p className="font-display font-bold text-sm">Xabarlar topilmadi</p>
          </div>
        )}
      </div>

      {/* Empty state tip */}
      <div className="mt-4 text-center">
        <p className="text-xs text-brand-text-variant opacity-60 font-semibold">
          Sizda yana 12 ta eski yozishmalar mavjud
        </p>
      </div>

      {/* Floating Action Button (Only on Messages to compose new) */}
      <button
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-[#000666] hover:bg-[#000666]/90 text-white shadow-lg shadow-[#000666]/20 flex items-center justify-center active:scale-90 transition-all z-40 cursor-pointer border border-transparent"
        title="Yangi xabar yozish"
      >
        <SquarePen size={22} />
      </button>

      {/* Compose Chat Modal overlay */}
      <AnimatePresence>
        {composeOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComposeOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleComposeSubmit}
              className="relative bg-white w-full max-w-md rounded-2xl p-6 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-10 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b border-brand-surface-low pb-3">
                <h3 className="font-display font-bold text-base text-[#000666]">Yangi xabar yozish</h3>
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="p-1 rounded-full hover:bg-brand-surface-low text-brand-text-variant cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ish beruvchi / Buyurtmachi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Artel Mebel, Grand To'yxona, Korzinka..."
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-0 transition-all"
                  value={composeCompany}
                  onChange={(e) => setComposeCompany(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Xabar matni</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Assalomu alaykum! Men..."
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-0 transition-all resize-none"
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#000666] hover:bg-[#000666]/90 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors mt-2"
              >
                <span>Xabarni yuborish</span>
                <Send size={14} />
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
