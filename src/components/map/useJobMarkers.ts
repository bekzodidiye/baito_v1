import React, { useEffect } from 'react';
import L from 'leaflet';
import { Job } from '../../types';
import { getLatLng, calculateDistance } from '../mapUtils';

interface UseJobMarkersProps {
  mapInstanceRef: React.MutableRefObject<L.Map | null>;
  markerGroupRef: React.MutableRefObject<L.LayerGroup | null>;
  activeCluster: 'all' | 'cluster1' | 'cluster2';
  jobs: Job[];
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  userLocation: { lat: number; lng: number } | null;
  filterLocation: string;
  setIsPanelExpanded: (expanded: boolean) => void;
  getDisplayedJobs: () => Job[];
}

export const useJobMarkers = ({
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
}: UseJobMarkersProps) => {
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markerGroupRef.current;
    if (!map || !group) return;

    // Reset previous layer elements
    group.clearLayers();

    if (filterLocation === 'Barchasi') {
      // If no specific region/district is selected, do not render job pins on the map
      return;
    }

    const displayedJobs = getDisplayedJobs();

    // Render individual jobs inside the filtered zone (Highly compact, elegant pins)
    displayedJobs.forEach(job => {
      const coords = getLatLng(job);
      const isSelected = selectedJob?.id === job.id;

      const logoHtml = job.logoUrl
        ? `<img src="${job.logoUrl}" alt="${job.company}" class="marker-logo-img" />`
        : `<div class="marker-logo-placeholder bg-slate-100 text-[#767683]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>`;

      const jobHtml = `
        <div class="flex flex-col items-center justify-center cursor-pointer select-none" style="width: 50px; height: 44px;">
          <div class="relative flex items-center justify-center rounded-full border-2 bg-white shadow-sm transition-all duration-300 ${
            isSelected ? 'border-[#000666] scale-110 z-30 shadow-md' : 'border-[#c6c5d4] hover:scale-105 z-20'
          }" style="width: 30px !important; height: 30px !important;">
            ${logoHtml}
            <div class="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] ${
              isSelected ? 'border-t-[#000666]' : 'border-t-white'
            }"></div>
          </div>
          <div class="mt-0.5 bg-[#1a1c1c] text-white text-[7px] font-bold px-1 py-0.5 rounded shadow-xs max-w-[48px] truncate text-center leading-none">
            ${job.title}
          </div>
        </div>
      `;

      const jobIcon = L.divIcon({
        html: jobHtml,
        className: `custom-job-marker-${job.id}`,
        iconSize: [50, 44],
        iconAnchor: [25, 22]
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: jobIcon });

      // Add elegant popup with job title and company
      const popupContent = `
        <div class="font-sans text-left min-w-[180px] max-w-[240px]">
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="text-[9px] font-bold text-brand-primary tracking-wider uppercase bg-brand-surface-low px-1.5 py-0.5 rounded-sm">VAKANSIYA</span>
            <span class="text-[9px] font-semibold text-brand-secondary ml-auto">${job.salary}</span>
          </div>
          <h4 class="text-xs font-bold text-brand-primary leading-tight font-display mb-1 truncate">${job.title}</h4>
          <p class="text-[10px] text-brand-text-variant font-semibold mb-1.5 truncate">${job.company}</p>
          <div class="flex items-center gap-1 text-[9px] text-brand-text-variant/80 border-t border-brand-surface-low pt-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="truncate">${job.location}</span>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent, {
        closeButton: false,
        offset: [0, -15]
      });

      marker.on('click', () => {
        setSelectedJob(job);
        if (map) {
          map.setView([coords.lat, coords.lng], 14.0, { animate: true, duration: 0.8 });
        }
        setIsPanelExpanded(true);
        marker.openPopup();
      });
      marker.addTo(group);
    });

    // Render user location and routing path if userLocation is set
    if (userLocation) {
      const userHtml = `
        <div class="relative flex items-center justify-center" style="width: 40px; height: 40px;">
          <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10"></div>
          <span class="absolute w-8 h-8 rounded-full bg-blue-500 animate-ping opacity-40"></span>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: 'user-location-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindTooltip("Sizning joylashuvingiz", { permanent: false, direction: 'top' })
        .addTo(group);

      if (selectedJob) {
        const jobCoords = getLatLng(selectedJob);
        L.polyline(
          [[userLocation.lat, userLocation.lng], [jobCoords.lat, jobCoords.lng]],
          {
            color: '#3b82f6', // blue-500
            weight: 3,
            dashArray: '6, 6',
            opacity: 0.8
          }
        ).addTo(group);
      }
    }
  }, [activeCluster, jobs, selectedJob, userLocation, filterLocation, mapInstanceRef, markerGroupRef, getDisplayedJobs, setIsPanelExpanded, setSelectedJob]);
};
