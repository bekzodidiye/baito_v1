import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Phone, MoreVertical, Paperclip, Smile, Send, MapPin, CheckCheck, CircleHelp } from 'lucide-react';
import { motion } from 'motion/react';

export const ChatScreen: React.FC = () => {
  const { chats, selectedChatId, sendMessage, setCurrentScreen } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === selectedChatId);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-brand-text-variant pt-20">
        <CircleHelp size={40} className="mb-2 text-brand-outline-variant" />
        <p className="font-display font-bold text-sm">Suhbat topilmadi</p>
        <button
          onClick={() => setCurrentScreen('xabarlar')}
          className="mt-4 bg-brand-primary text-white font-bold text-xs py-2 px-6 rounded-full cursor-pointer"
        >
          Xabarlarga qaytish
        </button>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentText = inputText;
    sendMessage(activeChat.id, currentText);
    setInputText('');

    // Trigger Typing Indicator sequence
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2400);
  };

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-64px)] bg-brand-background relative pt-0">
      {/* Top App Bar inside Chat */}
      <header className="flex justify-between items-center px-4 h-16 w-full z-50 bg-white shadow-[0_0_24px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.04)] fixed top-0 md:top-16 left-0 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('xabarlar')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low transition-colors cursor-pointer text-brand-text-variant"
            aria-label="Orqaga"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-brand-surface-low flex items-center justify-center overflow-hidden border border-brand-outline-variant">
                {activeChat.recruiterAvatar ? (
                  <img src={activeChat.recruiterAvatar} alt={activeChat.recruiterName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-primary text-white font-bold text-xs">
                    {activeChat.companyName.charAt(0)}
                  </div>
                )}
              </div>
              {activeChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-secondary rounded-full border-2 border-white animate-pulse" />
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="font-display font-bold text-sm text-brand-primary leading-tight">
                {activeChat.companyName}
              </h1>
              <span className="text-[10px] font-bold text-brand-secondary">
                {activeChat.online ? 'Onlayn' : 'Oflayn'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low text-brand-text-variant cursor-pointer transition-colors">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low text-brand-text-variant cursor-pointer transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Messages Canvas */}
      <main className="flex-1 mt-16 mb-20 px-4 pt-6 overflow-y-auto no-scrollbar flex flex-col space-y-4">
        {/* Date Separator */}
        <div className="flex justify-center my-2">
          <span className="px-3.5 py-1.5 bg-white text-brand-text-variant font-bold text-[10px] rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.06),_0_1px_2px_rgba(0,0,0,0.02)] border border-brand-outline-variant/15">
            Bugun
          </span>
        </div>

        {/* Message Feed */}
        {activeChat.messages.map((msg, index) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2 max-w-[85%] ${
                isUser ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {/* Recruiter Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-brand-surface-low flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-outline-variant shadow-xs">
                  {activeChat.recruiterAvatar ? (
                    <img src={activeChat.recruiterAvatar} alt={activeChat.recruiterName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-xs text-brand-primary">{activeChat.companyName.charAt(0)}</span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                <div
                  className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                    isUser
                      ? 'bg-brand-primary text-white rounded-br-none shadow-[inset_0_4px_8px_rgba(0,0,0,0.25),_inset_0_1px_3px_rgba(0,0,0,0.12),_0_4px_12px_rgba(26,35,126,0.25)]'
                      : 'bg-white text-brand-text rounded-bl-none border border-brand-outline-variant/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),_0_2px_6px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Map Attachment */}
                  {msg.hasMap && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] group max-w-sm">
                      {/* Minimalist vector map preview */}
                      <div className="w-full h-28 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 320 112" className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.02]">
                          <defs>
                            <linearGradient id="river-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f0f9ff" />
                              <stop offset="100%" stopColor="#e0f2fe" />
                            </linearGradient>
                          </defs>

                          {/* Soft land background */}
                          <rect width="320" height="112" fill="#fafafa" />
                          
                          {/* Aesthetic light park areas */}
                          <path d="M -10 -10 C 40 10, 60 40, 30 75 C 10 100, 0 110, -20 120 Z" fill="#f0fdf4" />
                          <path d="M 240 -10 C 270 20, 290 10, 310 5 C 330 30, 340 80, 290 100 Q 240 110, 230 70 Z" fill="#f0fdf4" />
                          
                          {/* S-curve river */}
                          <path d="M -10 90 C 70 85, 110 65, 140 45 C 170 25, 230 15, 330 5" fill="none" stroke="url(#river-gradient)" strokeWidth="12" strokeLinecap="round" />

                          {/* Minimal white streets */}
                          <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                            {/* Main horizontal avenue */}
                            <path d="M -10 40 L 330 40" />
                            {/* Main vertical street */}
                            <path d="M 120 -10 L 120 120" />
                            {/* Secondary diagonal street */}
                            <path d="M 220 -10 L 170 120" />
                          </g>

                          {/* Fine grey street borders for crisp definition */}
                          <g stroke="#f1f5f9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none">
                            <path d="M -10 36 L 330 36" />
                            <path d="M -10 44 L 330 44" />
                            <path d="M 116 -10 L 116 120" />
                            <path d="M 124 -10 L 124 120" />
                          </g>

                          {/* Blue active route path */}
                          <path d="M 120 90 L 120 40 L 160 40" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="120" cy="90" r="3" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                        </svg>

                        {/* Classic, clean map pin */}
                        <div className="absolute top-[36%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col items-center pointer-events-none">
                          <div className="relative">
                            <span className="absolute -inset-2 rounded-full bg-red-500/10 animate-ping"></span>
                            <div className="bg-red-500 text-white p-1 rounded-full shadow-[0_2px_6px_rgba(239,68,68,0.3)]">
                              <MapPin size={14} className="fill-white/10" />
                            </div>
                          </div>
                        </div>

                        {/* Small, clean glassmorphic address badge inside map */}
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-medium py-1 px-2.5 rounded-lg flex items-center gap-1.5 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{msg.mapLocation || "Ish joyi"}</span>
                        </div>
                      </div>
                      
                      {/* Clean bottom action bar */}
                      <button
                        onClick={() => setCurrentScreen('xarita')}
                        className="w-full py-2 px-3 flex items-center justify-between bg-white hover:bg-slate-50 border-t border-slate-100 transition-all cursor-pointer group/btn"
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin size={13} className="text-blue-500" />
                          <span className="text-[11px] font-semibold">Ish joyi xaritasi</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-blue-600 text-[10px] font-bold">
                          <span>Yo'nalish</span>
                          <span className="transform translate-x-0 group-hover/btn:translate-x-0.5 transition-transform">→</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-1 mt-0.5 ${isUser ? 'justify-end mr-1' : 'ml-1'}`}>
                  <span className="text-[9px] text-brand-outline font-bold">
                    {msg.time}
                  </span>
                  {isUser && (
                    <CheckCheck size={11} className="text-brand-primary shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Recruiter Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2" id="typing-indicator">
            <div className="w-8 h-8 rounded-full bg-brand-surface-low overflow-hidden border border-brand-outline-variant">
              {activeChat.recruiterAvatar ? (
                <img src={activeChat.recruiterAvatar} alt={activeChat.recruiterName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-brand-primary">{activeChat.companyName.charAt(0)}</span>
              )}
            </div>
            <div className="flex gap-1 bg-white px-4 py-2.5 rounded-full border border-brand-outline-variant/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <span className="w-1.5 h-1.5 bg-brand-outline rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-brand-outline rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="w-1.5 h-1.5 bg-brand-outline rounded-full animate-bounce [animation-delay:0.6s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Bar Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-4 py-3 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-3">
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-brand-text-variant shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all cursor-pointer border-0 outline-none active:scale-95 duration-150 shrink-0"
            title="Fayl biriktirish"
          >
            <Paperclip size={18} />
          </button>

          <form onSubmit={handleSend} className="flex-1 relative flex items-center">
            <input
              type="text"
              className="w-full bg-white text-brand-text font-sans rounded-full py-3 px-5 pr-12 shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] border-0 focus:bg-white focus:outline-none focus:ring-0 transition-all placeholder:text-brand-outline text-xs font-semibold h-11"
              placeholder="Xabar yozing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 text-brand-outline hover:text-brand-primary transition-colors cursor-pointer"
              title="Smayliklar"
            >
              <Smile size={18} />
            </button>
          </form>

          <button
            onClick={handleSend}
            type="submit"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-brand-primary text-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.35),_inset_0_1px_3px_rgba(0,0,0,0.15),_0_0_12px_rgba(26,35,126,0.3)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(0,0,0,0.2),_0_0_16px_rgba(26,35,126,0.45)] active:scale-90 transition-all cursor-pointer shrink-0 border-0 outline-none duration-150"
            title="Yuborish"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
