import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  setShowRegionSelector: (show: boolean) => void;
}

export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  filterLocation,
  setFilterLocation,
  filterType,
  setFilterType,
  setShowRegionSelector,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftBlur(container.scrollLeft > 10);
      setShowRightBlur(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();

      const observer = new ResizeObserver(() => {
        handleScroll();
      });
      observer.observe(container);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      if (filterLocation === 'Barchasi') {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const activeElement = activeRef.current;
        if (activeElement) {
          const containerWidth = container.clientWidth;
          const elementOffsetLeft = activeElement.offsetLeft;
          const elementWidth = activeElement.clientWidth;

          const scrollPosition = elementOffsetLeft - (containerWidth / 2) + (elementWidth / 2);
          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [filterLocation]);

  return (
    <section className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" size={20} />
        <input
          type="text"
          className="w-full bg-white hover:bg-slate-50/50 text-brand-text font-sans rounded-full py-3.5 pl-12 pr-4 shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] border-0 focus:bg-white focus:outline-none focus:ring-0 transition-all placeholder:text-brand-outline text-sm"
          placeholder="Kasb, kompaniya yoki kalit so'z..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="relative w-full">
        {/* Left blur fade */}
        <div className={`absolute left-0 top-0 bottom-1 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showLeftBlur ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Right blur fade */}
        <div className={`absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRightBlur ? 'opacity-100' : 'opacity-0'}`} />

         <div ref={scrollContainerRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full flex-nowrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap text-xs font-semibold cursor-pointer shrink-0 border-0 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 ${
              showFilters 
                ? 'bg-brand-primary text-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.35),_inset_0_1px_3px_rgba(0,0,0,0.15),_0_0_12px_rgba(26,35,126,0.3)]' 
                : 'bg-white text-brand-text-variant shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtrlar
          </button>

          {Array.from(new Set([
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
            filterLocation
          ])).map(loc => (
            <button
              key={loc}
              ref={filterLocation === loc ? activeRef : null}
              onClick={() => setFilterLocation(loc)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border-0 outline-none focus-outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 ${
                filterLocation === loc
                  ? 'bg-brand-primary text-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.35),_inset_0_1px_3px_rgba(0,0,0,0.15),_0_0_12px_rgba(26,35,126,0.3)]'
                  : 'bg-white text-brand-text-variant shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] hover:bg-slate-50'
              }`}
            >
              {loc === 'Barchasi' 
                ? 'Barcha hududlar' 
                : loc.replace(" viloyati", "").replace(" Respublikasi", "").replace(" tumani", "")}
            </button>
          ))}

          <button
            onClick={() => setShowRegionSelector(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-brand-text-variant shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] hover:bg-slate-50 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all border-0 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
          >
            <MapPin size={12} className="text-brand-primary" />
            <span>Boshqa hududlar...</span>
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 pt-3.5 flex flex-col gap-4"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 px-1">Ish grafigi</p>
              <div className="flex flex-wrap gap-2">
                {["Barchasi", "To'liq bandlik", "Smenali grafik", "Erkin grafik"].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border-0 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 active:scale-95 ${
                      filterType === type
                        ? 'bg-brand-primary text-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.35),_inset_0_1px_3px_rgba(0,0,0,0.15),_0_0_12px_rgba(26,35,126,0.3)]'
                        : 'bg-white text-brand-text-variant shadow-[inset_0_4px_8px_rgba(0,0,0,0.14),_inset_0_1px_3px_rgba(0,0,0,0.08),_0_0_12px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18),_0_0_16px_rgba(0,0,0,0.08)] hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setFilterLocation('Barchasi');
                  setFilterType('Barchasi');
                  setSearchTerm('');
                }}
                className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline cursor-pointer transition-colors duration-150"
              >
                Filtrlarni tozalash
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-[#000666] hover:bg-[#000666]/90 text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-[0_2px_4px_rgba(26,35,126,0.12)] hover:shadow-[0_4px_12px_rgba(26,35,126,0.22)] transition-all duration-150 active:scale-95"
              >
                Tayyor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
