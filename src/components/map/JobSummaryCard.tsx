import React, { useState } from 'react';
import { Briefcase, MapPin, Navigation, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../../types';
import { getLatLng, calculateDistance } from '../mapUtils';
import { MapActionButtons } from './MapActionButtons';

interface JobSummaryCardProps {
  isPanelExpanded: boolean;
  setIsPanelExpanded: (expanded: boolean) => void;
  activeCluster: 'all' | 'cluster1' | 'cluster2';
  displayedJobs: Job[];
  selectedJob: Job | null;
  handleJobSelect: (job: Job) => void;
  toggleBookmark: (id: string) => void;
  userLocation: { lat: number; lng: number } | null;
  filterLocation: string;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleResetMap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const JobSummaryCard: React.FC<JobSummaryCardProps> = ({
  isPanelExpanded,
  setIsPanelExpanded,
  activeCluster,
  displayedJobs,
  selectedJob,
  handleJobSelect,
  toggleBookmark,
  userLocation,
  filterLocation,
  isRefreshing,
  handleRefresh,
  handleResetMap,
  onZoomIn,
  onZoomOut,
}) => {
  const [isAtBeginning, setIsAtBeginning] = useState(true);

  return (
    <div 
      className={`absolute bottom-0 left-0 w-full z-20 transition-transform duration-300 ease-in-out ${
        isPanelExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-64px)]'
      }`}
    >
      <MapActionButtons 
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        handleResetMap={handleResetMap}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
      />

      <div 
        onClick={() => {
          if (!isPanelExpanded) {
            setIsPanelExpanded(true);
          }
        }}
        className="bg-white rounded-t-[28px] shadow-[0_-8px_32px_rgba(0,0,0,0.20),_0_-4px_16px_rgba(0,0,0,0.12)] pb-3 cursor-pointer"
      >
        {/* Unified Toggleable Header Area */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsPanelExpanded(!isPanelExpanded);
          }}
          className="cursor-pointer select-none pt-3 pb-2 w-full"
        >
          {/* Bottom Sheet Drag Handle */}
          <div className="flex justify-center mb-1.5">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Result Count */}
          <div className="text-center">
            <p className="text-xs font-bold text-brand-text-variant">
              {displayedJobs.length === 0 ? (
                filterLocation === 'Barchasi'
                  ? "O'zbekiston bo'yicha ishlar topilmadi"
                  : `${filterLocation} bo'yicha ishlar topilmadi`
              ) : (
                filterLocation === 'Barchasi'
                  ? `O'zbekiston bo'yicha ${displayedJobs.length} ta ish topildi`
                  : `${filterLocation} bo'yicha ${displayedJobs.length} ta ish topildi`
              )}
            </p>
            {!isPanelExpanded && displayedJobs.length > 0 && (
              <p className="text-[9px] text-brand-primary font-bold mt-0.5 animate-pulse">
                Ro'yxatni ochish uchun bosing
              </p>
            )}
          </div>
        </div>

        {/* Horizontal scrollable Job Cards List with blur overlays */}
        <div className="relative w-full overflow-hidden">
          {displayedJobs.length === 0 ? (
            <div className="px-6 py-6 pb-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                <Briefcase size={24} className="stroke-[1.5] text-indigo-500/85" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Hozircha bo'sh ish o'rinlari mavjud emas
              </h4>
              <p className="text-[11px] text-slate-500 max-w-[280px] mt-1.5 leading-normal">
                Afsuski, ushbu hududda hozircha birorta ham e'lon joylashtirilmagan. Boshqa viloyat yoki tumanlarni tanlab ko'ring.
              </p>
            </div>
          ) : (
            <>
              {/* Left blur fade overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/75 to-transparent pointer-events-none z-10" />
              
              {/* Right blur fade overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white/75 to-transparent pointer-events-none z-10" />

              <div 
                onScroll={(e) => {
                  const target = e.currentTarget;
                  setIsAtBeginning(target.scrollLeft < 10);
                }}
                className="px-7 pt-3 pb-2.5 overflow-x-auto no-scrollbar flex gap-4 snap-x snap-mandatory scroll-smooth w-full"
              >
                {displayedJobs.map(job => {
                  const jobLatLng = getLatLng(job);
                  const shouldAnimate = isAtBeginning && displayedJobs.length >= 2;
                  return (
                    <motion.div
                      key={job.id}
                      onClick={() => handleJobSelect(job)}
                      animate={shouldAnimate ? {
                        x: [0, -24, 0]
                      } : {
                        x: 0
                      }}
                      transition={shouldAnimate ? {
                        duration: 0.8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 4.2
                      } : {
                        duration: 0.2
                      }}
                      className={`snap-center shrink-0 min-w-[calc(100vw-64px)] max-w-[calc(100vw-64px)] sm:min-w-[322px] sm:max-w-[322px] p-4 rounded-2xl flex flex-col gap-1.5 relative transition-all duration-300 cursor-pointer border border-slate-100/60 shadow-[0_0_20px_rgba(0,0,0,0.12),_0_4px_12px_rgba(0,0,0,0.06)] ${
                        selectedJob?.id === job.id
                          ? 'bg-brand-primary/5 ring-2 ring-brand-primary/40 translate-y-[-4px] shadow-[0_0_24px_rgba(0,0,0,0.22)]'
                          : 'bg-white hover:shadow-[0_0_28px_rgba(0,0,0,0.22),_0_4px_16px_rgba(0,0,0,0.10)] hover:translate-y-[-4px]'
                      } active:translate-y-[1px]`}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 shadow-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-100/90">
                          {job.logoUrl ? (
                            <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase size={18} className="text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 pr-6 flex-1">
                          <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
                            {job.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      <div className="mt-0.5 flex flex-col">
                        <p className="font-sans font-bold text-slate-900 text-[16px] leading-tight">
                          {job.salary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-slate-100/70 text-slate-500 text-[10px] font-semibold rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {userLocation && (
                          <span className="px-2 py-0.5 bg-blue-50/70 text-blue-600 text-[10px] font-semibold rounded flex items-center gap-1">
                            <Navigation size={8} className="rotate-45 fill-blue-600/20" />
                            {calculateDistance(userLocation.lat, userLocation.lng, jobLatLng.lat, jobLatLng.lng).toFixed(1)} km
                          </span>
                        )}
                      </div>

                      <div className="h-[1px] bg-slate-100 w-full my-2" />

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
                            <Clock size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">{job.periodText || "2026-07-09 11:52~19:52"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
                            <MapPin size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-brand-primary shrink-0 self-end mb-0.5">
                          {job.durationLabel || "12 soat"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
