import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Search, MapPin, ChevronRight, X } from 'lucide-react';
import { useUzbekistanGeoJson } from './map/useUzbekistanGeoJson';
import { UZBEKISTAN_REGIONS } from './mapConstants';
import { areDistrictNamesEqual } from './mapUtils';

interface RegionListItem {
  id: string;
  name: string;
  count: string;
  isTashkentCity?: boolean;
  isTashkentViloyat?: boolean;
}

const REGIONS_LIST: RegionListItem[] = [
  { id: "Toshkent", name: "Toshkent viloyati", count: "350+ bo'sh ish o'rni", isTashkentViloyat: true },
  { id: "Samarqand", name: "Samarqand viloyati", count: "1,200+ bo'sh ish o'rni" },
  { id: "Buxoro", name: "Buxoro viloyati", count: "450+ bo'sh ish o'rni" },
  { id: "Farg'ona", name: "Farg'ona viloyati", count: "600+ bo'sh ish o'rni" },
  { id: "Andijon", name: "Andijon viloyati", count: "500+ bo'sh ish o'rni" },
  { id: "Namangan", name: "Namangan viloyati", count: "400+ bo'sh ish o'rni" },
  { id: "Qashqadaryo", name: "Qashqadaryo viloyati", count: "300+ bo'sh ish o'rni" },
  { id: "Surxondaryo", name: "Surxondaryo viloyati", count: "180+ bo'sh ish o'rni" },
  { id: "Jizzax", name: "Jizzax viloyati", count: "150+ bo'sh ish o'rni" },
  { id: "Sirdaryo", name: "Sirdaryo viloyati", count: "120+ bo'sh ish o'rni" },
  { id: "Navoiy", name: "Navoiy viloyati", count: "140+ bo'sh ish o'rni" },
  { id: "Xorazm", name: "Xorazm viloyati", count: "210+ bo'sh ish o'rni" },
  { id: "Qoraqalpog'iston", name: "Qoraqalpog'iston Respublikasi", count: "250+ bo'sh ish o'rni" }
];

const TASHKENT_CITY_DISTRICTS = [
  "Yunusobod tumani", "Chilonzor tumani", "Bektemir tumani", "Mirzo Ulug'bek tumani", 
  "Mirobod tumani", "Yashnobod tumani", "Shayxontohur tumani", "Uchtepa tumani", 
  "Yakkasaroy tumani", "Olmazor tumani", "Sergeli tumani", "Yangihayot tumani"
];

const TASHKENT_VILOYATI_DISTRICTS = [
  "Chinoz tumani", "Quyi Chirchiq tumani", "Yangiyo'l tumani", "Oqqorg'on tumani", 
  "Bo'ka tumani", "Piskent tumani", "O'rtachirchiq tumani", "Parkent tumani", 
  "Bo'stonliq tumani", "Qibray tumani", "Ohangaron tumani", "Zangiota tumani"
];

