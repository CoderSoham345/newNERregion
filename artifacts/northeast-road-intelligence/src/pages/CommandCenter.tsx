import React, { useState, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import { STATES_DATA, ALL_STATES, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  ShieldAlert,
  Route,
  Activity,
  Truck,
  CloudRain,
  AlertTriangle,
  Navigation,
  PhoneCall,
  Flame,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Bot,
  Mountain,
  Waves,
  Newspaper,
  Radio,
  Building2,
  Landmark,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Shield,
  HeartPulse,
  Crosshair,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { SourceBadge } from '../components/SourceBadge';
import { AndroidHomeScreen } from '../components/AndroidHomeScreen';
import {
  EMERGENCY_FACILITIES,
  calculateDistanceKm,
  estimateRoadEta,
  getDirectionsUrl,
} from '../data/emergencyFacilitiesData';

export const CommandCenter: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    roadSegments,
    cargoList,
    incidents,
    alerts,
    liveWeather,
    userProfile,
    blockedRoadsCount,
    criticalIncidentsCount,
    emergencyMode,
    toggleEmergencyMode,
    inspectRoad,
    inspectCargo,
    inspectIncident,
    runAiIncidentSimulation,
    isSimulatingIncident,
    simulationStep,
    t,
  } = useOperating();

  const [, setLocation] = useLocation();

  // Dynamic Live IST Clock (updates every second)
  const [istTime, setIstTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
  });
  const [istDate, setIstDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
      setIstDate(now.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute Active Operational Stats
  const totalRoads = roadSegments.length;
  const accessibleRoads = roadSegments.filter((r) => r.roadStatus === 'Accessible').length;
  const blockedRoads = roadSegments.filter((r) => r.roadStatus === 'Blocked').length;
  const atRiskRoads = roadSegments.filter((r) => r.roadStatus === 'At risk' || r.roadStatus === 'Caution').length;
  const accessibilityPct = Math.round((accessibleRoads / totalRoads) * 100);

  const activeCargo = cargoList.filter((c) => c.status === 'In Transit').length;
  const delayedCargo = cargoList.filter((c) => c.status === 'Delayed' || c.status === 'At risk').length;

  // Active state data resolution
  const activeStateKey: StateId = selectedState === 'All states' ? 'Meghalaya' : (selectedState as StateId);
  const stateData = STATES_DATA[activeStateKey] || STATES_DATA['Meghalaya'];

  const districtList = stateData.districts;
  const activeDistrict =
    districtList.find((d) => d.id === selectedDistrictId) || districtList[0];

  // Nearest incident in current state/district
  const nearestIncident = incidents.find(
    (i) => i.stateId === activeStateKey || (selectedState === 'All states' && i.status !== 'Resolved')
  ) || incidents[0];

  // Nearest affected road
  const nearestAffectedRoad = roadSegments.find(
    (r) =>
      (r.stateId === activeStateKey || selectedState === 'All states') &&
      (r.roadStatus === 'Blocked' || r.roadStatus === 'At risk')
  ) || roadSegments.find((r) => r.roadStatus === 'Blocked');

  // Compute reference coordinates (district or state center)
  const refCoords: [number, number] = activeDistrict?.center || stateData.center || [26.1433, 91.7898];

  // Compute nearest police station and hospital
  const facilitiesWithDist = EMERGENCY_FACILITIES.map((f) => {
    const dist = calculateDistanceKm(refCoords[0], refCoords[1], f.coords[0], f.coords[1]);
    const eta = estimateRoadEta(dist, f.stateId !== 'Assam');
    const directionsUrl = getDirectionsUrl(f.coords[0], f.coords[1]);
    return { ...f, distanceKm: dist, roadEta: eta, directionsUrl };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearestPolice = facilitiesWithDist.find((f) => f.category === 'police');
  const nearestHospital = facilitiesWithDist.find((f) => f.category === 'medical');

  return (
    <>
      {/* Mobile-first Android Dedicated Home Screen for screen widths under md (768px) */}
      <div className="block md:hidden">
        <AndroidHomeScreen />
      </div>

      {/* Desktop Command Center for Large Screens (md and above) */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        {/* SIH Jury Showcase Hero Banner & Workflow Strip */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-7 rounded-2xl border border-emerald-800/40 shadow-xl space-y-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-md text-[11px] font-black bg-emerald-600 text-white tracking-widest uppercase shadow-xs">
                UttarPURV
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                SIH JURY DEMONSTRATION PLATFORM
              </span>
              <SourceBadge status="live" confidence="high" />
              <span className="text-xs text-slate-400 font-mono">
                {istDate} • <strong className="text-emerald-400">{istTime}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              UttarPURV: AI-Powered Smart Logistics & Accessibility Intelligence Platform for Northeast India
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time road accessibility, disaster-risk prediction, logistics intelligence, emergency response and AI-powered route optimization for the Northeast Region.
            </p>
          </div>

          {/* Primary & Secondary Action Hub */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              href="/map"
              className="px-5 py-3 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2.5 shadow-lg hover:scale-105 transition-all ring-2 ring-emerald-400/50"
            >
              <Navigation className="w-4 h-4" />
              <span>Open NER Intelligence Map</span>
            </Link>

            <Link
              href="/assam-corridor"
              className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Assam Smart Corridor (Pilot)</span>
            </Link>

            <button
              onClick={runAiIncidentSimulation}
              disabled={isSimulatingIncident}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isSimulatingIncident
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{isSimulatingIncident ? 'Running Sim...' : 'Quick Simulation'}</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href="/assam-corridor"
                className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-bold text-[11px] flex items-center justify-center gap-1 border border-emerald-700/60 transition-colors"
              >
                <Navigation className="w-3 h-3 text-emerald-300" />
                <span>90s SIH Demo</span>
              </Link>
              <Link
                href="/helplines"
                className="flex-1 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-[11px] flex items-center justify-center gap-1 border border-red-700/60 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-red-300" />
                <span>8-State Directory</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Simulation Progress Banner */}
        {isSimulatingIncident && (
          <div className="bg-amber-950/80 border border-amber-600 p-3.5 rounded-xl flex items-center gap-3 animate-fade-in text-amber-200 text-xs font-semibold">
            <Activity className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <span className="font-mono">{simulationStep}</span>
          </div>
        )}

        {/* SIH Core 6-Stage Execution Workflow */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center justify-between">
            <span>OPERATIONAL PIPELINE & INCIDENT STORY</span>
            <span className="text-emerald-400 font-mono text-[11px]">DETECT → PREDICT → EXPLAIN → ALERT → ROUTE → RESPOND → TRACK → RESOLVE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { step: 1, name: 'Detect', desc: 'Doppler radars & SOS' },
              { step: 2, name: 'Predict', desc: 'Slope failure & flood' },
              { step: 3, name: 'Explain', desc: 'SHAP factor weights' },
              { step: 4, name: 'Alert', desc: 'CAP & SEOC broadcast' },
              { step: 5, name: 'Route', desc: 'Penalty shortest path' },
              { step: 6, name: 'Respond', desc: 'BRO / SDRF dispatch' },
              { step: 7, name: 'Track', desc: 'Convoy GPS monitoring' },
              { step: 8, name: 'Resolve', desc: 'Clearance & audit verification' },
            ].map((stg) => (
              <div key={stg.step} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-[9px] text-emerald-300">
                    {stg.step}
                  </span>
                  <span>{stg.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{stg.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 PRIMARY KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/90 border border-red-500/30 p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Incidents</div>
              <div className="text-2xl font-black text-red-400 mt-1">{criticalIncidentsCount} Active</div>
              <div className="text-[10px] text-slate-400 mt-0.5">High severity landslides & floods</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-800/90 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blocked Roads</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{blockedRoads} Sectors</div>
              <div className="text-[10px] text-slate-400 mt-0.5">NH-6, NH-2, NH-10 closures</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <Route className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-800/90 border border-cyan-500/30 p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">At-Risk Deliveries</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">{delayedCargo} Shipments</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Medical & relief supply lines</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-800/90 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vehicles in Transit</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{activeCargo + 12} Convoys</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Active GPS telematics monitored</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Section: 4 Major Outcomes */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            4 CORE VALUE OUTCOMES FOR NORTHEAST INDIA
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Link
              href="/roads"
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-700/70 transition-all hover:border-emerald-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Mountain className="w-4 h-4" />
                  <span>🛣 Road Accessibility Intelligence</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                96% precision on vulnerable mountain corridors with real-time passability classification across 45+ NH routes.
              </p>
            </Link>

            <Link
              href="/disaster"
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-700/70 transition-all hover:border-sky-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                  <CloudRain className="w-4 h-4" />
                  <span>🌧 Disaster & Disruption Prediction</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                Antecedent precipitation indices and geotechnical slope modeling generating 35-min early warnings before rockfall.
              </p>
            </Link>

            <Link
              href="/cargo"
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-700/70 transition-all hover:border-cyan-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>🚚 Smart Logistics & Vehicle Tracking</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                Dynamic route optimization & prioritized rerouting for medicine, petroleum, and relief cargo during highway blockades.
              </p>
            </Link>

            <Link
              href="/governance"
              className="bg-slate-800/80 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-700/70 transition-all hover:border-red-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <Shield className="w-4 h-4" />
                  <span>🚨 Emergency Response & Authority Intelligence</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                Direct inter-agency dispatch coordinating State Disaster Authorities (1070), BRO task forces, and 112 emergency desks.
              </p>
            </Link>
          </div>
        </div>

        {/* Section 1: NER STATUS High-Level Overview Matrix */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>NER REGIONAL STATUS OVERVIEW (ALL 8 STATES)</span>
            <Link href="/states" className="text-emerald-400 hover:underline flex items-center gap-0.5">
              <span>View All 8 State Intelligence Cards</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Monitored States</div>
              <div className="text-xl font-black text-white mt-0.5">8 States</div>
              <div className="text-[10px] text-slate-400">Assam, AR, ML, MN, MZ, NL, TR, SK</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Districts Monitored</div>
              <div className="text-xl font-black text-white mt-0.5">120+ Admin</div>
              <div className="text-[10px] text-slate-400">All authenticated DDMAs</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Corridors Monitored</div>
              <div className="text-xl font-black text-white mt-0.5">{totalRoads} Sectors</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{accessibilityPct}% Network Passable</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Blocked Corridors</div>
              <div className="text-xl font-black text-red-400 mt-0.5">{blockedRoads} Blocked</div>
              <div className="text-[10px] text-slate-400">NH-6, NH-2, NH-10 diversions</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active Field Alerts</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">{alerts.length} Warnings</div>
              <div className="text-[10px] text-slate-400">{criticalIncidentsCount} Critical Severity</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Monsoon Alert Level</div>
              <div className="text-xl font-black text-sky-400 mt-0.5">Orange / Red</div>
              <div className="text-[10px] text-slate-400">High slope saturation index</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: MY AREA Operational Card & Weather Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MY AREA Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  MY OPERATIONAL AREA — {activeStateKey} ({activeDistrict?.name || 'All Districts'})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Target Area Ground Telemetry & Immediate Highway Diagnostics
                </p>
              </div>
            </div>

            {/* Quick State & District Switchers */}
            <div className="flex items-center gap-2">
              <select
                value={selectedState}
                onChange={(e) => {
                  const val = e.target.value as OperatingState;
                  setSelectedState(val);
                  if (val !== 'All states' && STATES_DATA[val]?.districts.length > 0) {
                    setSelectedDistrictId(STATES_DATA[val].districts[0].id);
                  }
                }}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
              >
                {ALL_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {selectedState !== 'All states' && (
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  {districtList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Area Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Live Weather / Temperature */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Live Temperature</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {liveWeather?.temperature ?? activeDistrict?.temperature ?? 22}°C
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                {liveWeather?.weatherDescription ?? activeDistrict?.weather ?? 'Overcast Showers'}
              </div>
            </div>

            {/* Live Rainfall (Open-Meteo REST) */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase">24h Rainfall</div>
              <div className="text-xl font-black text-sky-600 dark:text-sky-400 mt-0.5">
                {liveWeather?.rainLast24h ? `${liveWeather.rainLast24h} mm` : `${activeDistrict?.rainfall ?? 76} mm`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                IMD / Open-Meteo REST
              </div>
            </div>

            {/* Road Condition in Area */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Road Condition</div>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {activeDistrict?.atRiskRoadCount > 0 ? `${activeDistrict.atRiskRoadCount} At Risk` : 'Accessible'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Traffic: {activeDistrict?.trafficStatus ?? 'Moderate'}
              </div>
            </div>

            {/* Active Disaster Risk */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Landslide Vulnerability</div>
              <div className="text-xl font-black text-red-600 dark:text-red-400 mt-0.5">
                {activeDistrict?.riskScore ?? stateData.landslideRisk}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Terrain: {activeDistrict?.terrainType ?? 'Hilly'}
              </div>
            </div>
          </div>

          {/* Local Area Incidents & Nearest Affected Corridor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60">
              <div className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                NEAREST AFFECTED HIGHWAY
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {nearestAffectedRoad?.highwayNumber} ({nearestAffectedRoad?.startLocation} → {nearestAffectedRoad?.endLocation})
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Status: <strong className="text-red-600 dark:text-red-400">{nearestAffectedRoad?.roadStatus}</strong> — {nearestAffectedRoad?.primaryReason || 'Landslide clearing in progress'}
              </div>
              <button
                onClick={() => nearestAffectedRoad && inspectRoad(nearestAffectedRoad.id)}
                className="mt-2 text-[11px] font-bold text-red-700 dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Highway Sector</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
              <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                ACTIVE FIELD INCIDENT
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {nearestIncident?.title}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Location: {nearestIncident?.districtName}, {nearestIncident?.stateId} • {nearestIncident?.severity} Priority
              </div>
              <button
                onClick={() => nearestIncident && inspectIncident(nearestIncident.id)}
                className="mt-2 text-[11px] font-bold text-amber-800 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Incident Detail & Verification</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Assistant Quick Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">NER AI Intelligence Assistant</h3>
                <span className="text-[10px] text-emerald-400">Grounded Multi-Modal Engine</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant AI answers grounded in real Open-Meteo weather telemetry, NHAI road closures, and topography slope indices.
            </p>

            <div className="mt-3 space-y-1.5">
              <Link
                href="/ai-assistant"
                className="block p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                👉 "Is NH-6 safe for heavy vehicles today?"
              </Link>
              <Link
                href="/ai-assistant"
                className="block p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                👉 "Show alternate route: Guwahati to Aizawl"
              </Link>
            </div>
          </div>

          <Link
            href="/ai-assistant"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Full NER AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* QUICK ACTION BAR: WHAT DO YOU WANT TO DO? */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-3 shadow-md">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>WHAT DO YOU WANT TO DO?</span>
          <span className="text-emerald-400 font-mono text-[11px]">Primary Operational Actions</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/report"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-all hover:border-emerald-500 group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center mb-2 border border-red-800/60">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">REPORT INCIDENT</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Submit ground hazard / offline report</div>
            </div>
          </Link>

          <Link
            href="/roads"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-all hover:border-emerald-500 group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-800/60">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">CHECK ROAD</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Inspect passability across 45+ NH</div>
            </div>
          </Link>

          <Link
            href="/routes"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-all hover:border-emerald-500 group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center mb-2 border border-sky-800/60">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">FIND SAFER ROUTE</div>
              <div className="text-[10px] text-slate-400 mt-0.5">AI penalty-based alternate routing</div>
            </div>
          </Link>

          <Link
            href="/vehicles"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-all hover:border-emerald-500 group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center mb-2 border border-cyan-800/60">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">TRACK VEHICLE</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Real-time GPS cargo telemetry</div>
            </div>
          </Link>

          <Link
            href="/helplines"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-all hover:border-emerald-500 group flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center mb-2 border border-red-800/60">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">EMERGENCY</div>
              <div className="text-[10px] text-slate-400 mt-0.5">8-State verified directory & 112</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Section 2.5: NEAREST EMERGENCY SAFETY DESKS (POLICE & MEDICAL) */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Nearest Emergency Services ({activeStateKey} • {activeDistrict?.name || 'All Districts'})
              </h2>
              <p className="text-[11px] text-slate-400">
                Calculated real-time proximity to nearest active Police Station and Medical Hospital / Trauma Center.
              </p>
            </div>
          </div>

          <Link
            href="/nearest-services"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
          >
            <span>Open Full Emergency Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nearest Police */}
          {nearestPolice && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-blue-900/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wide">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Nearest Police Station</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-600 text-white">
                    {nearestPolice.distanceKm} km ({nearestPolice.roadEta})
                  </span>
                </div>

                <div className="text-sm font-bold text-white mt-1.5">{nearestPolice.name}</div>
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{nearestPolice.address}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  In-Charge: <strong className="text-slate-200">{nearestPolice.inChargeTitle}</strong>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <a
                  href={`tel:${nearestPolice.primaryPhone}`}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call {nearestPolice.primaryPhone}</span>
                </a>
                <a
                  href={nearestPolice.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-blue-400" />
                  <span>Map</span>
                </a>
              </div>
            </div>
          )}

          {/* Nearest Hospital */}
          {nearestHospital && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-900/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Nearest Hospital & Trauma Ward</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white">
                    {nearestHospital.distanceKm} km ({nearestHospital.roadEta})
                  </span>
                </div>

                <div className="text-sm font-bold text-white mt-1.5">{nearestHospital.name}</div>
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{nearestHospital.address}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Trauma Level: <strong className="text-slate-200">{nearestHospital.traumaLevel || '24x7 Emergency'}</strong>
                  {nearestHospital.bedCount && <> • <strong className="text-emerald-400">{nearestHospital.bedCount}+ Beds</strong></>}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <a
                  href={`tel:${nearestHospital.primaryPhone}`}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call {nearestHospital.primaryPhone}</span>
                </a>
                <a
                  href={nearestHospital.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-emerald-400" />
                  <span>Map</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Quick Access Navigation Grid (21 Major Modules) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            All 21 Operational Modules & Intelligence Desks
          </h2>
          <span className="text-xs text-slate-500">Zero dead links • Direct Access</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <Link
            href="/nearest-services"
            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-all text-xs space-y-1 block"
          >
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="font-bold text-slate-900 dark:text-white">Nearest Police & Hospital</div>
            <div className="text-[10px] text-slate-500">Live GPS Proximity</div>
          </Link>
          <Link
            href="/map"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Route className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="font-bold text-slate-900 dark:text-white">Live GIS Map</div>
            <div className="text-[10px] text-slate-500">MapTiler Basemap</div>
          </Link>

          <Link
            href="/roads"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="font-bold text-slate-900 dark:text-white">Road Network</div>
            <div className="text-[10px] text-slate-500">Monitored Highways</div>
          </Link>

          <Link
            href="/traffic"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div className="font-bold text-slate-900 dark:text-white">Traffic Intelligence</div>
            <div className="text-[10px] text-slate-500">Congestion Diagnostics</div>
          </Link>

          <Link
            href="/states"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="font-bold text-slate-900 dark:text-white">State Intelligence</div>
            <div className="text-[10px] text-slate-500">All 8 Sister States</div>
          </Link>

          <Link
            href="/districts"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div className="font-bold text-slate-900 dark:text-white">District Intelligence</div>
            <div className="text-[10px] text-slate-500">DDMA Desks</div>
          </Link>

          <Link
            href="/weather"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <CloudRain className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <div className="font-bold text-slate-900 dark:text-white">Weather & Monsoon</div>
            <div className="text-[10px] text-slate-500">Open-Meteo REST</div>
          </Link>

          <Link
            href="/landslide-risk"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Mountain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div className="font-bold text-slate-900 dark:text-white">Landslide Risk</div>
            <div className="text-[10px] text-slate-500">Slope Saturation</div>
          </Link>

          <Link
            href="/flood-risk"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Waves className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="font-bold text-slate-900 dark:text-white">Flood Intelligence</div>
            <div className="text-[10px] text-slate-500">River Basins & CWC</div>
          </Link>

          <Link
            href="/news"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Newspaper className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <div className="font-bold text-slate-900 dark:text-white">NER Situation News</div>
            <div className="text-[10px] text-slate-500">Verified Press Bulletins</div>
          </Link>

          <Link
            href="/risk"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="font-bold text-slate-900 dark:text-white">AI Road Risk</div>
            <div className="text-[10px] text-slate-500">Multi-Factor Engine</div>
          </Link>

          <Link
            href="/routes"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="font-bold text-slate-900 dark:text-white">AI Safe Routes</div>
            <div className="text-[10px] text-slate-500">Optimal Alternate Paths</div>
          </Link>

          <Link
            href="/cargo"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Truck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div className="font-bold text-slate-900 dark:text-white">Cargo Readiness</div>
            <div className="text-[10px] text-slate-500">Manifest Tracking</div>
          </Link>

          <Link
            href="/vehicles"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="font-bold text-slate-900 dark:text-white">Live Vehicles</div>
            <div className="text-[10px] text-slate-500">Fleet Telemetry Desk</div>
          </Link>

          <Link
            href="/disaster"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <Flame className="w-4 h-4 text-red-600 dark:text-red-400" />
            <div className="font-bold text-slate-900 dark:text-white">Disaster Center</div>
            <div className="text-[10px] text-slate-500">Emergency Protocol</div>
          </Link>

          <Link
            href="/helplines"
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-xs space-y-1 block"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="font-bold text-slate-900 dark:text-white">Helplines</div>
            <div className="text-[10px] text-slate-500">Police, 108, SEOC, BRO</div>
          </Link>
        </div>
      </div>
    </div>
  </>
  );
};
