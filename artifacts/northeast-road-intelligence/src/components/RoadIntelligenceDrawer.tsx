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
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useLocation } from 'wouter';

export const RoadIntelligenceDrawer: React.FC = () => {
  const {
    selectedRoadSegment,
    setSelectedRoadSegment,
    updateRoadSegmentStatus,
    incidents,
    cargoList,
    inspectCargo,
    inspectIncident,
  } = useOperating();

  const [, setLocation] = useLocation();

  if (!selectedRoadSegment) return null;

  const segmentIncidents = incidents.filter((i) =>
    selectedRoadSegment.incidentIds.includes(i.id)
  );

  const affectedCargo = cargoList.filter((c) =>
    selectedRoadSegment.affectedCargo.includes(c.id) ||
    c.assignedRoadSegmentId === selectedRoadSegment.id
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accessible':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Caution':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800';
      case 'At risk':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      case 'Blocked':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 animate-pulse';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  const handleFindSafestRoute = () => {
    setLocation('/ai-routes');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              {selectedRoadSegment.highwayNumber}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                selectedRoadSegment.roadStatus
              )}`}
            >
              ● {selectedRoadSegment.roadStatus.toUpperCase()}
            </span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
            {selectedRoadSegment.startLocation} → {selectedRoadSegment.endLocation}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedRoadSegment.districtName} · {selectedRoadSegment.stateId} ({selectedRoadSegment.lengthKm} km · {selectedRoadSegment.elevationMeters}m MSL)
          </p>
        </div>

        <button
          onClick={() => setSelectedRoadSegment(null)}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Core Risk & Delay Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Composite Risk Score</span>
            <span
              className={`font-black text-sm ${
                selectedRoadSegment.riskScore >= 75
                  ? 'text-red-600 dark:text-red-400'
                  : selectedRoadSegment.riskScore >= 45
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {selectedRoadSegment.riskScore} / 100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${
                selectedRoadSegment.riskScore >= 75
                  ? 'bg-red-500'
                  : selectedRoadSegment.riskScore >= 45
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${selectedRoadSegment.riskScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            <strong>Operational Assessment:</strong> {selectedRoadSegment.primaryReason}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Transit Delay: <strong>{selectedRoadSegment.expectedDelay}</strong></span>
            </div>
            <div className="text-slate-400">
              Updated: {selectedRoadSegment.lastUpdated}
            </div>
          </div>
        </div>

        {/* Multi-Dimensional Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Traffic & Speed */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
              <Car className="w-3.5 h-3.5 text-blue-500" />
              <span>Traffic & Congestion</span>
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {selectedRoadSegment.averageSpeed} km/h avg
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Flow: {selectedRoadSegment.trafficLevel} ({selectedRoadSegment.congestionPct}% capacity)
            </div>
          </div>

          {/* Weather & Rainfall */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-500" />
              <span>24h Precipitation</span>
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {selectedRoadSegment.rainfall} mm
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {selectedRoadSegment.weatherCondition} · {selectedRoadSegment.temperature}°C
            </div>
          </div>

          {/* Landslide Risk */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
              <Mountain className="w-3.5 h-3.5 text-amber-500" />
              <span>Landslide Exposure</span>
            </div>
            <div className="font-bold text-sm text-amber-600 dark:text-amber-400">
              {selectedRoadSegment.landslideRisk}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Soil Saturation: {selectedRoadSegment.soilSaturation}%
            </div>
          </div>

          {/* Flood Risk */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
              <Waves className="w-3.5 h-3.5 text-cyan-500" />
              <span>Flood Risk</span>
            </div>
            <div className="font-bold text-sm text-cyan-600 dark:text-cyan-400">
              {selectedRoadSegment.floodRisk}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Slope Exposure: {selectedRoadSegment.slopeExposure}%
            </div>
          </div>
        </div>

        {/* Active Incidents on this Segment */}
        {segmentIncidents.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Active Field Incidents ({segmentIncidents.length})</span>
            </div>

            {segmentIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => inspectIncident(inc.id)}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 cursor-pointer hover:bg-red-100/70 transition-colors"
              >
                <div className="flex items-center justify-between font-bold text-red-950 dark:text-red-200 mb-1">
                  <span>{inc.title}</span>
                  <span className="text-[10px] font-semibold bg-red-200 dark:bg-red-900 px-1.5 py-0.5 rounded">
                    {inc.status}
                  </span>
                </div>
                <p className="text-[11px] text-red-900 dark:text-red-300 line-clamp-2 mb-1.5">
                  {inc.description}
                </p>
                <div className="text-[10px] text-red-800 dark:text-red-400 flex items-center justify-between">
                  <span>Reported by: {inc.reportedBy}</span>
                  <span>Est. Clearance: {inc.estimatedClearanceTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Affected Essential Cargo */}
        {affectedCargo.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Impacted Cargo Shipments ({affectedCargo.length})</span>
            </div>

            {affectedCargo.map((cargo) => (
              <div
                key={cargo.id}
                onClick={() => {
                  inspectCargo(cargo.id);
                  setLocation('/cargo');
                }}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {cargo.id} · {cargo.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {cargo.origin} → {cargo.destination} ({cargo.eta})
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {cargo.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Alternate Route Recommendation */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div className="font-bold text-xs text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recommended Alternate Route</span>
          </div>
          <p className="text-[11px] text-emerald-900 dark:text-emerald-300 font-medium">
            {selectedRoadSegment.alternateRoute} (+{selectedRoadSegment.alternateRouteKm} km · ETA: {selectedRoadSegment.alternateRouteEta})
          </p>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2">
        <button
          onClick={handleFindSafestRoute}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>Calculate Safest Alternate Route</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLocation('/weather')}
            className="py-2 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-center cursor-pointer"
          >
            Weather Radar
          </button>
          <button
            onClick={() => setLocation('/traffic')}
            className="py-2 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-center cursor-pointer"
          >
            Traffic Flow
          </button>
        </div>
      </div>
    </div>
  );
};