export const RegionSelector: React.FC = () => {
  const { 
    showRegionSelector, 
    setShowRegionSelector, 
    setFilterLocation,
    setCurrentScreen
  } = useApp();

  const { districtsGeoJsonData } = useUzbekistanGeoJson();

  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionListItem | null>(null);

  // Filter Level 1 Regions
  const filteredRegions = useMemo(() => {
    return REGIONS_LIST.filter(r => 
      r.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  // Dynamic District List for the Selected Region
  const selectedRegionDistricts = useMemo(() => {
    if (!selectedRegion || !districtsGeoJsonData) return [];

    let rawDistricts: string[] = [];

    if (selectedRegion.isTashkentCity) {
      // Filter Tashkent city districts from Tashkent geojson
      const features = districtsGeoJsonData.features.filter((f: any) => 
        f.properties && 
        f.properties.regionId === "Toshkent" &&
        TASHKENT_CITY_DISTRICTS.some(d => areDistrictNamesEqual(d, f.properties.shapeName))
      );
      rawDistricts = features.map((f: any) => f.properties.shapeName);
    } else if (selectedRegion.isTashkentViloyat) {
      // Filter Tashkent viloyat districts from Tashkent geojson
      const features = districtsGeoJsonData.features.filter((f: any) => 
        f.properties && 
        f.properties.regionId === "Toshkent" &&
        TASHKENT_VILOYATI_DISTRICTS.some(d => areDistrictNamesEqual(d, f.properties.shapeName))
      );
      rawDistricts = features.map((f: any) => f.properties.shapeName);
    } else {
      // Standard region filter
      const features = districtsGeoJsonData.features.filter((f: any) => 
        f.properties && f.properties.regionId === selectedRegion.id
      );
      rawDistricts = features.map((f: any) => f.properties.shapeName);
    }

    // Sort alphabetically
    return Array.from(new Set(rawDistricts)).sort((a, b) => a.localeCompare(b));
  }, [selectedRegion, districtsGeoJsonData]);

  // Filtered list of districts when searching inside a selected region
  const filteredDistricts = useMemo(() => {
    return selectedRegionDistricts.filter(d => 
      d.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [selectedRegionDistricts, searchText]);

  // Global search matching both regions and all districts
  const searchResults = useMemo(() => {
    if (!searchText) return [];
    const term = searchText.toLowerCase();

    const matches: { isRegion: boolean; name: string; subtitle?: string; value: string }[] = [];

    // Match regions first
    REGIONS_LIST.forEach(r => {
      if (r.name.toLowerCase().includes(term)) {
        matches.push({
          isRegion: true,
          name: r.name,
          subtitle: "Viloyat",
          value: r.name
        });
      }
    });

    // Match nested Toshkent shahri
    if ("toshkent shahri".includes(term)) {
      matches.push({
        isRegion: true,
        name: "Toshkent shahri",
        subtitle: "Toshkent viloyati tarkibida (Poytaxt)",
        value: "Toshkent shahri"
      });
    }

    // Match districts dynamically from GeoJSON
    if (districtsGeoJsonData) {
      districtsGeoJsonData.features.forEach((f: any) => {
        const shapeName = f.properties?.shapeName || "";
        const regionId = f.properties?.regionId || "";
        
        if (shapeName.toLowerCase().includes(term)) {
          let parentRegion = "";
          if (regionId === "Toshkent") {
            const isCity = TASHKENT_CITY_DISTRICTS.some(d => areDistrictNamesEqual(d, shapeName));
            parentRegion = isCity ? "Toshkent shahri" : "Toshkent viloyati";
          } else {
            const r = REGIONS_LIST.find(reg => reg.id === regionId);
            parentRegion = r ? r.name : "";
          }

          matches.push({
            isRegion: false,
            name: shapeName,
            subtitle: parentRegion,
            value: shapeName
          });
        }
      });
    }

    // Deduplicate matches by name
    const seen = new Set();
    return matches.filter(m => {
      const key = m.name + '|' + m.subtitle;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [searchText, districtsGeoJsonData]);

  if (!showRegionSelector) return null;

  const handleItemClick = (locationName: string) => {
    setFilterLocation(locationName);
    setShowRegionSelector(false);
    setSearchText('');
    setSelectedRegion(null);
  };

  const handleRegionClick = (region: RegionListItem) => {
    setSelectedRegion(region);
    setSearchText(''); // Clear search text for the next level
  };

  const handleBackClick = () => {
    if (selectedRegion) {
      if (selectedRegion.isTashkentCity) {
        // Go back to Toshkent Viloyati instead of root
        const tashkentViloyatItem = REGIONS_LIST.find(r => r.id === "Toshkent");
        setSelectedRegion(tashkentViloyatItem || null);
      } else {
        setSelectedRegion(null);
      }
      setSearchText('');
    } else {
      setShowRegionSelector(false);
    }
  };

  return (
    <div id="region-selector-modal" className="fixed inset-0 z-[10000] bg-brand-background text-brand-text flex flex-col min-h-screen">
      {/* TopAppBar Component */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex justify-between items-center px-4 h-16 max-w-full">
        <button 
          id="btn-back-region"
          onClick={handleBackClick}
          aria-label="Back" 
          className="text-brand-text-variant hover:bg-brand-surface-low transition-colors active:opacity-80 p-2 rounded-full flex items-center justify-center cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
          type="button"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-display text-lg font-bold text-brand-primary truncate mx-4 flex-1 text-center">
          {selectedRegion ? selectedRegion.name : "Hududni tanlang"}
        </h1>
        <div className="w-10"></div> {/* Balance spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 px-4 py-4 overflow-y-auto max-w-xl mx-auto w-full">
        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-outline">
            <Search size={18} />
          </div>
          <input 
            id="region-search-input"
            className="block w-full pl-10 pr-10 py-3.5 border-0 rounded-xl bg-white hover:bg-slate-50 text-sm font-sans text-brand-text placeholder:text-brand-outline shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 transition-all" 
            placeholder={selectedRegion ? "Tumanni qidirish..." : "Viloyat yoki tuman nomini kiriting..."} 
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              id="btn-clear-search"
              onClick={() => setSearchText('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-outline hover:text-brand-text cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dynamic Display Logic */}
        <div className="grid grid-cols-1 gap-2.5 pb-20">
          {/* 1. Global Search results when text is entered & no region selected */}
          {!selectedRegion && searchText ? (
            searchResults.length > 0 ? (
              searchResults.map((match, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleItemClick(match.value)}
                  className="w-full bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center group text-left cursor-pointer active:scale-99 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
                >
                  <div className={`p-2.5 rounded-full mr-4 group-hover:scale-110 transition-transform flex items-center justify-center ${
                    match.isRegion ? 'bg-brand-primary text-white shadow-xs' : 'bg-brand-surface-low text-brand-text-variant'
                  }`}>
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm text-brand-text">
                      {match.name}
                    </h3>
                    {match.subtitle && (
                      <p className="text-[10px] text-brand-text-variant mt-0.5 font-medium leading-normal">
                        {match.subtitle}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-brand-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-brand-text-variant text-xs font-semibold">
                Hech qanday hudud topilmadi
              </div>
            )
          ) : selectedRegion ? (
            /* 2. Selected Region's Districts list (including entire region filter option) */
            <>
              {/* Option to select entire region */}
              <button 
                onClick={() => handleItemClick(selectedRegion.name)}
                className="w-full bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 p-4 rounded-xl shadow-xs transition-all flex items-center group text-left cursor-pointer active:scale-99 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
              >
                <div className="p-2.5 rounded-full mr-4 bg-brand-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm text-brand-primary">
                    Barcha tumanlar ({selectedRegion.name.replace(" viloyati", "").replace(" Respublikasi", "")})
                  </h3>
                  <p className="text-[10px] text-brand-primary/80 mt-0.5 font-medium leading-normal">
                    Butun viloyat bo'yicha qidirish
                  </p>
                </div>
                <ChevronRight size={18} className="text-brand-primary/80" />
              </button>

              {/* Option to select Toshkent shahri if in Toshkent Viloyati */}
              {selectedRegion.isTashkentViloyat && (
                <button 
                  onClick={() => {
                    const tashkentCityItem = { id: "Toshkent_shahri", name: "Toshkent shahri", count: "Poytaxt, 4,500+ bo'sh ish o'rni", isTashkentCity: true };
                    setSelectedRegion(tashkentCityItem);
                  }}
                  className="w-full bg-amber-50/50 hover:bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-xs transition-all flex items-center group text-left cursor-pointer active:scale-99 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
                >
                  <div className="p-2.5 rounded-full mr-4 bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm text-amber-800">
                      Toshkent shahri
                    </h3>
                    <p className="text-[10px] text-amber-700 mt-0.5 font-medium leading-normal">
                      Poytaxt, 4,500+ bo'sh ish o'rni (12 ta tuman)
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-amber-700" />
                </button>
              )}

              {/* Individual districts */}
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((districtName, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleItemClick(districtName)}
                    className="w-full bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center group text-left cursor-pointer active:scale-99 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
                  >
                    <div className="p-2.5 rounded-full mr-4 bg-brand-surface-low text-brand-text-variant group-hover:scale-110 transition-transform flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm text-brand-text">
                        {districtName}
                      </h3>
                      <p className="text-[10px] text-brand-text-variant mt-0.5 font-medium leading-normal">
                        Bo'sh ish o'rinlarini ko'rish
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-brand-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-brand-text-variant text-xs font-semibold">
                  Hech qanday tuman topilmadi
                </div>
              )}
            </>
          ) : (
            /* 3. Base level: List of all 13 regions of Uzbekistan + "Butun O'zbekiston bo'yicha" at the very top */
            <>
              {/* Option to select entire Uzbekistan */}
              <button 
                onClick={() => handleItemClick("Barchasi")}
                className="w-full bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 p-4 rounded-xl shadow-xs transition-all flex items-center group text-left cursor-pointer active:scale-99 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
              >
                <div className="p-2.5 rounded-full mr-4 bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm text-emerald-700">
                    O'zbekiston bo'yicha
                  </h3>
                  <p className="text-[10px] text-emerald-600 mt-0.5 font-medium leading-normal">
                    Barcha bo'sh ish o'rinlari
                  </p>
                </div>
                <ChevronRight size={18} className="text-emerald-700/80" />
              </button>

              {/* Individual Viloyats */}
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <button 
                    key={region.id}
                    onClick={() => handleRegionClick(region)}
                    className="w-full bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center group text-left cursor-pointer active:scale-99 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20"
                  >
                    <div className="p-2.5 rounded-full mr-4 bg-brand-surface-low text-brand-text-variant group-hover:scale-110 transition-transform flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm text-brand-text">
                        {region.name}
                      </h3>
                      {region.count && (
                        <p className="text-[10px] text-brand-text-variant mt-0.5 font-medium leading-normal">
                          {region.count}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-brand-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-brand-text-variant text-xs font-semibold">
                  Hech qanday viloyat topilmadi
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
