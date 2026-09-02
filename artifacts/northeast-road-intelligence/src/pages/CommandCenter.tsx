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
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { SourceBadge } from '../components/SourceBadge';
import { AndroidHomeScreen } from '../components/AndroidHomeScreen';
import { MapView } from '../components/MapView';
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

  return (
    <>
      {/* Mobile-first Android Dedicated Home Screen for screen widths under md (768px) */}
      <div className="block md:hidden">
        <AndroidHomeScreen />
      </div>

      {/* Desktop Command Center Layout matching Reference Screenshot */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-16">
        
        {/* 1. TOP OFFICER GREETING & DATE TIME HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Good morning, N. Sangma 👋</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-semibold">Field Officer</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span>Tuesday, 02 September 2026</span>
            <span className="text-slate-400">•</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{istTime}</strong>
          </div>
        </div>

        {/* 2. KPI ROW (4 Compact Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Critical Incidents */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Critical Incidents</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">12</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>↑ 2 from yesterday</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          {/* Blocked Roads */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Blocked Roads</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">18</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>↑ 3 from yesterday</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Route className="w-5 h-5" />
            </div>
          </div>

          {/* At-Risk Deliveries */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">At-Risk Deliveries</div>
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">42</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>↑ 5 from yesterday</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          {/* Vehicles in Transit */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vehicles in Transit</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">236</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>↑ 18 from yesterday</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>

        </div>

        {/* 3. QUICK ACTION SECTION: WHAT DO YOU WANT TO DO? */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            WHAT DO YOU WANT TO DO?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <Link
              href="/routes"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Find Safe Route</div>
                <div className="text-[10px] text-slate-500 truncate">AI-powered routing</div>
              </div>
            </Link>

            <Link
              href="/report"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Report Incident</div>
                <div className="text-[10px] text-slate-500 truncate">Report & alert team</div>
              </div>
            </Link>

            <Link
              href="/vehicles"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Track Delivery</div>
                <div className="text-[10px] text-slate-500 truncate">Track in real-time</div>
              </div>
            </Link>

            <Link
              href="/helplines"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Emergency Help</div>
                <div className="text-[10px] text-slate-500 truncate">Get instant help</div>
              </div>
            </Link>

          </div>
        </div>

        {/* 4. LIVE NER MAP & RIGHT-SIDE ALERT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Live NER Map */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">LIVE NER MAP</h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">Updated 2 min ago</span>
                <Link
                  href="/map"
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Map Component */}
            <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapView className="h-full w-full" />
            </div>
          </div>

          {/* Right 1 Col: What Requires Attention */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">WHAT REQUIRES ATTENTION</h2>
              <Link href="/alerts" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {/* Alert 1 */}
              <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white">CRITICAL</span>
                  <span className="text-[10px] text-slate-400">10 min ago</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">NH-6 Blocked</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">Landslide at Jatinga, Assam</div>
                </div>
                <div className="text-right">
                  <Link href="/roads" className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline">
                    View →
                  </Link>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-slate-950">HIGH</span>
                  <span className="text-[10px] text-slate-400">25 min ago</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Flood Warning</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">Barak Valley Districts</div>
                </div>
                <div className="text-right">
                  <Link href="/flood-risk" className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline">
                    View →
                  </Link>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">MODERATE</span>
                  <span className="text-[10px] text-slate-400">1 hr ago</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Heavy Rainfall</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">West Khasi Hills, Meghalaya</div>
                </div>
                <div className="text-right">
                  <Link href="/weather" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    View →
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 5. OPERATIONAL PIPELINE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">OPERATIONAL PIPELINE</h2>
            <Link href="/governance" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { num: '01', title: 'Detect', val: '12 new alerts', icon: ShieldAlert, color: 'text-red-500' },
              { num: '02', title: 'Predict', val: 'High risk in 4 districts', icon: CloudRain, color: 'text-amber-500' },
              { num: '03', title: 'Explain', val: 'AI risk analysis ready', icon: Bot, color: 'text-emerald-500' },
              { num: '04', title: 'Alert', val: 'CAP & SEOC broadcast', icon: Radio, color: 'text-blue-500' },
              { num: '05', title: 'Route', val: '8 alternate routes', icon: Navigation, color: 'text-indigo-500' },
              { num: '06', title: 'Respond', val: 'Teams notified', icon: ShieldCheck, color: 'text-emerald-500' },
              { num: '07', title: 'Track', val: 'Convoy GPS monitoring', icon: Truck, color: 'text-cyan-500' },
              { num: '08', title: 'Resolve', val: '5 incidents resolved', icon: CheckCircle2, color: 'text-emerald-600' },
            ].map((p) => {
              const IconComp = p.icon;
              return (
                <div key={p.num} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {p.num}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.val}</div>
                    </div>
                  </div>
                  <IconComp className={`w-4 h-4 shrink-0 ${p.color}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. BOTTOM DATA ROW (Active Incidents, At-Risk Deliveries, Weather & Risk Overview) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Incidents Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">ACTIVE INCIDENTS</h2>
              <Link href="/disaster" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 text-[10px]">
                    <th className="pb-2 font-bold">Incident</th>
                    <th className="pb-2 font-bold">Location</th>
                    <th className="pb-2 font-bold">Severity</th>
                    <th className="pb-2 font-bold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">Landslide</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Jatinga, Assam (NH-6)</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">Critical</span></td>
                    <td className="py-2.5 text-right text-slate-400">10 min ago</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">Road Washout</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Karimganj, Assam (NH-37)</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">High</span></td>
                    <td className="py-2.5 text-right text-slate-400">25 min ago</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">Bridge Damage</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">West Jaintia Hills, Meghalaya</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">Moderate</span></td>
                    <td className="py-2.5 text-right text-slate-400">1 hr ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* At-Risk Deliveries Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">AT-RISK DELIVERIES</h2>
              <Link href="/cargo" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 text-[10px]">
                    <th className="pb-2 font-bold">Delivery ID</th>
                    <th className="pb-2 font-bold">Route</th>
                    <th className="pb-2 font-bold">Risk</th>
                    <th className="pb-2 font-bold text-right">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">DLV-7821</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Guwahati → Silchar</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">High</span></td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">3h 45m</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">DLV-7822</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Silchar → Imphal</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">Moderate</span></td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">5h 10m</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white font-mono">DLV-7823</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Aizawl → Guwahati</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">High</span></td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">4h 30m</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Weather & Risk Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">WEATHER & RISK OVERVIEW</h2>
                <Link href="/weather" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">Guwahati, Assam</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">28°C</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Light Rain</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Feels like 31°C</div>
                </div>
                <CloudRain className="w-12 h-12 text-sky-500" />
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rainfall (24h)</span>
                <span className="font-bold text-slate-900 dark:text-white">68 mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Flood Risk</span>
                <span className="font-bold text-red-600 dark:text-red-400">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Landslide Risk</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Moderate</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Road Accessibility</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Impacted</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};
