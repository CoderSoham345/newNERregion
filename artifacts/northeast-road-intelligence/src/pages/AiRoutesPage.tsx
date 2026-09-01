import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useLocation } from 'wouter';
import { MapView } from '../components/MapView';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import {
  Navigation,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  Truck,
  CheckCircle2,
  Sparkles,
  MapPin,
  ChevronRight,
  TrendingDown,
  ShieldAlert,
  Play,
  RotateCcw,
  Check,
  Share2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const MAJOR_CITIES = [
  'Silchar (Assam)',
  'Hailakandi (Assam)',
  'Guwahati (Assam)',
  'Dibrugarh (Assam)',
  'Tezpur (Assam)',
  'Shillong (Meghalaya)',
  'Cherrapunjee (Meghalaya)',
  'Tura (Meghalaya)',
  'Gangtok (Sikkim)',
  'Siliguri (West Bengal / Gateway)',
  'Itanagar (Arunachal Pradesh)',
  'Tawang (Arunachal Pradesh)',
  'Pasighat (Arunachal Pradesh)',
  'Imphal (Manipur)',
  'Churachandpur (Manipur)',
  'Aizawl (Mizoram)',
  'Lunglei (Mizoram)',
  'Kohima (Nagaland)',
  'Dimapur (Nagaland)',
  'Agartala (Tripura)',
  'Udaipur (Tripura)',
];

const CITY_COORDS: Record<string, [number, number]> = {
  'Silchar (Assam)': [24.8333, 92.7789],
  'Hailakandi (Assam)': [24.6833, 92.5667],
  'Guwahati (Assam)': [26.1445, 91.7362],
  'Dibrugarh (Assam)': [27.4728, 94.9120],
  'Tezpur (Assam)': [26.6528, 92.7926],
  'Shillong (Meghalaya)': [25.5788, 91.8933],
  'Cherrapunjee (Meghalaya)': [25.2986, 91.7285],
  'Tura (Meghalaya)': [25.5141, 90.2173],
  'Gangtok (Sikkim)': [27.3389, 88.6065],
  'Siliguri (West Bengal / Gateway)': [26.7271, 88.3953],
  'Itanagar (Arunachal Pradesh)': [27.0844, 93.6053],
  'Tawang (Arunachal Pradesh)': [27.5861, 91.8601],
  'Pasighat (Arunachal Pradesh)': [28.0671, 95.3259],
  'Imphal (Manipur)': [24.8170, 93.9368],
  'Churachandpur (Manipur)': [24.3364, 93.6781],
  'Aizawl (Mizoram)': [23.7271, 92.7176],
  'Lunglei (Mizoram)': [22.8887, 92.7436],
  'Kohima (Nagaland)': [25.6747, 94.1100],
  'Dimapur (Nagaland)': [25.9063, 93.7256],
  'Agartala (Tripura)': [23.8315, 91.2868],
  'Udaipur (Tripura)': [23.5350, 91.4850],
};

export const AiRoutesPage: React.FC = () => {
  const { roadSegments, inspectRoad } = useOperating();
  const [, setLocation] = useLocation();

  const [origin, setOrigin] = useState('Silchar (Assam)');
  const [destination, setDestination] = useState('Hailakandi (Assam)');
  const [cargoType, setCargoType] = useState('Medical & Oxygen Supplies');
  const [vehicleWeight, setVehicleWeight] = useState('16-Ton Heavy Truck');
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(true);
  
  // Road Blockage & Rerouting Simulation State
  const [isRoadBlocked, setIsRoadBlocked] = useState(true);
  const [selectedRouteApplied, setSelectedRouteApplied] = useState(false);
  const [showTechnicalModal, setShowTechnicalModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
    }, 400);
  };

  const handleSimulateBlock = () => {
    setIsRoadBlocked(true);
    setSelectedRouteApplied(false);
  };

  const handleResetSimulation = () => {
    setIsRoadBlocked(false);
    setSelectedRouteApplied(false);
  };

  const handleUseRoute = () => {
    setSelectedRouteApplied(true);
    inspectRoad('seg-nh306-barak');
  };

  // Dynamic route stats based on origin & destination
  const isSilcharHailakandi = origin.includes('Silchar') && destination.includes('Hailakandi');

  // Compute precise route geometries for MapTiler integration
  const getCoords = (name: string): [number, number] => CITY_COORDS[name] || [26.0, 92.5];
  const originCoords = getCoords(origin);
  const destinationCoords = getCoords(destination);

  const generateGeom = (from: [number, number], to: [number, number], latOff = 0, lngOff = 0): [number, number][] => {
    return [
      from,
      [from[0] + (to[0] - from[0]) * 0.33 + latOff, from[1] + (to[1] - from[1]) * 0.33 + lngOff],
      [from[0] + (to[0] - from[0]) * 0.66 + latOff, from[1] + (to[1] - from[1]) * 0.66 + lngOff],
      to,
    ];
  };

  const originalCoords = generateGeom(originCoords, destinationCoords, 0, 0);
  const recommendedCoords = generateGeom(originCoords, destinationCoords, 0.04, -0.02);
  const altCoords = generateGeom(originCoords, destinationCoords, -0.04, 0.03);

  const originalRouteObj = {
    id: 'route-original',
    name: 'Original Direct Route (NH-306)',
    origin,
    destination,
    coordinates: originalCoords,
    status: 'blocked' as const,
    color: '#dc2626',
    distance: isSilcharHailakandi ? '82 km' : '110 km',
    duration: isSilcharHailakandi ? '2h 15m' : '2h 50m',
  };

  const recommendedRouteObj = {
    id: 'route-recommended',
    name: isSilcharHailakandi ? 'Route B (Via Badarpur & Kalacherra Bypass)' : 'Optimal Verified Corridor',
    origin,
    destination,
    coordinates: recommendedCoords,
    status: 'recommended' as const,
    color: '#16a34a',
    distance: isSilcharHailakandi ? '97 km' : '124 km',
    duration: isSilcharHailakandi ? '2h 42m' : '3h 10m',
  };

  const alternativeRouteObj = {
    id: 'route-alternative',
    name: 'Route C (Hill Ridge Track)',
    origin,
    destination,
    coordinates: altCoords,
    status: 'alternative' as const,
    color: '#ea580c',
    distance: isSilcharHailakandi ? '102 km' : '135 km',
    duration: isSilcharHailakandi ? '2h 55m' : '3h 35m',
  };

  const blockedSegs = isRoadBlocked
    ? [
        {
          coords: [
            (originCoords[0] + destinationCoords[0]) / 2,
            (originCoords[1] + destinationCoords[1]) / 2,
          ] as [number, number],
          title: 'NH-306 Panchgram Mudslide & Rockfall',
          road: 'NH-306 Km 42 (Impassable)',
        },
      ]
    : [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header & Simulation Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
              SAFE ROUTE ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider animate-pulse">
              SIMULATION MODE ACTIVE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            UttarPURV AI Safe Route Recommendation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Decision-first routing. Select origin and destination to instantly view ranked safe routes, weather/landslide risk avoidance, and ETA trade-offs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateBlock}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isRoadBlocked
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isRoadBlocked ? '🚨 ROAD BLOCKED SIMULATION' : 'SIMULATE ROAD BLOCK'}</span>
          </button>

          <button
            onClick={handleResetSimulation}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Section — Simple Input Form */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              FROM (Origin)
            </label>
            <select
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setHasCalculated(true);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              {MAJOR_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              TO (Destination)
            </label>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setHasCalculated(true);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              {MAJOR_CITIES.filter((c) => c !== origin).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cargo (Optional)
            </label>
            <select
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="Medical & Oxygen Supplies">Critical Medicine & Insulin</option>
              <option value="Petroleum & Fuel Tankers">Petroleum & Fuel Tankers</option>
              <option value="FCI Food Grain & Rations">FCI Food Grain & Rations</option>
              <option value="General Commercial Goods">General Commercial Freight</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vehicle (Optional)
            </label>
            <select
              value={vehicleWeight}
              onChange={(e) => setVehicleWeight(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="16-Ton Heavy Truck">16-Ton Multi-Axle Truck</option>
              <option value="28-Ton Heavy Articulated">28-Ton Heavy Articulated</option>
              <option value="Emergency Ambulance (4x4)">Emergency Ambulance (4x4)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>FIND SAFEST ROUTE</span>
            </button>
          </div>
        </form>
      </div>

      {/* Blocked Road Banner Alert (If Active) */}
      {isRoadBlocked && isSilcharHailakandi && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-700 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-200">
                🚨 ROUTE BLOCKED — ORIGINAL CORRIDOR UNAVAILABLE
              </div>
              <div className="text-base font-extrabold">
                NH-306 Panchgram Segment is blocked by 400m³ mudslide.
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                AI Routing Engine has instantly recalculated and verified a safer alternative via Badarpur &ndash; Kalacherra Bypass.
              </p>
            </div>
          </div>

          <button
            onClick={handleUseRoute}
            className="px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl font-black text-xs uppercase tracking-wider shadow-md shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            {selectedRouteApplied ? '✓ SAFER ROUTE APPLIED' : 'USE SAFER ROUTE'}
          </button>
        </div>
      )}

      {/* Main Decision-First Route Recommendation Cards */}
      {hasCalculated && (
        <div className="space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ranked Route Options ({origin.split(' ')[0]} &rarr; {destination.split(' ')[0]}):
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 1. RECOMMENDED ROUTE */}
            <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 shadow-lg ${
              isRoadBlocked && isSilcharHailakandi
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500'
                : 'bg-white dark:bg-slate-900 border-emerald-500'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>🟢 RECOMMENDED ROUTE</span>
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isSilcharHailakandi ? 'Route B (Via Badarpur &ndash; Kalacherra Bypass)' : `Optimal Verified Corridor (${origin.split(' ')[0]} &ndash; ${destination.split(' ')[0]})`}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-xl">
                  LOW RISK (18%)
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Distance</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {isSilcharHailakandi ? '97 km' : '124 km'}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Estimated ETA</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isSilcharHailakandi ? '2h 42m' : '3h 10m'}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Additional Delay</div>
                  <div className="text-lg font-black text-amber-600 mt-0.5">
                    {isSilcharHailakandi ? '+27 min' : '+15 min'}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Risk Rating</div>
                  <div className="text-base font-black text-emerald-600 mt-0.5">LOW</div>
                </div>
              </div>

              {/* Reason */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  <strong>Why recommended?</strong> Avoids blocked/high-risk corridor and minimizes landslide slope exposure while keeping delay under 30 minutes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleUseRoute}
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{selectedRouteApplied ? '✓ ROUTE SELECTED & APPLIED' : 'USE THIS ROUTE'}</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('map-view-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>VIEW FULL ROUTE</span>
                </button>
              </div>
            </div>

            {/* Human-Readable Route Journey & Road-by-Road Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-600">
                    COMPLETE ROAD-BY-ROAD JOURNEY
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {origin.split(' ')[0]} &rarr; {destination.split(' ')[0]} (Via Verified Corridor)
                  </h3>
                </div>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold rounded-xl">
                  4 Route Legs &middot; 97 km Total
                </span>
              </div>

              {/* Waypoints Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Major Waypoints in Order:
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                    <MapPin className="w-3.5 h-3.5" /> {origin.split(' ')[0]}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">Badarpur</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">Kalacherra Bypass</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">Panchgram Ridge</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="flex items-center gap-1 text-blue-600 font-extrabold">
                    <MapPin className="w-3.5 h-3.5" /> {destination.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Road-by-Road Legs Table / Cards */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Route Legs & Segment Status:
                </div>

                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black rounded-xl">
                        LEG 1
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">NH-37 / NH-6 &middot; {origin.split(' ')[0]} &rarr; Badarpur</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Dual-lane paved highway, stable terrain, clear visibility.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900 dark:text-white">32 km &middot; 42 min</div>
                        <div className="text-[10px] text-emerald-600 font-bold">🟢 OPEN</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black rounded-xl">
                        LEG 2
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">Badarpur &ndash; Kalacherra Bypass Link</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Bypasses NH-306 mudslide zone. Verified bridge weight load 40T.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900 dark:text-white">45 km &middot; 1h 10m</div>
                        <div className="text-[10px] text-emerald-600 font-bold">🟢 OPEN &middot; RECOMMENDED</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black rounded-xl">
                        LEG 3
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">Kalacherra &rarr; {destination.split(' ')[0]}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Final approach corridor through valley floor. Normal traffic flow.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900 dark:text-white">20 km &middot; 50 min</div>
                        <div className="text-[10px] text-emerald-600 font-bold">🟢 OPEN</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why the route changed explanation */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1.5">
                <div className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Why the route changed from original:</span>
                </div>
                <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                  Original direct path via NH-306 Panchgram is blocked at Km 42 by a 400m³ mudslide. The AI routing engine diverted traffic at the Badarpur interchange northward along Kalacherra Bypass (+27 min net delay, 100% safe transit).
                </p>
              </div>
            </div>

            {/* 2. ALTERNATIVE ROUTE */}
            <div className="p-5 rounded-3xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    🟡 ALTERNATIVE
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Route C (Via Hill Ridge Track)
                  </span>
                </div>
                <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 rounded-lg">
                  MODERATE RISK
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Distance</div>
                  <div className="font-bold text-slate-900 dark:text-white">102 km</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">ETA</div>
                  <div className="font-bold text-slate-900 dark:text-white">2h 55m</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Delay</div>
                  <div className="font-bold text-amber-600">+40 min</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">Longer but available</span>
                  <button
                    onClick={() => alert('Alternative Route C selected for preview.')}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white font-bold rounded-lg text-[11px] cursor-pointer"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            </div>

            {/* 3. AVOID / BLOCKED ROUTE */}
            <div className="p-5 rounded-3xl border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    🔴 AVOID / BLOCKED
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Route A (NH-306 Direct Corridor)
                  </span>
                </div>
                <span className="text-xs font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-2.5 py-1 rounded-lg">
                  CRITICAL / BLOCKED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs items-center">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Distance</div>
                  <div className="font-bold text-slate-900 dark:text-white">82 km (Shortest)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Status</div>
                  <div className="font-bold text-red-600">IMPASSABLE</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Reason</div>
                  <div className="font-bold text-red-600">Mudslide & Rockfall</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] text-red-700 dark:text-red-300 font-semibold">Active Closure</span>
                  <button
                    onClick={() => setShowTechnicalModal(true)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-bold rounded-lg text-[11px] cursor-pointer"
                  >
                    WHY?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Technical Layer: [ WHY THIS ROUTE? ] */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowTechnicalModal(!showTechnicalModal)}>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Why this route? [ AI Technical Analysis ]
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click to inspect terrain slope exposure, IMD rainfall index, CWC river flood thresholds, and bridge load verifications.
              </p>
            </div>
          </div>

          <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {showTechnicalModal ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showTechnicalModal && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Landslide Exposure</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Avoids high-susceptibility shale rock formations in Jaintia Hills. Recommended route passes through stable gneiss ridge.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Rainfall & Flood Index</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  IMD Doppler radar records 18mm rainfall along Route B vs 85mm in southern foothills. CWC river gauges are well below warning level.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Vehicle & Cargo Match</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Configured for 16-Ton Multi-Axle Truck carrying Medical Supplies. All 7 bridge crossings verified for &gt;40 ton load capacity.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                  AI Routing Confidence Score: 98.4%
                </span>
                <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Multi-factor optimization weights safety and accessibility as primary objective over minimum distance.
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(
                    `[UttarPURV Technical Audit] Route B Confidence: 98.4%. Avoids NH-306 mudslide. Rain 18mm, stable ridge.`
                  );
                  alert('Technical audit summary copied to clipboard.');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Copy Audit Log
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map & Legend */}
      <div id="map-view-section" className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Interactive GIS Map &mdash; Recommended vs Blocked Segments</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            🔴 Red: Blocked | 🟢 Green: Recommended Safe Route | 🟡 Yellow: Alternative
          </span>
        </div>
        <MapView
          className="h-[460px] w-full"
          recommendedRoute={recommendedRouteObj}
          originalRoute={isRoadBlocked ? originalRouteObj : null}
          alternativeRoutes={[alternativeRouteObj]}
          blockedSegments={blockedSegs}
          originCoords={originCoords}
          destinationCoords={destinationCoords}
          originName={origin.split(' ')[0]}
          destinationName={destination.split(' ')[0]}
        />
      </div>

      <RoadIntelligenceDrawer />
    </div>
  );
};


