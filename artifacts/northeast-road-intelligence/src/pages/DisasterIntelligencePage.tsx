import React from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import {
  Flame,
  AlertTriangle,
  Mountain,
  Waves,
  CloudRain,
  ShieldAlert,
  PhoneCall,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'wouter';

export const DisasterIntelligencePage: React.FC = () => {
  const {
    selectedState,
    roadSegments,
    incidents,
    criticalIncidentsCount,
    emergencyMode,
    toggleEmergencyMode,
    inspectRoad,
    inspectIncident,
  } = useOperating();

  const highRiskRoads = roadSegments.filter(
    (r) => r.landslideRisk >= 60 || r.floodRisk >= 60 || r.roadStatus === 'Blocked'
  );

  const activeCriticalIncidents = incidents.filter(
    (i) => i.severity === 'Critical' && i.status !== 'Resolved'
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-600 animate-pulse" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              NER Disaster & Multi-Hazard Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-hazard integration coordinating State Disaster Management Authorities (SDMA), NDRF, BRO, and PWD emergency response.
          </p>
        </div>

        <button
          onClick={toggleEmergencyMode}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            emergencyMode
              ? 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-400 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>{emergencyMode ? 'EMERGENCY PROTOCOL ACTIVE' : 'Trigger Emergency Protocol'}</span>
        </button>
      </div>

      {/* 4 Multi-Hazard Status Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Landslide Threat */}
        <Link
          href="/landslide-risk"
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500 transition-colors block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
              <Mountain className="w-4 h-4" />
              <span>Landslide Sentinel</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {roadSegments.filter((r) => r.landslideRisk >= 50).length} Slopes
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            High saturation warnings in Meghalaya & Sikkim
          </div>
        </Link>

        {/* River Basin Flood Threat */}
        <Link
          href="/flood-risk"
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 transition-colors block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <Waves className="w-4 h-4" />
              <span>Brahmaputra & Barak</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            3 River Basins
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Approaching CWC danger mark at Dhubri & Nimatighat
          </div>
        </Link>

        {/* Monsoonal Heavy Rainfall */}
        <Link
          href="/weather"
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500 transition-colors block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600">
              <CloudRain className="w-4 h-4" />
              <span>Doppler Flash Watch</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            124 mm
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Red alert for Cherrapunjee & East Khasi Hills
          </div>
        </Link>

        {/* Critical Incidents */}
        <Link
          href="/alerts"
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-500 transition-colors block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Incidents</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">
            {criticalIncidentsCount} Dispatched
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            NDRF & BRO equipment mobilized on-site
          </div>
        </Link>
      </div>

      {/* Map & Disaster Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Multi-Hazard Vector GIS Map ({selectedState})
              </span>
              <span className="text-[11px] text-red-600 font-semibold">Live Incident Heatmap Active</span>
            </div>
            <MapView className="h-[460px] w-full" />
          </div>

          {/* High Hazard Vulnerable Corridors */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-3">
              Monitored Critical High-Hazard Corridors ({highRiskRoads.length})
            </h3>

            <div className="space-y-2">
              {highRiskRoads.map((r) => (
                <div
                  key={r.id}
                  onClick={() => inspectRoad(r.id)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {r.highwayNumber}: {r.startLocation} → {r.endLocation}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {r.districtName} ({r.stateId}) · Landslide Risk: {r.landslideRisk}% · Flood Risk: {r.floodRisk}%
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      r.roadStatus === 'Blocked'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                    }`}
                  >
                    {r.roadStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Active Rescue Operations */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Active Rescue & Clearance Despatches</span>
            </h3>

            <div className="space-y-3">
              {activeCriticalIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => inspectIncident(inc.id)}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <div className="flex items-center justify-between font-bold text-xs text-red-950 dark:text-red-200 mb-1">
                    <span>{inc.title}</span>
                    <span className="text-[9px] bg-red-200 dark:bg-red-900 px-1.5 py-0.5 rounded">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-red-900 dark:text-red-300 mb-2 line-clamp-2">
                    {inc.description}
                  </p>
                  <div className="text-[10px] text-red-800 dark:text-red-400">
                    <strong>Clearance ETA:</strong> {inc.estimatedClearanceTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Helplines Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800">
            <div className="font-bold text-xs flex items-center gap-2 text-emerald-400">
              <PhoneCall className="w-4 h-4" />
              <span>Direct Emergency Disaster Hotlines</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-800">
                <span className="text-slate-300">National Disaster (NDRF)</span>
                <span className="font-black text-white">1078 / 9711077372</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-800">
                <span className="text-slate-300">State Disaster (SEOC)</span>
                <span className="font-black text-white">1070</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-800">
                <span className="text-slate-300">BRO Project Udayak / Pushpak</span>
                <span className="font-black text-white">03774-222340</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoadIntelligenceDrawer />
    </div>
  );
};
