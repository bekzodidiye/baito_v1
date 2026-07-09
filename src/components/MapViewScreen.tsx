import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Constants and Utilities
import { UZBEKISTAN_REGIONS } from './mapConstants';
import { areDistrictNamesEqual, isRegionName, getLatLng, isPointInFeature, LNG_OFFSET, LAT_OFFSET } from './mapUtils';

// Custom Hooks
import { useUzbekistanGeoJson } from './map/useUzbekistanGeoJson';
import { useMapSetup } from './map/useMapSetup';
import { useRegionPolygons } from './map/useRegionPolygons';
import { useJobMarkers } from './map/useJobMarkers';
import { useMapNavigation } from './map/useMapNavigation';
import { useUserGeolocation } from './map/useUserGeolocation';

// Modular UI Components
import { MapTypeSelector } from './map/MapTypeSelector';
import { MapBreadcrumbs } from './map/MapBreadcrumbs';
import { FloatingSearchBar } from './map/FloatingSearchBar';
import { JobSummaryCard } from './map/JobSummaryCard';
import { JobDetailModal } from './map/JobDetailModal';

export const MapViewScreen: React.FC = () => {
  const { 
    jobs, 
    toggleBookmark, 
    applyToJob,
    filterLocation,
    setFilterLocation,
    setShowRegionSelector,
    mapFocusedJobId,
    setMapFocusedJobId
  } = useApp();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeCluster, setActiveCluster] = useState<'all' | 'cluster1' | 'cluster2'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [mapType, setMapType] = useState<'xarita' | 'sputnik' | 'gibrid' | 'tungi' | 'relyef' | 'retro'>('xarita');
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationToast, setLocationToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  
  const lastFittedLocationRef = useRef<string>('Barchasi');

  // Load GeoJSON bounds
  const { geoJsonData, districtsGeoJsonData } = useUzbekistanGeoJson();

  // Helper smoothly pan map to coordinates
  const panToCoords = (lat: number, lng: number, zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], zoom, { animate: true, duration: 0.8 });
    }
  };

  // Setup Leaflet Map Instance
  const {
    mapContainerRef,
    mapInstanceRef,
    markerGroupRef,
    regionsGroupRef,
    zoomLevel,
  } = useMapSetup({
    isPanelExpanded,
    isViloyatDashboard: filterLocation !== 'Barchasi' && UZBEKISTAN_REGIONS.some(r => filterLocation.toLowerCase().includes(r.id.toLowerCase())),
    onMapClick: () => {
      setSelectedJob(null);
      setIsPanelExpanded(false);
    },
    mapType
  });

  // Breadcrumbs and Navigation Back Controller Hook
  const {
    selectedRegion,
    breadcrumbItems,
    handleBreadcrumbBack,
  } = useMapNavigation({
    filterLocation,
    setFilterLocation,
    districtsGeoJsonData,
    panToCoords,
  });

  // User Geolocation and Distance Calculator Hook
  const {
    userLocation,
    isLocating,
    distanceToSelectedJob,
    handleCalculateDistance,
  } = useUserGeolocation({
    selectedJob,
    mapInstanceRef,
  });

  const isViloyatDashboard = selectedRegion !== undefined && (
    filterLocation.toLowerCase().includes('viloyat') || 
    filterLocation.toLowerCase().includes('respublika') ||
    filterLocation === 'Toshkent viloyati' || 
    filterLocation === 'Toshkent shahri' ||
    UZBEKISTAN_REGIONS.some(r => r.id === filterLocation)
  );

  const cluster1Jobs = jobs.filter(j => j.location.includes('Yunusobod') || j.location.includes('Bektemir'));
  const cluster2Jobs = jobs.filter(j => j.location.includes('Chilonzor'));

  const getDisplayedJobs = (): Job[] => {
    let list = jobs;
    if (filterLocation === 'Barchasi') {
      if (activeCluster === 'cluster1') list = cluster1Jobs;
      else if (activeCluster === 'cluster2') list = cluster2Jobs;
    } else {
      const matchedRegion = UZBEKISTAN_REGIONS.find(r => 
        filterLocation.toLowerCase() === r.id.toLowerCase() ||
        filterLocation.toLowerCase() === r.name.toLowerCase() ||
        filterLocation.toLowerCase().includes(r.id.toLowerCase())
      );

      if (matchedRegion) {
        list = list.filter(j => 
          j.location.toLowerCase().includes(matchedRegion.id.toLowerCase()) ||
          j.location.toLowerCase().includes(matchedRegion.name.toLowerCase()) ||
          (matchedRegion.id === 'Toshkent' && j.location.toLowerCase().includes('toshkent'))
        );
      } else {
        list = list.filter(j => 
          j.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
          areDistrictNamesEqual(j.location, filterLocation)
        );
      }
    }
    return list;
  };

  // Handle active location filter fitting
  useEffect(() => {
    if (filterLocation === 'Barchasi') {
      setActiveCluster('all');
      panToCoords(41.2, 64.0, 5.1);
      setIsPanelExpanded(false);
      return;
    }

    setIsPanelExpanded(false);

    if (isRegionName(filterLocation)) {
      setActiveCluster('all');
    } else if (geoJsonData && districtsGeoJsonData) {
      const matchedDistrict = districtsGeoJsonData.features.find((f: any) => 
        f.properties && areDistrictNamesEqual(filterLocation, f.properties.shapeName || "")
      );
      
      if (matchedDistrict && matchedDistrict.properties && matchedDistrict.properties.regionId === 'Toshkent') {
        const districtName = matchedDistrict.properties.shapeName.toLowerCase();
        const isC1 = ['yunusabad', 'mirzo ulugbek', 'yashnobod', 'mirabad', 'bektemir'].some(name => districtName.includes(name));
        setActiveCluster(isC1 ? 'cluster1' : 'cluster2');
      } else {
        setActiveCluster('all');
      }
    }
  }, [filterLocation, geoJsonData, districtsGeoJsonData]);

  // Hook to draw Uzbekistan Regions & Districts Polygons on map
  useRegionPolygons({
    mapInstanceRef,
    regionsGroupRef,
    filterLocation,
    setFilterLocation,
    setIsPanelExpanded,
    geoJsonData,
    districtsGeoJsonData,
    zoomLevel,
    jobs,
    lastFittedLocationRef,
  });

  // Hook to render Job Markers & routing coordinates
  useJobMarkers({
    mapInstanceRef,
    markerGroupRef,
    activeCluster,
    jobs,
    selectedJob,
    setSelectedJob,
    userLocation,
    filterLocation,
    setIsPanelExpanded,
    getDisplayedJobs,
  });

  // Listen for map focusing request from other screens
  useEffect(() => {
    if (mapFocusedJobId) {
      const job = jobs.find(j => j.id === mapFocusedJobId);
      if (job) {
        setSelectedJob(null); // Ensure details modal starts closed as requested
        setIsPanelExpanded(false); // Keep bottom panel list closed
        
        // Extract district and set it as active location filter
        const district = job.location.includes(',') 
          ? job.location.split(',')[1].trim() 
          : job.location;
        setFilterLocation(district);

        // Smoothly pan to the coordinates
        const coords = getLatLng(job);
        setTimeout(() => {
          panToCoords(coords.lat, coords.lng, 15.0);
        }, 500); // Wait for district filter map render
      }
      setMapFocusedJobId(null);
    }
  }, [mapFocusedJobId, jobs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    const coords = getLatLng(job);
    panToCoords(coords.lat, coords.lng, 14.0);
    setIsPanelExpanded(true);
  };

  const handleLocationAction = () => {
    if (filterLocation !== 'Barchasi') {
      setActiveCluster('all');
      setSelectedJob(null);
      setFilterLocation('Barchasi');
      panToCoords(41.2, 64.0, 5.1);
      setIsPanelExpanded(false);
      return;
    }

    setIsLocatingUser(true);
    setLocationToast({ message: "Joylashuvingiz aniqlanmoqda...", type: 'info' });

    const processLocation = (lat: number, lng: number, isReal: boolean) => {
      // Apply offset to match shifted GeoJSON
      const shiftedLng = lng + LNG_OFFSET;
      const shiftedLat = lat + LAT_OFFSET;

      let foundDistrictName: string | null = null;

      if (districtsGeoJsonData && districtsGeoJsonData.features) {
        for (const feature of districtsGeoJsonData.features) {
          if (isPointInFeature(shiftedLng, shiftedLat, feature)) {
            foundDistrictName = feature.properties?.shapeName || null;
            break;
          }
        }
      }

      if (foundDistrictName) {
        setFilterLocation(foundDistrictName);
        setLocationToast({ 
          message: isReal 
            ? `Sizning joylashuvingiz: ${foundDistrictName}!` 
            : `Sizning joylashuvingiz aniqlandi (Demo: ${foundDistrictName})`, 
          type: 'success' 
        });
        setIsLocatingUser(false);
        setTimeout(() => setLocationToast(null), 3500);
      } else {
        const defaultDistrict = "Yunusobod tumani";
        setFilterLocation(defaultDistrict);
        setLocationToast({ 
          message: "O'zbekistondan tashqaridasiz. Namoyish uchun Yunusobod tumani tanlandi.", 
          type: 'info' 
        });
        setIsLocatingUser(false);
        setTimeout(() => setLocationToast(null), 4000);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          processLocation(pos.coords.latitude, pos.coords.longitude, true);
        },
        (error) => {
          console.warn("Geolocation error, using fallback:", error);
          processLocation(41.311081, 69.275, false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      processLocation(41.311081, 69.275, false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden h-[calc(100vh-56px-64px)] md:h-[calc(100vh-64px)] mt-14 md:mt-0 bg-slate-100">
      
      {/* Real Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ background: '#f5f5f5' }}
      />

      {filterLocation !== 'Barchasi' && (
        <>
          <MapBreadcrumbs 
            breadcrumbItems={breadcrumbItems} 
            handleBreadcrumbBack={handleBreadcrumbBack} 
          />
          <MapTypeSelector 
            mapType={mapType} 
            setMapType={setMapType} 
          />
        </>
      )}

      {filterLocation === 'Barchasi' && (
        <FloatingSearchBar setShowRegionSelector={setShowRegionSelector} />
      )}

      <JobSummaryCard 
        isPanelExpanded={isPanelExpanded}
        setIsPanelExpanded={setIsPanelExpanded}
        activeCluster={activeCluster}
        displayedJobs={getDisplayedJobs()}
        selectedJob={selectedJob}
        handleJobSelect={handleJobSelect}
        toggleBookmark={toggleBookmark}
        userLocation={userLocation}
        filterLocation={filterLocation}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        handleResetMap={handleLocationAction}
        onZoomIn={() => mapInstanceRef.current?.zoomIn()}
        onZoomOut={() => mapInstanceRef.current?.zoomOut()}
      />

      {/* Geolocation Toast Notice */}
      <AnimatePresence>
        {locationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex items-center gap-2.5 max-w-[90vw] sm:max-w-md bg-white border border-slate-100/80 pointer-events-auto"
          >
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              locationToast.type === 'success' ? 'bg-emerald-500 animate-pulse' :
              locationToast.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'
            }`} />
            <p className="text-xs font-bold text-slate-800 leading-snug">
              {locationToast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Overlay Modal Drawer */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailModal 
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            toggleBookmark={toggleBookmark}
            applyToJob={applyToJob}
            distanceToSelectedJob={distanceToSelectedJob}
            handleCalculateDistance={handleCalculateDistance}
            isLocating={isLocating}
            onOpenOnMap={() => {
              const district = selectedJob.location.includes(',') 
                ? selectedJob.location.split(',')[1].trim() 
                : selectedJob.location;
              setFilterLocation(district);
              const coords = getLatLng(selectedJob);
              panToCoords(coords.lat, coords.lng, 15.0);
              setSelectedJob(null);
              setIsPanelExpanded(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
