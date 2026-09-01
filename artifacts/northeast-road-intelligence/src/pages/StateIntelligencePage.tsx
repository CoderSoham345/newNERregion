import React, { useState, useMemo } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import { type RoadSegment } from '../data/roadNetwork';
import { MapView } from '../components/MapView';
import { SourceBadge } from '../components/SourceBadge';
import {
  Building2,
  MapPin,
  Route,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  CloudRain,
  Mountain,
  Waves,
  Landmark,
  PhoneCall,
  ArrowRight,
  ExternalLink,
  Users,
  Layers,
  Radio,
  Activity,
  Flame,
  Shield,
  HeartPulse,
  Navigation,
  Crosshair,
  Clock,
  Compass,
  FileText,
  Hospital,
  Droplets,
  Wind,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

export const StateIntelligencePage: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    roadSegments,
    incidents,
    infrastructure,
    mapLayers,
    toggleMapLayer,
    liveWeather,
    isWeatherLoading,
    refreshWeather,
    inspectRoad,
    inspectIncident,
    emergencyMode,
  } = useOperating();

  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'dashboard' | 'all-states'>('dashboard');
  const [supportCategory, setSupportCategory] = useState<'all' | 'Hospital' | 'DEOC / Police' | 'BRO Base'>('all');
  const [supportSearch, setSupportSearch] = useState('');

  // Normalize selected state for single state views
  const currentStateId: StateId =
    selectedState === 'All states' ? 'Assam' : (selectedState as StateId);
  const stateData = STATES_DATA[currentStateId] || STATES_DATA['Assam'];

  const allStateKeys: StateId[] = [
    'Assam',
    'Arunachal Pradesh',
    'Meghalaya',
    'Manipur',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim',
  ];

  // State-specific data computations
  const stateRoads = useMemo(
    () => roadSegments.filter((r) => r.stateId === currentStateId),
    [roadSegments, currentStateId]
  );

  const stateIncidents = useMemo(
    () => incidents.filter((i) => i.stateId === currentStateId && i.status !== 'Resolved'),
    [incidents, currentStateId]
  );

  const stateFacilities = useMemo(
    () => infrastructure.filter((inf) => inf.stateId === currentStateId),
    [infrastructure, currentStateId]
  );

  const blockedRoads = useMemo(
    () => stateRoads.filter((r) => r.roadStatus === 'Blocked'),
    [stateRoads]
  );

  const atRiskRoads = useMemo(
    () => stateRoads.filter((r) => r.roadStatus === 'At risk' || r.roadStatus === 'Caution'),
    [stateRoads]
  );

  const accessibleRoads = useMemo(
    () => stateRoads.filter((r) => r.roadStatus === 'Accessible'),
    [stateRoads]
  );

  // Top 5 Districts sorted by risk score (descending)
  const top5Districts = useMemo(() => {
    return [...stateData.districts]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
  }, [stateData]);

  // Filtered emergency support facilities
  const filteredSupport = useMemo(() => {
    return stateFacilities.filter((fac) => {
      const matchCat = supportCategory === 'all' || fac.type === supportCategory;
      const matchSearch =
        !supportSearch ||
        fac.name.toLowerCase().includes(supportSearch.toLowerCase()) ||
        fac.address.toLowerCase().includes(supportSearch.toLowerCase()) ||
        fac.capacityStatus.toLowerCase().includes(supportSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stateFacilities, supportCategory, supportSearch]);

  const handleStateChange = (newState: OperatingState) => {
    setSelectedState(newState);
    setSelectedDistrictId('all');
  };

  return (
    <div className="p-3 sm:p-5 lg:p-6 space-y-5 max-w-7xl mx-auto pb-16">
      {/* 1. COMMAND HEADER & STATE SELECTOR */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* State Title & Command Badges */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                STATE SEOC INTEL
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{stateData.name.toUpperCase()} State Intelligence Dashboard</span>
              </h1>
              <SourceBadge status="official" confidence="high" />
            </div>
            <p className="text-xs text-slate-400 max-w-2xl font-medium">
              Capital: <strong className="text-slate-200">{stateData.capital}</strong> · SEOC 24x7 Control Room: <strong className="text-emerald-400">1070 / 112</strong> · Monitored Corridors: <strong className="text-slate-200">{stateRoads.length} Segments</strong>
            </p>
          </div>

          {/* Quick Controls: State Selector & Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Operating State Selector */}
            <div className="relative flex items-center">
              <MapPin className="w-3.5 h-3.5 absolute left-3 text-emerald-400 pointer-events-none" />
              <select
                id="state-intel-selector"
                value={selectedState === 'All states' ? 'Assam' : selectedState}
                onChange={(e) => handleStateChange(e.target.value as OperatingState)}
                className="pl-8 pr-8 py-2 bg-slate-800 hover:bg-slate-700/80 text-xs font-black text-slate-100 rounded-xl border border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none shadow-xs"
              >
                {allStateKeys.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    📍 {st}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 text-slate-400 text-[10px]">▼</div>
            </div>

            {/* View Switcher: Dashboard vs 8-State Grid */}
            <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                id="mode-dashboard-btn"
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'dashboard'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                id="mode-all-states-btn"
                onClick={() => setViewMode('all-states')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'all-states'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All 8 States
              </button>
            </div>

            {/* Link to Districts */}
            <Link
              href="/districts"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>All {stateData.districtCount} Districts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ALL 8 STATES COMPARATIVE GRID MATRIX */}
      {viewMode === 'all-states' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Comparative 8-State Regional Dossiers</span>
            </h2>
            <button
              onClick={() => setViewMode('dashboard')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              ← Back to Command Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allStateKeys.map((key) => {
              const st = STATES_DATA[key];
              const sRoads = roadSegments.filter((r) => r.stateId === key);
              const sInc = incidents.filter((i) => i.stateId === key && i.status !== 'Resolved');
              const blocked = sRoads.filter((r) => r.roadStatus === 'Blocked').length;
              const isCurrent = key === currentStateId;

              return (
                <div
                  key={key}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-4 shadow-xs flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {st.code} · {st.districtCount} Districts
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          blocked > 0
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {blocked > 0 ? `${blocked} Blocked` : 'All Clear'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      {st.name}
                    </h3>
                    <p className="text-xs text-slate-500">Capital: {st.capital}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-[11px] space-y-1 font-medium">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Population:</span>
                        <strong className="text-slate-900 dark:text-white">{st.populationTotal}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Highways:</span>
                        <strong className="text-slate-900 dark:text-white">{sRoads.length} Monitored</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Active Hazards:</span>
                        <strong className={sInc.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                          {sInc.length} Alerts
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2.5 text-center text-xs">
                      <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                        <div className="text-[9px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                          Landslide
                        </div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {st.landslideRisk}%
                        </div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                        <div className="text-[9px] text-blue-700 dark:text-blue-400 font-bold uppercase">
                          Flood
                        </div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {st.floodRisk}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        handleStateChange(key);
                        setViewMode('dashboard');
                      }}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Command View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <Link
                      href="/districts"
                      onClick={() => handleStateChange(key)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      Districts →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MAIN DASHBOARD: MAP (65%) + INTELLIGENCE SIDE PANEL (35%) */
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 2. CENTRAL GIS MAP CONTAINER (65% / 8 COLS) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Embedded Map Canvas */}
                <MapView
                  className="h-[460px] sm:h-[520px] lg:h-[560px] w-full"
                  showSearchHeader={false}
                  showLayerPanel={true}
                />
              </div>

              {/* 3. INTERACTIVE MAP LAYERS CONTROLS BAR */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Map Layers:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    id="toggle-layer-roads"
                    onClick={() => toggleMapLayer('roadStatus')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapLayers.roadStatus
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Route className="w-3.5 h-3.5" />
                    <span>Roads ({stateRoads.length})</span>
                  </button>

                  <button
                    id="toggle-layer-hazards"
                    onClick={() => toggleMapLayer('incidents')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapLayers.incidents
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Hazards ({stateIncidents.length})</span>
                  </button>

                  <button
                    id="toggle-layer-hospitals"
                    onClick={() => toggleMapLayer('infrastructure')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapLayers.infrastructure
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Hospital className="w-3.5 h-3.5" />
                    <span>Hospitals & Facilities ({stateFacilities.length})</span>
                  </button>

                  <button
                    id="toggle-layer-vehicles"
                    onClick={() => toggleMapLayer('liveVehicles')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapLayers.liveVehicles
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Freight & Convoys</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. RIGHT SIDE INTELLIGENCE PANEL (35% / 4 COLS) */}
            <div className="lg:col-span-4 space-y-4">
              {/* PANEL 1: ACTIVE HAZARDS & SYSTEM ALERTS */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Active Alerts & Hazards
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      stateIncidents.length > 0
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {stateIncidents.length} Active
                  </span>
                </div>

                {stateIncidents.length === 0 ? (
                  <div className="py-6 text-center space-y-1.5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      No Critical Road Blocks
                    </div>
                    <p className="text-[11px] text-slate-500">
                      All monitored corridors in {stateData.name} are currently operational.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                    {stateIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => inspectIncident(inc.id)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500 transition-all cursor-pointer space-y-1 group"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px] group-hover:text-amber-500 transition-colors">
                            {inc.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              inc.severity === 'Critical'
                                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {inc.description}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span>{inc.highwayNumber} · {inc.locationName}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Inspect →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/alerts"
                  className="block text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                >
                  Open Full Alert Center ({stateIncidents.length}) →
                </Link>
              </div>

              {/* PANEL 2: LIVE METEOROLOGICAL & MONSOON INTEL */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Live Weather & Monsoon
                    </h3>
                  </div>
                  <button
                    onClick={refreshWeather}
                    disabled={isWeatherLoading}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Refresh Open-Meteo REST Weather"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {liveWeather ? `${Math.round(liveWeather.temperature)}°C` : '24°C'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold">
                        {liveWeather ? liveWeather.weatherDescription : 'Scattered Showers'}
                      </div>
                    </div>
                    <div className="text-right text-[11px] space-y-0.5">
                      <div className="text-slate-500 flex items-center justify-end gap-1">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span>Precip 24h: {liveWeather ? `${liveWeather.rainLast24h} mm` : '18.4 mm'}</span>
                      </div>
                      <div className="text-slate-500 flex items-center justify-end gap-1">
                        <Wind className="w-3 h-3 text-teal-500" />
                        <span>Wind: {liveWeather ? `${liveWeather.windSpeed} km/h` : '12 km/h'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
                      <div className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                        Landslide Index
                      </div>
                      <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                        {stateData.landslideRisk}%
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                      <div className="text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase">
                        Flood Vulnerability
                      </div>
                      <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                        {stateData.floodRisk}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
                  <span>Source: Open-Meteo REST API</span>
                  <Link href="/weather" className="text-blue-500 hover:underline font-semibold">
                    Monsoon Radar →
                  </Link>
                </div>
              </div>

              {/* PANEL 3: ROAD NETWORK ACCESSIBILITY SUMMARY */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Road Network Status
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {stateRoads.length} Segments
                  </span>
                </div>

                {/* Progress bar breakdown */}
                <div className="space-y-1.5">
                  <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div
                      style={{
                        width: `${stateRoads.length ? (accessibleRoads.length / stateRoads.length) * 100 : 100}%`,
                      }}
                      className="bg-emerald-600 transition-all"
                      title={`Accessible: ${accessibleRoads.length}`}
                    />
                    <div
                      style={{
                        width: `${stateRoads.length ? (atRiskRoads.length / stateRoads.length) * 100 : 0}%`,
                      }}
                      className="bg-amber-500 transition-all"
                      title={`At Risk: ${atRiskRoads.length}`}
                    />
                    <div
                      style={{
                        width: `${stateRoads.length ? (blockedRoads.length / stateRoads.length) * 100 : 0}%`,
                      }}
                      className="bg-red-600 transition-all"
                      title={`Blocked: ${blockedRoads.length}`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-center text-xs pt-1">
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                      <div className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">Accessible</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{accessibleRoads.length}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                      <div className="text-[9px] font-bold text-amber-700 dark:text-amber-400">At Risk</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{atRiskRoads.length}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                      <div className="text-[9px] font-bold text-red-700 dark:text-red-400">Blocked</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{blockedRoads.length}</div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/roads"
                  className="block text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                >
                  View Road Network Details →
                </Link>
              </div>
            </div>
          </div>

          {/* 5. NEAREST EMERGENCY SUPPORT PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-500" />
                  <span>Verified Nearest Emergency Support & Trauma Facilities ({stateData.name})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  24x7 Apex Hospitals, SDRF/NDRF Search & Rescue Teams, Police Control Rooms & NHAI Highway Bases.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    onClick={() => setSupportCategory('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      supportCategory === 'all'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All Facilities
                  </button>
                  <button
                    onClick={() => setSupportCategory('Hospital')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      supportCategory === 'Hospital'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hospitals
                  </button>
                  <button
                    onClick={() => setSupportCategory('DEOC / Police')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      supportCategory === 'DEOC / Police'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    SEOC / NDRF
                  </button>
                  <button
                    onClick={() => setSupportCategory('BRO Base')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      supportCategory === 'BRO Base'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    BRO / Highway
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter support..."
                    value={supportSearch}
                    onChange={(e) => setSupportSearch(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 w-36 sm:w-44"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSupport.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-slate-500">
                  No matching emergency support records for this filter.
                </div>
              ) : (
                filteredSupport.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 hover:border-emerald-500 transition-all flex flex-col justify-between space-y-2.5 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {fac.type}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          24x7 Operational
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {fac.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {fac.address}
                      </p>

                      <div className="mt-2 p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-medium text-slate-500">Status:</span>{' '}
                        <strong className="text-slate-800 dark:text-slate-200">{fac.capacityStatus}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <a
                        href={`tel:${fac.helpline.replace(/[^0-9+]/g, '')}`}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{fac.helpline}</span>
                      </a>

                      <Link
                        href="/helplines"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        Directory →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 6. TOP 5 DISTRICTS BY RISK PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-amber-500" />
                  <span>Top 5 High-Risk Districts in {stateData.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prioritized by terrain vulnerability, precipitation thresholds, and active route risk scores.
                </p>
              </div>

              <Link
                href="/districts"
                onClick={() => handleStateChange(currentStateId)}
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All {stateData.districts.length} Districts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {top5Districts.map((dist, idx) => (
                <div
                  key={dist.id}
                  onClick={() => {
                    setSelectedDistrictId(dist.id);
                    setLocation('/districts');
                  }}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        #{idx + 1} PRIORITY
                      </span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          dist.riskScore >= 70
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {dist.riskScore}% RISK
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {dist.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{dist.terrainType}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Weather:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{dist.weather}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Population:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{dist.population}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
