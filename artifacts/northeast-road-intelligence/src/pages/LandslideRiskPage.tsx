import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import {
  Mountain,
  AlertTriangle,
  CloudRain,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const LandslideRiskPage: React.FC = () => {
  const { filteredRoadSegments, inspectRoad } = useOperating();
  const [minRisk, setMinRisk] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displaySegments = filteredRoadSegments
    .filter((s) => s.landslideRisk >= minRisk)
    .filter((s) => {
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          s.highwayNumber.toLowerCase().includes(q) ||
          s.startLocation.toLowerCase().includes(q) ||
          s.districtName.toLowerCase().includes(q) ||
          s.stateId.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => b.landslideRisk - a.landslideRisk);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Landslide Susceptibility & Slope Hazard Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Geotechnical slope vulnerability, high-resolution soil moisture saturation, and rockfall risk monitoring across Himalayan and Patkai mountain corridors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Min Risk Filter:
          </label>
          <input
            type="range"
            min="0"
            max="80"
            value={minRisk}
            onChange={(e) => setMinRisk(Number(e.target.value))}
            className="w-28 cursor-pointer"
          />
          <span className="font-bold text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
            ≥ {minRisk}%
          </span>
        </div>
      </div>

      {/* Map & Vulnerability List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <MapView className="h-[460px] w-full" />
          </div>
        </div>

        {/* Right 1 Col: Landslide Slope Directory */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 flex flex-col h-[520px]">
          <div className="font-bold text-xs text-slate-900 dark:text-white mb-2 flex items-center justify-between">
            <span>High Vulnerability Slopes ({displaySegments.length})</span>
            <span className="text-[10px] text-slate-500">Sorted by risk</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
            {displaySegments.map((seg) => (
              <div
                key={seg.id}
                onClick={() => inspectRoad(seg.id)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {seg.highwayNumber}: {seg.startLocation} → {seg.endLocation}
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {seg.landslideRisk}%
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-1.5">
                  {seg.districtName} ({seg.stateId}) · Elevation: {seg.elevationMeters}m
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>Soil Saturation: <strong>{seg.soilSaturation}%</strong></div>
                  <div>Slope Exposure: <strong>{seg.slopeExposure}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RoadIntelligenceDrawer />
    </div>
  );
};
