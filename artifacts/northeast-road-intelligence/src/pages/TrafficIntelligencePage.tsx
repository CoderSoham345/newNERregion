import React from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import { SourceBadge } from '../components/SourceBadge';
import { Car, Clock, TrendingUp, AlertTriangle, Route, Info, Radio, Zap } from 'lucide-react';

export const TrafficIntelligencePage: React.FC = () => {
  const { filteredRoadSegments, demoMode, toggleDemoMode, inspectDataSource } = useOperating();

  const congestedRoads = [...filteredRoadSegments].sort(
    (a, b) => b.riskScore - a.riskScore
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Source Transparency */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Highway Flow & Transit Traversal Diagnostics
            </h1>
            <SourceBadge
              sourceName="Terrain & Closure Model"
              status={demoMode ? 'simulated' : 'derived'}
              confidence={demoMode ? 'high' : 'medium'}
              onClickInfo={() => inspectDataSource('Traffic Congestion & Delay Feeds')}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
            Corridor traversal velocities, terrain grade limits, and bottleneck estimates calculated from elevation profiles and verified road closure reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDemoMode}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              demoMode
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{demoMode ? 'Simulated Probes Active' : 'Enable Demo Probes'}</span>
          </button>
        </div>
      </div>

      {/* Real Data Integrity Notice */}
      {!demoMode && (
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-blue-950 dark:text-blue-200">
              Live Probe Telemetry Notice
            </div>
            <p className="text-blue-900 dark:text-blue-300 text-[11px] leading-relaxed">
              No live commercial probe sensors (e.g. Google Traffic API / FASTag toll timestamps) are connected to this instance. Traversal speeds shown below represent kinematic baseline estimates based on highway curvature, gradient, and active field roadblocks.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <MapView className="h-[460px] w-full" />
          </div>
        </div>

        {/* Right 1 Col: Congestion Ranking */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col h-[520px]">
          <div className="font-bold text-xs text-slate-900 dark:text-white mb-3 flex items-center justify-between">
            <span>Corridor Transit Delay Ranking</span>
            <span className="text-[10px] text-slate-500">Speed Profile</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {congestedRoads.map((seg) => (
              <div
                key={seg.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {seg.highwayNumber}: {seg.startLocation} → {seg.endLocation}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {seg.averageSpeed} km/h
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-2">
                  {seg.districtName} ({seg.stateId}) · Grade: {seg.elevationMeters}m MSL
                </div>

                <div className="flex items-center justify-between text-[10px] bg-white dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">
                    Status: <strong className={seg.roadStatus === 'Blocked' ? 'text-red-600' : 'text-emerald-600'}>{seg.roadStatus}</strong>
                  </span>
                  <span className="text-red-600 font-bold">
                    Delay: {seg.expectedDelay}
                  </span>
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
