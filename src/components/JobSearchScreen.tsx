import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { 
  Briefcase, 
  Loader2, 
  ArrowUpDown, 
  Heart, 
  MapPin, 
  Calendar, 
  Timer, 
  DollarSign, 
  Zap, 
  Truck, 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  ExternalLink, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Clock
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { areDistrictNamesEqual } from './mapUtils';
import { SearchFilterSection } from './search/SearchFilterSection';
import { JobCardItem } from './search/JobCardItem';
import { JobSearchModalDetail, getJobHeroImage, getJobDetails } from './search/JobSearchModalDetail';
import { MapViewCallout } from './search/MapViewCallout';

const REGIONS_LIST = [
  'Barchasi', 
  'Toshkent', 
  'Samarqand', 
  'Buxoro', 
  'Andijon', 
  'Farg\'ona', 
  'Namangan', 
  'Jizzax', 
  'Sirdaryo', 
  'Qashqadaryo', 
  'Surxondaryo', 
  'Navoiy', 
  'Xorazm', 
  'Qoraqalpog\'iston',
];

export const JobSearchScreen: React.FC = () => {
  const { 
    jobs, 
    toggleBookmark, 
    applyToJob,
    filterLocation,
    setFilterLocation,
    setShowRegionSelector,
    setCurrentScreen,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Barchasi');
  const [sortBy, setSortBy] = useState<'yangilari' | 'maosh'>('yangilari');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 5);
      setIsLoadingMore(false);
    }, 700);
  };

  // Reset pagination to 10 when filters or sort change
  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, filterLocation, filterType, sortBy]);

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filterLocation === 'Barchasi' ||
      job.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
      areDistrictNamesEqual(job.location, filterLocation);

    const matchesType =
      filterType === 'Barchasi' ||
      job.tags.some(tag => tag.toLowerCase() === filterType.toLowerCase());

    return matchesSearch && matchesLocation && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'maosh') {
      const aVal = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
      const bVal = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
      return bVal - aVal;
    }
    return 0; // Default sorting (chronological)
  });

  // Default active job for desktop layout
  const activeDesktopJob = selectedJob || sortedJobs[0] || null;
  const desktopJobDetails = activeDesktopJob ? getJobDetails(activeDesktopJob.title) : null;

  return (
    <div className="flex flex-col gap-5 pb-20 pt-16 md:pt-4">
      {/* 1. MOBILE ONLY VIEW */}
      <div className="flex flex-col gap-5 md:hidden">
        {/* Search & Filter Section */}
        <SearchFilterSection 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterType={filterType}
          setFilterType={setFilterType}
          setShowRegionSelector={setShowRegionSelector}
        />

        {/* Results Summary */}
        <div className="flex justify-between items-center px-1 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] md:text-xs font-semibold text-slate-500">
              {filterLocation === 'Barchasi' ? "O'zbekiston:" : `${filterLocation.replace(" viloyati", "").replace(" Respublikasi", "").replace(" tumani", "")}:`}
            </span>
            <span className="bg-brand-primary/10 text-brand-primary text-[10px] md:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-[inset_0_1px_2px_rgba(26,35,126,0.06)]">
              {filteredJobs.length} ta bo'sh ish
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-1.5 bg-white text-brand-text-variant shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] hover:bg-slate-50 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 border-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
            >
              <ArrowUpDown size={12} className={`transition-colors duration-200 ${isSortDropdownOpen ? 'text-brand-primary' : 'text-slate-400'}`} />
              <span>{sortBy === 'yangilari' ? "Eng yangilari" : "Maksimal maosh"}</span>
            </button>

            <AnimatePresence>
              {isSortDropdownOpen && (
                <>
                  {/* Invisible backdrop to dismiss dropdown on click */}
                  <div 
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setIsSortDropdownOpen(false)}
                  />
                  
                  {/* Animated dropdown list */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-44 bg-white border border-slate-100/80 rounded-2xl shadow-[0_10px_30px_rgba(26,35,126,0.12),_0_4px_12px_rgba(0,0,0,0.04)] z-40 py-1.5 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setSortBy('yangilari');
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        sortBy === 'yangilari' 
                          ? 'text-brand-primary bg-brand-primary/5' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>Eng yangilari</span>
                      {sortBy === 'yangilari' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('maosh');
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        sortBy === 'maosh' 
                          ? 'text-brand-primary bg-brand-primary/5' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>Maksimal maosh</span>
                      {sortBy === 'maosh' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                      )}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedJobs.slice(0, visibleCount).map((job, idx) => (
            <JobCardItem 
              key={job.id}
              job={job}
              idx={idx}
              onClick={() => setSelectedJob(job)}
              toggleBookmark={toggleBookmark}
            />
          ))}

          {sortedJobs.length === 0 && (
            <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300">
              <Briefcase size={36} className="mx-auto text-slate-300 mb-2.5" />
              <p className="font-sans font-bold text-slate-700 text-sm">Mos keladigan ish o'rinlari topilmadi</p>
              <p className="text-slate-400 text-xs mt-1">Filtr parametrlarini o'zgartirib ko'ring.</p>
            </div>
          )}

          {/* Map View Bento-style Callout */}
          <MapViewCallout setCurrentScreen={setCurrentScreen} />
        </div>

        {/* Pagination / Load More */}
        {visibleCount < sortedJobs.length && (
          <div className="flex justify-center mt-6 min-h-12 items-center">
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-white border-2 border-brand-primary text-brand-primary font-bold py-3 px-8 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),_0_4px_12px_rgba(26,35,126,0.08)] hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),_0_8px_16px_rgba(26,35,126,0.15)] hover:bg-slate-50 active:scale-95 transition-all duration-200 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yana ko'rsatish
            </button>
          </div>
        )}
      </div>

      {/* 2. DESKTOP ADAPTED split web-layout (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Sidebar (col-span-3) */}
        <aside className="col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6 sticky top-20">
          <div>
            <h3 className="font-display font-bold text-sm text-brand-primary uppercase tracking-wider mb-3">Kasb qidirish</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                className="w-full bg-slate-50 hover:bg-slate-100/70 text-xs font-sans rounded-xl py-2.5 pl-9 pr-3 border border-transparent focus:border-brand-primary/30 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="Kalit so'z kiriting..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* Hududlar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-sm text-brand-primary uppercase tracking-wider">Hududlar</h3>
              <button 
                onClick={() => setShowRegionSelector(true)}
                className="text-[11px] text-brand-primary font-bold hover:underline cursor-pointer"
              >
                Barchasi...
              </button>
            </div>
            <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1 no-scrollbar border border-slate-50 p-2 rounded-xl bg-slate-50/50">
              {REGIONS_LIST.map(loc => (
                <button
                  key={loc}
                  onClick={() => setFilterLocation(loc)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    filterLocation === loc
                      ? 'bg-[#000666] text-white shadow-[0_4px_12px_rgba(26,35,126,0.15)]'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs'
                  }`}
                >
                  <span className="truncate">
                    {loc === 'Barchasi' ? 'Barcha hududlar' : loc}
                  </span>
                  {filterLocation === loc && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* Ish grafigi */}
          <div>
            <h3 className="font-display font-bold text-sm text-brand-primary uppercase tracking-wider mb-3">Ish grafigi</h3>
            <div className="flex flex-col gap-1.5">
              {["Barchasi", "To'liq bandlik", "Smenali grafik", "Erkin grafik"].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    filterType === type
                      ? 'bg-[#000666] text-white shadow-[0_4px_12px_rgba(26,35,126,0.15)]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{type}</span>
                  {filterType === type && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* Saralash */}
          <div>
            <h3 className="font-display font-bold text-sm text-brand-primary uppercase tracking-wider mb-3">Saralash</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('yangilari')}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  sortBy === 'yangilari'
                    ? 'bg-[#000666] text-white shadow-[0_4px_12px_rgba(26,35,126,0.15)]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Yangilari
              </button>
              <button
                onClick={() => setSortBy('maosh')}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  sortBy === 'maosh'
                    ? 'bg-[#000666] text-white shadow-[0_4px_12px_rgba(26,35,126,0.15)]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Maksimal maosh
              </button>
            </div>
          </div>

          {(searchTerm || filterLocation !== 'Barchasi' || filterType !== 'Barchasi') && (
            <>
              <div className="h-[1px] bg-slate-100" />
              <button
                onClick={() => {
                  setFilterLocation('Barchasi');
                  setFilterType('Barchasi');
                  setSearchTerm('');
                }}
                className="w-full text-center py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
              >
                Filtrlarni tozalash
              </button>
            </>
          )}
        </aside>

        {/* Middle Column: Scrollable Job Cards List (col-span-4) */}
        <section className="col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 no-scrollbar">
          <div className="flex justify-between items-center sticky top-0 bg-brand-background/95 backdrop-blur-md py-2 z-10">
            <h2 className="font-display font-extrabold text-sm text-slate-800">
              {filterLocation === 'Barchasi' ? "O'zbekiston:" : `${filterLocation}:`} <span className="text-brand-primary">{filteredJobs.length} ta vakansiya</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            {sortedJobs.slice(0, visibleCount).map((job, idx) => (
              <JobCardItem 
                key={job.id}
                job={job}
                idx={idx}
                isActive={activeDesktopJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
                toggleBookmark={toggleBookmark}
              />
            ))}

            {sortedJobs.length === 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300">
                <Briefcase size={36} className="mx-auto text-slate-300 mb-2.5" />
                <p className="font-sans font-bold text-slate-700 text-sm">Mos keladigan ishlar topilmadi</p>
                <p className="text-slate-400 text-xs mt-1">Boshqa hudud yoki filtrni ko'rib chiqing.</p>
              </div>
            )}

            {/* Map View Bento-style Callout */}
            <MapViewCallout setCurrentScreen={setCurrentScreen} />
          </div>

          {/* Pagination / Load More in Middle List */}
          {visibleCount < sortedJobs.length && (
            <div className="flex justify-center my-4">
              <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-white border border-brand-primary text-brand-primary font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 text-xs transition-all cursor-pointer"
              >
                Yana yuklash
              </button>
            </div>
          )}
        </section>

        {/* Right Column: Dynamic Job Details Panel (col-span-5) */}
        <section className="col-span-5 bg-white border border-slate-100/90 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sticky top-20 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {activeDesktopJob ? (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 shadow-xs">
                    {activeDesktopJob.logoUrl ? (
                      <img src={activeDesktopJob.logoUrl} alt={activeDesktopJob.company} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Briefcase size={22} className="text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-sans font-extrabold text-base text-[#000666] leading-tight truncate">{activeDesktopJob.title}</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-0.5 truncate">{activeDesktopJob.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleBookmark(activeDesktopJob.id)}
                  className="p-2 rounded-full hover:bg-slate-50 text-brand-primary transition-all duration-200 cursor-pointer shrink-0"
                >
                  <Heart size={20} className={activeDesktopJob.bookmarked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                </button>
              </div>

              {/* Hero Image */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shrink-0 shadow-xs">
                <img className="w-full h-full object-cover" src={getJobHeroImage(activeDesktopJob)} alt={activeDesktopJob.title} />
                <div className="absolute top-3 left-3 bg-[#ba1a1a] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Clock size={11} className="stroke-[2.5]" />
                  <span className="text-[10px] font-bold tracking-tight">{activeDesktopJob.durationLabel || "1 kunlik"} qoldi</span>
                </div>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <Calendar size={13} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider">Sana</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#000666]">
                    {activeDesktopJob.periodText ? activeDesktopJob.periodText.split(' ')[0] : 'Bugun'}
                  </p>
                </div>
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <Timer size={13} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider">Vaqt</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#000666] truncate">
                    {activeDesktopJob.periodText ? activeDesktopJob.periodText.split(' ').slice(1).join(' ') || "08:00~17:00" : "08:00~17:00"}
                  </p>
                </div>
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <DollarSign size={13} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider">Maosh</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#000666] truncate">{activeDesktopJob.salary}</p>
                </div>
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <Zap size={13} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider">Soatlik</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#000666]">
                    {activeDesktopJob.hourlyRate && activeDesktopJob.hourlyRate !== "Yo'q" ? `${activeDesktopJob.hourlyRate} so'm` : "25 000 so'm"}
                  </p>
                </div>
              </div>

              {/* Transport */}
              <div className="flex items-center justify-between p-3 bg-[#000666]/5 rounded-xl border border-[#000666]/5">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#000666]" />
                  <span className="text-[11px] font-medium text-slate-700">Transport xarajatlari</span>
                </div>
                <span className="text-[11px] font-bold text-[#000666]">
                  {activeDesktopJob.transportRate && activeDesktopJob.transportRate !== "Yo'q" && !activeDesktopJob.transportRate.includes('xarajat')
                    ? (activeDesktopJob.transportRate.includes('so\'m') || activeDesktopJob.transportRate.includes('Yotoq') || activeDesktopJob.transportRate.includes('Bepul') ? activeDesktopJob.transportRate : `${activeDesktopJob.transportRate} so'm`)
                    : activeDesktopJob.transportRate || "15 000 so'm"}
                </span>
              </div>

              {/* Manzil */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-[#000666]">Manzil</h4>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(activeDesktopJob.location)}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5">
                    Xaritada ko'rish <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 leading-snug">{activeDesktopJob.location}</p>
              </div>

              {/* Tasks */}
              {desktopJobDetails && (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-[#000666] mb-2 flex items-center gap-1">
                      <ClipboardList size={13} /> Ish vazifalari
                    </h4>
                    <div className="space-y-1.5">
                      {desktopJobDetails.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-100/50 transition-colors">
                          <span className="w-5 h-5 rounded-full bg-[#000666] text-white flex items-center justify-center text-[9px] font-bold shrink-0">{idx + 1}</span>
                          <p className="text-[11px] text-slate-700 font-medium leading-tight">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-xs font-bold text-[#000666] mb-1.5 flex items-center gap-1">
                      <CheckCircle size={13} className="text-emerald-600" /> Talablar va shartlar
                    </h4>
                    <ul className="space-y-1 pl-1">
                      {desktopJobDetails.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#000666] mt-1.5 shrink-0" />
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{req}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warning */}
                  <div className="bg-[#ffdf9e]/20 text-[#261a00] p-3 rounded-xl border border-[#ffdf9e]/40 flex gap-2 items-start">
                    <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-950 leading-relaxed font-medium">{desktopJobDetails.warning}</p>
                  </div>
                </>
              )}

              {/* Apply Button */}
              <button
                disabled={activeDesktopJob.applied}
                onClick={() => {
                  applyToJob(activeDesktopJob.id);
                  if (selectedJob && selectedJob.id === activeDesktopJob.id) {
                    setSelectedJob({ ...selectedJob, applied: true, status: 'applied' });
                  }
                }}
                className={`w-full text-white h-12 rounded-xl text-xs font-bold shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeDesktopJob.applied
                    ? 'bg-emerald-600 cursor-not-allowed opacity-90'
                    : 'bg-[#000666] hover:bg-[#000666]/90'
                }`}
              >
                <Send size={13} />
                {activeDesktopJob.applied ? "Ariza topshirilgan" : "Ariza topshirish"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <Briefcase size={40} className="text-slate-300 mb-2" />
              <p className="font-display font-bold text-sm">Ish tanlanmagan</p>
              <p className="text-xs mt-1">Batafsil ma'lumot olish uchun ro'yxatdan biror ishni tanlang.</p>
            </div>
          )}
        </section>
      </div>

      {/* High-Fidelity Loading Overlay */}
      {isLoadingMore && (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] flex flex-col items-center gap-3 border border-slate-100 scale-100 transform active:scale-100 transition-transform duration-200">
            <Loader2 className="animate-spin text-brand-primary" size={36} />
            <span className="text-brand-text font-display font-bold text-sm">Yangi ishlar yuklanmoqda...</span>
          </div>
        </div>
      )}

      {/* High-Fidelity Job Detail Modal Overlay - only visible/used on mobile */}
      <AnimatePresence>
        {selectedJob && (
          <div className="md:hidden">
            <JobSearchModalDetail 
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
              toggleBookmark={toggleBookmark}
              applyToJob={applyToJob}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
