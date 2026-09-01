import React from 'react';
import { useOperating } from '../context/OperatingContext';
import {
  X,
  AlertTriangle,
  Route,
  Activity,
  CloudRain,
  Mountain,
  Waves,
  Clock,
  Navigation,
  ShieldAlert,
  Car,
  Truck,
  Sparkles,
  ArrowRight,
  Shield,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { useLocation } from 'wouter';

export const MobileRoadBottomSheet: React.FC = () => {
  const {
    selectedRoadSegment,
    setSelectedRoadSegment,
    incidents,
    cargoList,
    inspectCargo,
    inspectIncident,
  } = useOperating();

  const [, setLocation] = useLocation();

  if (!selectedRoadSegment) return null;

  const segmentIncidents = incidents.filter((i) =>
    selectedRoadSegment.incidentIds?.includes(i.id)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accessible':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40';
      case 'Caution':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-600/40';
      case 'At risk':
        return 'bg-orange-950/80 text-orange-300 border-orange-600/40';
      case 'Blocked':
        return 'bg-red-950/80 text-red-300 border-red-600/40 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-14 z-50 md:hidden bg-slate-900/98 text-slate-100 border-t border-slate-700 rounded-t-3xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
      {/* Drag Handle & Close */}
      <div className="pt-2.5 pb-1 flex flex-col items-center justify-center relative border-b border-slate-800/80">
        <div className="w-12 h-1.5 bg-slate-600 rounded-full mb-1" />
        <button
          onClick={() => setSelectedRoadSegment(null)}
          className="absolute right-3 top-2 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Header Info */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-mono font-black text-xs">
              {selectedRoadSegment.highwayNumber}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              {selectedRoadSegment.stateId}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
              selectedRoadSegment.roadStatus
            )}`}
          >
            ● {selectedRoadSegment.roadStatus.toUpperCase()}
          </span>
        </div>

        <h3 className="text-sm font-black text-white leading-tight">
          {selectedRoadSegment.startLocation} → {selectedRoadSegment.endLocation}
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {selectedRoadSegment.districtName} · {selectedRoadSegment.lengthKm} km ({selectedRoadSegment.elevationMeters}m MSL)
        </p>
      </div>

      {/* Scrollable details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs custom-scrollbar">
        {/* Core Quick Metric Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Risk Score</div>
            <div className={`font-black text-sm ${
              selectedRoadSegment.riskScore >= 70 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {selectedRoadSegment.riskScore}%
            </div>
          </div>
          <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Delay</div>
            <div className="font-black text-sm text-amber-300">
              {selectedRoadSegment.expectedDelay}
            </div>
          </div>
          <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Avg Speed</div>
            <div className="font-black text-sm text-blue-300">
              {selectedRoadSegment.averageSpeed} km/h
            </div>
          </div>
        </div>

        {/* Hazard & Operational Factors */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Accessibility:</span>
            <span className="font-bold text-white">
              {selectedRoadSegment.roadStatus === 'Blocked' ? 'Restricted / Impassable' : 'Open with Caution'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Primary Hazard:</span>
            <span className="font-bold text-red-400">
              {selectedRoadSegment.landslideRisk > 50 ? 'Landslide & Mudflow' : 'Heavy Rainfall & Fog'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Weather Impact:</span>
            <span className="font-bold text-cyan-300">
              {selectedRoadSegment.weatherCondition} ({selectedRoadSegment.rainfall} mm)
            </span>
          </div>
        </div>

        {/* AI Explainability Breakdown */}
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI EXPLAINABILITY · MODEL WEIGHTS</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200">
              {selectedRoadSegment.riskScore}% RISK
            </span>
          </div>

          <div className="space-y-1 text-[10px] text-slate-300">
            <div className="flex justify-between">
              <span>Rainfall & Saturation</span>
              <span className="font-mono font-bold text-emerald-300">40%</span>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[40%]" />
            </div>

            <div className="flex justify-between pt-1">
              <span>Slope & Elevation Gradient</span>
              <span className="font-mono font-bold text-emerald-300">30%</span>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[30%]" />
            </div>

            <div className="flex justify-between pt-1">
              <span>Soil Wetness Index</span>
              <span className="font-mono font-bold text-emerald-300">20%</span>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[20%]" />
            </div>

            <div className="flex justify-between pt-1">
              <span>Historical Incidents & Faults</span>
              <span className="font-mono font-bold text-emerald-300">10%</span>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[10%]" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              setLocation('/ai-routes');
            }}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 touch-manipulation"
          >
            <Navigation className="w-4 h-4" />
            <span>Safer Route</span>
          </button>

          <button
            onClick={() => {
              setLocation('/ai-assistant');
            }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 border border-slate-700 active:scale-95 touch-manipulation"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Reason</span>
          </button>

          <button
            onClick={() => {
              setLocation('/report');
            }}
            className="p-2.5 bg-red-600/80 hover:bg-red-500 text-white rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 touch-manipulation"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Issue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
