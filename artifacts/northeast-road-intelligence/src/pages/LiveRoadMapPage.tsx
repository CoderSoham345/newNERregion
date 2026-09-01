import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import { MobileRoadBottomSheet } from '../components/MobileRoadBottomSheet';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  Map,
  Search,
} from 'lucide-react';

export const LiveRoadMapPage: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    filteredRoadSegments,
    selectedRoadSegment,
    inspectRoad,
    mapLayers,
    toggleMapLayer,
  } = useOperating();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentDistricts =
    selectedState !== 'All states' && STATES_DATA[selectedState as StateId]
      ? STATES_DATA[selectedState as StateId].districts
      : [];

  const displaySegments = filteredRoadSegments.filter((seg) => {
    if (statusFilter !== 'all' && seg.roadStatus !== statusFilter) return false;
    if (typeFilter !== 'all' && seg.highwayType !== typeFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        seg.highwayNumber.toLowerCase().includes(q) ||
        seg.startLocation.toLowerCase().includes(q) ||
        seg.endLocation.toLowerCase().includes(q) ||
        seg.districtName.toLowerCase().includes(q)
      );
    }
    return true;
  });

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

        {/* State & District Selectors + Mobile Compact Quick Filter Pill Strip */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as OperatingState)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ALL_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {currentDistricts.length > 0 && (
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Districts</option>
              {currentDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

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
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter road or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="Accessible">Accessible</option>
                <option value="Caution">Caution</option>
                <option value="At risk">At risk</option>
                <option value="Blocked">Blocked</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Types</option>
                <option value="NH">National (NH)</option>
                <option value="SH">State (SH)</option>
                <option value="MDR">Major District (MDR)</option>
              </select>
            </div>
          </div>

          {/* Segment List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {displaySegments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No road segments match current filters.
              </div>
            ) : (
              displaySegments.map((seg) => {
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
                        <span className="truncate max-w-[150px]">
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
