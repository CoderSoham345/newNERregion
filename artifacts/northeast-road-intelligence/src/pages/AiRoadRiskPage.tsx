import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import { Brain, ShieldAlert, Sparkles, AlertTriangle, ArrowUpDown, Search } from 'lucide-react';

export const AiRoadRiskPage: React.FC = () => {
  const { filteredRoadSegments, inspectRoad } = useOperating();
  const [searchQuery, setSearchQuery] = useState('');

  const sortedSegments = [...filteredRoadSegments]
    .filter((s) => {
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          s.highwayNumber.toLowerCase().includes(q) ||
          s.startLocation.toLowerCase().includes(q) ||
          s.endLocation.toLowerCase().includes(q) ||
          s.districtName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              AI Multi-Factor Road Vulnerability Index
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine-learned predictive composite risk matrix synthesized from topography, monsoon saturation, traffic bottlenecks, and real-time roadblock feeds.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>REAL-TIME SCORING WEIGHTS ACTIVE</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <input
          type="text"
          placeholder="Filter risk table by Highway, segment or district..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
        />
      </div>

      {/* High-Risk Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Highway & Segment</th>
                <th className="py-3 px-4">State / District</th>
                <th className="py-3 px-4">AI Composite Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Landslide %</th>
                <th className="py-3 px-4">Flood %</th>
                <th className="py-3 px-4">Saturation</th>
                <th className="py-3 px-4">AI Diagnostic Reason</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sortedSegments.map((seg) => (
                <tr
                  key={seg.id}
                  onClick={() => inspectRoad(seg.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] mr-1.5">
                      {seg.highwayNumber}
                    </span>
                    {seg.startLocation} → {seg.endLocation}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                    {seg.stateId} ({seg.districtName})
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            seg.riskScore >= 75
                              ? 'bg-red-500'
                              : seg.riskScore >= 45
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${seg.riskScore}%` }}
                        />
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">
                        {seg.riskScore}/100
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        seg.roadStatus === 'Blocked'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : seg.roadStatus === 'At risk'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          : seg.roadStatus === 'Caution'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {seg.roadStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-amber-600">
                    {seg.landslideRisk}%
                  </td>

                  <td className="py-3.5 px-4 font-bold text-blue-600">
                    {seg.floodRisk}%
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {seg.soilSaturation}%
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {seg.primaryReason}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectRoad(seg.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                    >
                      Diagnose
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RoadIntelligenceDrawer />
    </div>
  );
};
