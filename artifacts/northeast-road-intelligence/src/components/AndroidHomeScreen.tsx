import React from 'react';
import { useLocation } from 'wouter';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  ShieldAlert,
  AlertTriangle,
  Truck,
  Route,
  Navigation,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  Activity,
  Mountain,
  Waves,
  Radio,
  Play,
  RotateCcw,
  Bot,
  ExternalLink,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface AndroidHomeScreenProps {
  onOpenAiReasoning?: (roadId: string) => void;
}

export const AndroidHomeScreen: React.FC<AndroidHomeScreenProps> = ({ onOpenAiReasoning }) => {
  const [, setLocation] = useLocation();
  const {
    selectedState,
    setSelectedState,
    roadSegments,
    cargoList,
    incidents,
    vehicles,
    isOnline,
    pendingOfflineReportsCount,
    emergencyMode,
    toggleEmergencyMode,
    inspectRoad,
    inspectCargo,
    runAiIncidentSimulation,
    isSimulatingIncident,
  } = useOperating();

  // Metrics computation
  const criticalIncidents = incidents.filter(
    (i) => i.severity === 'Critical' || i.severity === 'High'
  );
  const riskyRoads = roadSegments.filter(
    (r) => r.roadStatus === 'Blocked' || r.roadStatus === 'At risk'
  );
  const atRiskDeliveries = cargoList.filter(
    (c) => c.status === 'At risk' || c.status === 'Delayed' || c.priority === 'Critical'
  );
  const activeVehicles = vehicles.length;

  // Find priority alert
  const topHazardRoad =
    roadSegments.find((r) => r.roadStatus === 'Blocked') ||
    roadSegments.find((r) => r.roadStatus === 'At risk') ||
    roadSegments[0];

  // 2-3 Priority Active Deliveries
  const priorityDeliveries = cargoList
    .filter((c) => c.priority === 'Critical' || c.status === 'At risk' || c.status === 'Delayed')
    .slice(0, 3);

  return (
    <div id="android-home-screen" className="space-y-4 pb-20 max-w-lg mx-auto p-3.5">
      {/* 1. Header with Offline/Online Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                UTTARPŪRV
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white mt-0.5">
              NER Field Intelligence
            </h1>
          </div>

          {/* Online / Offline Status Badge */}
          <div className="flex flex-col items-end gap-1">
            <div
              className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border ${
                isOnline
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-950/80 text-red-300 border-red-500/40 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>ONLINE</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>OFFLINE</span>
                </>
              )}
            </div>

            {pendingOfflineReportsCount > 0 && (
              <span className="text-[9px] font-mono text-amber-300 font-bold">
                {pendingOfflineReportsCount} reports saved locally
              </span>
            )}
          </div>
        </div>

        {/* State Selector Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {ALL_STATES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all touch-manipulation ${
                selectedState === st
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Four Priority Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => setLocation('/disaster')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs cursor-pointer active:scale-98 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between text-red-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Critical Incidents
            </span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {criticalIncidents.length}
          </div>
          <div className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-0.5">
            Active verified hazards
          </div>
        </div>

        <div
          onClick={() => setLocation('/map')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs cursor-pointer active:scale-98 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between text-orange-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Blocked Roads
            </span>
            <Route className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {riskyRoads.length}
          </div>
          <div className="text-[10px] text-orange-600 dark:text-orange-400 font-bold mt-0.5">
            Restricted or caution
          </div>
        </div>

        <div
          onClick={() => setLocation('/cargo')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs cursor-pointer active:scale-98 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between text-amber-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              At-Risk Deliveries
            </span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {atRiskDeliveries.length}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
            Lifeline consignments
          </div>
        </div>

        <div
          onClick={() => setLocation('/vehicles')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs cursor-pointer active:scale-98 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between text-blue-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Vehicles
            </span>
            <Radio className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activeVehicles}
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
            Active in NER fleet
          </div>
        </div>
      </div>

      {/* 3. Quick Actions (One-Hand Android Touch Friendly) */}
      <div className="space-y-2">
        <div className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase px-1">
          WHAT DO YOU NEED TO DO?
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setLocation('/routes')}
            className="p-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md active:scale-95 touch-manipulation transition-all text-center min-h-[64px]"
          >
            <Route className="w-5 h-5 text-emerald-200" />
            <span>FIND SAFE ROUTE</span>
          </button>

          <button
            onClick={() => setLocation('/report')}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 border border-slate-700 shadow-md active:scale-95 touch-manipulation transition-all text-center min-h-[64px]"
          >
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>REPORT INCIDENT</span>
          </button>

          <button
            onClick={() => setLocation('/cargo')}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 border border-slate-700 shadow-md active:scale-95 touch-manipulation transition-all text-center min-h-[64px]"
          >
            <Truck className="w-5 h-5 text-teal-400" />
            <span>TRACK DELIVERY</span>
          </button>

          <button
            onClick={() => setLocation('/helplines')}
            className="p-3.5 bg-red-900/80 hover:bg-red-800 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 border border-red-700/60 shadow-md active:scale-95 touch-manipulation transition-all text-center min-h-[64px]"
          >
            <PhoneCall className="w-5 h-5 text-red-200" />
            <span>EMERGENCY</span>
          </button>
        </div>
      </div>

      {/* 4. Live NER Map Quick Preview Card */}
      <div
        onClick={() => setLocation('/map')}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-white space-y-3 cursor-pointer active:scale-98 transition-all touch-manipulation"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              NER Live Risk Map
            </span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/40">
            MapTiler Live
          </span>
        </div>

        <div className="h-36 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="text-center space-y-1 relative z-10 p-3">
            <Navigation className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
            <div className="text-xs font-bold text-white">Tap to Open Full GIS Map</div>
            <div className="text-[10px] text-slate-400">8 Sister States • NH Corridors • Live Weather</div>
          </div>
        </div>
      </div>

      {/* 3. Priority Alert Card */}
      {topHazardRoad && (
        <div className="bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 border border-red-500/40 rounded-2xl p-4 shadow-lg text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase tracking-wider animate-pulse">
                PRIORITY ALERT
              </span>
              <span className="text-[10px] font-bold text-red-300">
                🔴 CRITICAL HAZARD
              </span>
            </div>
            <span className="text-xs font-mono font-black text-red-400">
              RISK: {topHazardRoad.riskScore}%
            </span>
          </div>

          <div>
            <div className="text-base font-black text-white">
              Landslide & Slope Disruption
            </div>
            <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Near {topHazardRoad.startLocation} · {topHazardRoad.stateId}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-2.5 border border-red-500/20 text-[11px] space-y-1 text-slate-300">
            <div>
              <strong className="text-white">Corridor:</strong> {topHazardRoad.highwayNumber} ({topHazardRoad.startLocation} → {topHazardRoad.endLocation})
            </div>
            <div>
              <strong className="text-white">Status:</strong> {topHazardRoad.roadStatus.toUpperCase()} (Delay: {topHazardRoad.expectedDelay})
            </div>
            <div className="text-amber-300 font-semibold">
              ⚠️ Recommended: Avoid corridor or take northern detour.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                inspectRoad(topHazardRoad.id);
                setLocation('/map');
              }}
              className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 touch-manipulation"
            >
              <Route className="w-3.5 h-3.5" />
              <span>VIEW MAP</span>
            </button>

            <button
              onClick={() => {
                setLocation('/routes');
              }}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 touch-manipulation"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>FIND SAFER ROUTE</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Active Deliveries (Show 2-3 only) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            Active Deliveries
          </h2>
          <button
            onClick={() => setLocation('/cargo')}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
          >
            See All ({cargoList.length}) <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {priorityDeliveries.map((cargo) => (
            <div
              key={cargo.id}
              onClick={() => {
                inspectCargo(cargo.id);
                setLocation('/cargo');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer active:scale-98 touch-manipulation"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] rounded">
                    {cargo.category}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {cargo.name}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                    cargo.status === 'In Transit'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                  }`}
                >
                  {cargo.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>{cargo.origin} → {cargo.destination}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cargo.vehicleId}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">ETA: {cargo.eta}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Track Delivery <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. AI Insight Card */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 text-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI FIELD INSIGHT</span>
          </div>
          <button
            onClick={() => setLocation('/ai-assistant')}
            className="text-[10px] font-bold text-emerald-300 underline uppercase"
          >
            Ask AI
          </button>
        </div>

        <p className="text-xs text-slate-300 font-medium">
          Heavy monsoon rainfall (+45mm) + steep slope terrain along Meghalaya corridor → Elevated landslide risk on NH-6.
        </p>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              if (topHazardRoad) {
                inspectRoad(topHazardRoad.id);
              }
              setLocation('/ai-routes');
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs touch-manipulation"
          >
            <span>VIEW AI REASONING & DETOUR</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 6. Assam Smart Corridor Pilot & 90s SIH Demo Banner */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Assam Smart Corridor Pilot
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-slate-950">
              BARAK VALLEY
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Silchar → Hailakandi/Sribhumi 90-second SIH presentation engine with live AI rerouting.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation('/assam-corridor')}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md touch-manipulation cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>LAUNCH PILOT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
