import React, { useState, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  Landmark,
  MapPin,
  PhoneCall,
  CloudRain,
  Mountain,
  Waves,
  Route,
  Activity,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import { Link } from 'wouter';
import { SourceBadge } from '../components/SourceBadge';

export const DistrictIntelligencePage: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    roadSegments,
    incidents,
    cargoList,
    liveWeather,
  } = useOperating();

  const [searchDistrict, setSearchDistrict] = useState('');

  // Dynamic IST clock
  const [istTime, setIstTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stateId: StateId = selectedState === 'All states' ? 'Meghalaya' : (selectedState as StateId);
  const stateData = STATES_DATA[stateId] || STATES_DATA['Meghalaya'];

  const allDistricts = stateData.districts;
  const activeDistrict =
    allDistricts.find((d) => d.id === selectedDistrictId) || allDistricts[0];

  const filteredDistricts = allDistricts.filter(
    (d) => d.name.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  const districtIncidents = incidents.filter(
    (i) => i.districtName === activeDistrict.name || i.stateId === stateId
  );

  const districtRoads = roadSegments.filter(
    (r) => r.stateId === stateId
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              District Disaster Management Authority (DDMA) Operations Desks
            </h1>
            <SourceBadge status="official" confidence="high" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            SIH26002 Granular District-Level Diagnostics • Real-Time Weather Sensors, Landslide Slope Indices, Active Incident Feeds, and Localized Clearance Helplines.
          </p>
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-bold hidden sm:inline">Operating State:</label>
          <select
            value={selectedState === 'All states' ? 'Meghalaya' : selectedState}
            onChange={(e) => {
              const val = e.target.value as OperatingState;
              setSelectedState(val);
              if (val !== 'All states' && STATES_DATA[val]?.districts.length > 0) {
                setSelectedDistrictId(STATES_DATA[val].districts[0].id);
              }
            }}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ALL_STATES.filter((s) => s !== 'All states').map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTIVE DISTRICT DOSSIER CARD */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                ACTIVE DISTRICT CONSOLE
              </span>
              <span className="text-xs font-bold text-slate-500">
                {stateData.name} State • Time: <strong className="text-emerald-600 dark:text-emerald-400">{istTime}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeDistrict.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              District Center: <strong className="text-slate-800 dark:text-slate-200">{activeDistrict.center[0].toFixed(2)}°N, {activeDistrict.center[1].toFixed(2)}°E</strong> • Terrain: <strong className="text-slate-800 dark:text-slate-200">{activeDistrict.terrainType}</strong> • Pop (2011 Census): {activeDistrict.population}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                DDMA Direct Emergency Line
              </div>
              <a
                href="tel:1077"
                className="text-base font-black text-emerald-700 dark:text-emerald-400 hover:underline font-mono"
              >
                1077 / 112
              </a>
            </div>
          </div>
        </div>

        {/* Granular District Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Temperature & Weather */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Live Weather</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {activeDistrict.temperature}°C
            </div>
            <div className="text-[10px] text-slate-500 truncate">{activeDistrict.weather}</div>
          </div>

          {/* Rainfall */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase">24h Rainfall</div>
            <div className="text-lg font-black text-sky-600 dark:text-sky-400 mt-0.5">
              {activeDistrict.rainfall} mm
            </div>
            <div className="text-[10px] text-slate-500">Open-Meteo REST</div>
          </div>

          {/* Landslide Risk */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Landslide Saturation</div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {activeDistrict.riskScore}%
            </div>
            <div className="text-[10px] text-slate-500">GSI Susceptibility</div>
          </div>

          {/* Flood Vulnerability */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Flood Index</div>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {stateData.floodRisk}%
            </div>
            <div className="text-[10px] text-slate-500">River Basin Watch</div>
          </div>

          {/* Road Corridors At Risk */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Affected Roads</div>
            <div className="text-lg font-black text-red-600 dark:text-red-400 mt-0.5">
              {activeDistrict.atRiskRoadCount} Sectors
            </div>
            <div className="text-[10px] text-slate-500">Traffic: {activeDistrict.trafficStatus}</div>
          </div>

          {/* Cargo Movements */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Cargo</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {activeDistrict.cargoCount} Fleets
            </div>
            <div className="text-[10px] text-slate-500">In Transit</div>
          </div>
        </div>

        {/* Nearby Highway Network & Local Alert Bulletins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
              <Route className="w-4 h-4 text-emerald-600" />
              <span>Monitored Arterial Corridors in {activeDistrict.name} ({activeDistrict.highwayCount} Highways)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {districtRoads.slice(0, 4).map((r) => (
                <span
                  key={r.id}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {r.highwayNumber}: {r.startLocation} → {r.endLocation}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Continuous live GPS and Doppler radar coverage enabled for all listed arterial corridors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>District Incident & Road Advisory Feed</span>
            </div>
            {districtIncidents.length > 0 ? (
              <div className="space-y-1.5">
                {districtIncidents.slice(0, 2).map((inc) => (
                  <div key={inc.id} className="text-xs text-slate-700 dark:text-slate-300">
                    • <strong>{inc.title}</strong> — {inc.highwayNumber} ({inc.status})
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                No active blockages reported by DDMA in this sector.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALL DISTRICTS LIST IN STATE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              All Districts in {stateData.name} ({allDistricts.length})
            </h3>
            <p className="text-xs text-slate-500">Click any district to switch active telemetry console</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter district or HQ..."
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDistricts.map((d) => {
            const isSelected = d.id === activeDistrict.id;

            return (
              <div
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {d.terrainType}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {d.riskScore}% Saturation
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {d.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{d.roadCount} road sectors • {d.highwayCount} highways</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                    DDMA 1077
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {isSelected ? '✓ ACTIVE' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
