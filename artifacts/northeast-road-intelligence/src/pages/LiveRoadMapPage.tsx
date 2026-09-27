import React from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import { MobileRoadBottomSheet } from '../components/MobileRoadBottomSheet';
import {
  Map,
} from 'lucide-react';

export const LiveRoadMapPage: React.FC = () => {
  const {
    filteredRoadSegments,
    selectedRoadSegment,
    inspectRoad,
    mapLayers,
    toggleMapLayer,
  } = useOperating();

  const displaySegments = filteredRoadSegments;

  return (
    <div className="p-2 sm:p-6 space-y-3 sm:space-y-4 max-w-7xl mx-auto pb-24 md:pb-6">
      {/* Top Header & Filters */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-600" />
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white">
              GIS Road Network & Hazard Map
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial visualization of highway corridors, live vehicles, verified incident hazards, and terrain risk.
          </p>
        </div>

        {/* Mobile Compact Quick Filter Pill Strip */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Quick Map Layer Toggles for Mobile Screen */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar md:hidden">
            <button
              onClick={() => toggleMapLayer('roadStatus')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                mapLayers.roadStatus
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              Roads
            </button>
            <button
              onClick={() => toggleMapLayer('incidents')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                mapLayers.incidents
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              Incidents
            </button>
            <button
              onClick={() => toggleMapLayer('liveVehicles')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                mapLayers.liveVehicles
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              Vehicles
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Full Width Map on Mobile, 2-Col Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main GIS Canvas (Full width on mobile) */}
        <div className="lg:col-span-2">
          <MapView className="h-[480px] sm:h-[640px] w-full rounded-2xl shadow-md" />
        </div>

        {/* Right 1 Col: Segment Explorer & Filter (Hidden on small mobile, visible on desktop/tablet) */}
        <div className="hidden lg:flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex-col h-[640px]">
          {/* Filter Bar */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="text-base font-bold text-slate-700 dark:text-slate-200">
              Live Route Updates
            </div>
          </div>

          {/* Segment List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {displaySegments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No road segments match current filters.
              </div>
            ) : (
              displaySegments.slice(0, 4).map((seg) => {
                const isSelected = selectedRoadSegment?.id === seg.id;
                return (
                  <div
                    key={seg.id}
                    onClick={() => inspectRoad(seg.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px]">
                          {seg.highwayNumber}
                        </span>
                        <span className="truncate max-w-37.5">
                          {seg.startLocation} → {seg.endLocation}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          seg.roadStatus === 'Accessible'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : seg.roadStatus === 'Blocked'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {seg.roadStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-1">
                      {seg.districtName} · {seg.stateId} ({seg.lengthKm} km)
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>Speed: {seg.averageSpeed} km/h</span>
                      <span className="font-bold text-red-600">Risk: {seg.riskScore}/100</span>
                      <span>Delay: {seg.expectedDelay}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Desktop Drawer (Large screens) */}
      <div className="hidden md:block">
        <RoadIntelligenceDrawer />
      </div>

      {/* Mobile Draggable Bottom Sheet (Mobile screens) */}
      <div className="block md:hidden">
        <MobileRoadBottomSheet />
      </div>
    </div>
  );
};
