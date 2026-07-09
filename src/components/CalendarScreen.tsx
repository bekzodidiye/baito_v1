import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Star, Calendar, CheckCircle2, AlertCircle, Clock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CalendarScreen: React.FC = () => {
  const { jobs, activeCalendarFilter, setActiveCalendarFilter } = useApp();
  const [activeAccordion, setActiveAccordion] = useState<string | null>('arizalar');
  const [selectedDay, setSelectedDay] = useState<number>(12); // Default is June 12, 2026 (Friday)

  // Filter jobs by their status categories for the calendar list
  const appliedJobs = jobs.filter(j => j.applied || j.status === 'applied');
  const confirmedJobs = jobs.filter(j => j.status === 'confirmed');
  const todoJobs = jobs.filter(j => j.status === 'todo');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  // Generate calendar days for June 2026
  // June 1, 2026 is a Monday (Du). It has 30 days.
  // We can also render 5 trailing days of July as gray.
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const nextMonthDays = [1, 2, 3, 4, 5];

  // Map days to specific statuses as requested by the user
  const getDayStatus = (day: number): 'applied' | 'confirmed' | 'todo' | 'completed' | null => {
    if (day === 5 || day === 8) return 'applied';     // Applied / Yellow
    if (day === 15) return 'confirmed';               // Confirmed / Green
    if (day === 17 || day === 24) return 'todo';       // Todo (Starts later) / Red
    if (day === 20 || day === 22) return 'completed';  // Completed / Star ⭐
    return null;
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const status = getDayStatus(day);
    if (status === 'applied') {
      setActiveAccordion('arizalar');
    } else if (status === 'confirmed') {
      setActiveAccordion('tasdiqlangan');
    } else if (status === 'todo') {
      setActiveAccordion('hisobotlar');
    } else if (status === 'completed') {
      setActiveAccordion('tugallangan');
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20 pt-16 md:pt-4">
      {/* Calendar Section */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),_0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold text-slate-800">2026-yil Iyun</h2>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center mb-2 border-b border-slate-100 pb-2">
          {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(d => (
            <div key={d} className="text-xs font-bold text-slate-400 font-display">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center gap-y-3">
          {days.map(day => {
            const isSelected = selectedDay === day;
            const isToday = day === 12;
            const status = getDayStatus(day);

            // Determine day button classes & inner elements dynamically
            let buttonClasses = "w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all relative cursor-pointer ";
            let content: React.ReactNode = day;

            if (isSelected) {
              // Selected Day state: purely white with a gorgeous strong box-shadow and crisp border
              buttonClasses += "bg-white text-brand-primary border-2 border-brand-primary/90 shadow-[0_8px_20px_rgba(59,130,246,0.18),_0_2px_5px_rgba(0,0,0,0.06)] scale-110 z-10";
              
              if (status === 'completed') {
                content = (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Star size={34} className="fill-brand-primary text-brand-primary absolute animate-scaleIn" />
                    <span className="relative z-10 text-[10px] text-white font-black leading-none pb-[2px]">{day}</span>
                  </div>
                );
              } else {
                content = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="leading-none">{day}</span>
                    {status === 'applied' && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    {status === 'confirmed' && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {status === 'todo' && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    {isToday && !status && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-primary" />}
                  </div>
                );
              }
            } else {
              // Non-selected Day states
              if (status === 'completed') {
                buttonClasses += "bg-transparent text-brand-primary hover:scale-105";
                content = (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Star size={36} className="fill-brand-primary text-brand-primary absolute drop-shadow-xs" />
                    <span className="relative z-10 text-[10px] text-white font-black leading-none pb-[2px]">{day}</span>
                  </div>
                );
              } else if (status === 'applied') {
                buttonClasses += "bg-amber-500 text-white shadow-[0_2px_8px_rgba(245,158,11,0.25)] hover:bg-amber-600";
              } else if (status === 'confirmed') {
                buttonClasses += "bg-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)] hover:bg-emerald-600";
              } else if (status === 'todo') {
                buttonClasses += "bg-rose-500 text-white shadow-[0_2px_8px_rgba(244,63,94,0.25)] hover:bg-rose-600";
              } else if (isToday) {
                // Today (unselected) -> neat outline circle
                buttonClasses += "border border-brand-primary/50 text-brand-primary font-bold hover:bg-blue-50";
              } else {
                // Normal day
                buttonClasses += "text-slate-600 hover:bg-slate-100 font-semibold";
              }
            }

            return (
              <div
                key={day}
                className="relative flex flex-col items-center justify-center p-1"
              >
                <button
                  onClick={() => handleDayClick(day)}
                  className={buttonClasses}
                >
                  {content}
                </button>
              </div>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map(day => (
            <div key={`next-${day}`} className="flex items-center justify-center p-1">
              <span className="text-xs font-semibold text-slate-300 select-none">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Legend status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-xs border border-amber-600/10" />
            <span className="text-slate-600">Arizada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-xs border border-emerald-600/10" />
            <span className="text-slate-600">Tasdiqlangan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-xs border border-rose-600/10" />
            <span className="text-slate-600">Qilinadigan ish (Boshlanadi)</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-brand-primary fill-brand-primary" />
            <span className="text-slate-600">Tugallangan</span>
          </div>
        </div>
      </section>

      {/* Accordions */}
      <section className="flex flex-col gap-3">
        {/* Arizadagi ishlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('arizalar')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-yellow-500 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {appliedJobs.length}
              </span>
              <span>Arizadagi ishlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'arizalar' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'arizalar' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {appliedJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Hozircha arizadagi ishlar mavjud emas.</p>
                  ) : (
                    appliedJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold text-[9px] px-2 py-0.5 rounded-full">
                          Yuborildi
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tasdiqlangan ishlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('tasdiqlangan')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-brand-secondary text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {confirmedJobs.length}
              </span>
              <span>Tasdiqlangan ishlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'tasdiqlangan' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'tasdiqlangan' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {confirmedJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Hozircha tasdiqlangan ishlar mavjud emas.</p>
                  ) : (
                    confirmedJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 border border-green-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Ish tasdiqlandi
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ish tafsilotlari/Hisobotlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('hisobotlar')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {todoJobs.length}
              </span>
              <span>Ish tafsilotlari/Hisobotlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'hisobotlar' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'hisobotlar' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {todoJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Hisobotlar mavjud emas.</p>
                  ) : (
                    todoJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-red-100 text-red-800 border border-red-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle size={10} />
                          Hujjat topshirish kerak
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tugallangan ishlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('tugallangan')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-brand-primary-container text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {completedJobs.length}
              </span>
              <span>Tugallangan ishlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'tugallangan' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'tugallangan' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {completedJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Tugallangan ishlar mavjud emas.</p>
                  ) : (
                    completedJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-current" />
                          Muvaffaqiyatli yakunlandi
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
