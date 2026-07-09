import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface FloatingSearchBarProps {
  setShowRegionSelector: (show: boolean) => void;
}

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  setShowRegionSelector,
}) => {
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto"
    >
      <div 
        onClick={() => setShowRegionSelector(true)}
        className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_0_24px_rgba(0,0,0,0.22),_0_4px_12px_rgba(0,0,0,0.10)] hover:bg-slate-50 hover:shadow-[0_0_28px_rgba(0,0,0,0.28)] transition-all cursor-pointer active:scale-98 select-none outline-none focus:outline-none border-0 ring-0"
      >
        <Search className="text-brand-outline" size={18} />
        <span className="text-xs text-brand-text font-semibold select-none">
          Viloyat, shahar yoki tuman...
        </span>
        <MapPin className="text-brand-primary ml-auto" size={18} />
      </div>
    </div>
  );
};
