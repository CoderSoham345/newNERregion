import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { Truck, Clock, CheckCircle2, AlertTriangle, Navigation, MapPin, Search, PlusCircle, ShieldAlert, RefreshCw, ChevronRight, Shield } from 'lucide-react';
import { Link } from 'wouter';
import { MapView } from '../components/MapView';

export const MyCargoPage: React.FC = () => {
  const { userProfile } = useOperating();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isCitizen = userProfile?.role === 'Citizen / Viewer' || userProfile?.role?.toLowerCase().includes('citizen');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const demoCargoItem = {
    id: 'DLV-DEMO-7821',
    name: 'Emergency Relief Medical Supply Batch',
    category: 'Medicines' as const,
    origin: 'Guwahati, Assam',
    destination: 'Silchar, Assam',
    priority: 'High' as const,
    status: 'In Transit' as const,
    vehicleId: 'NER-TRK-102',
    driver: 'Demo Driver',
    eta: '4h 30m',
    riskLevel: 'Low' as const,
    consignee: 'Civil Hospital Silchar',
    consigneeContact: '+91 98640 55443',
  };

  // Valid route coordinates for demo tracking map
  const demoOriginCoords: [number, number] = [26.1445, 91.7362]; // Guwahati
  const demoDestCoords: [number, number] = [24.8333, 92.7789]; // Silchar
  const demoRouteCoords: [number, number][] = [
    [26.1445, 91.7362],
    [26.0500, 92.0000],
    [25.6000, 92.8000],
    [24.8333, 92.7789],
  ];

  function isValidCoordinate(lat: unknown, lng: unknown): boolean {
    const latitude = Number(lat);
    const longitude = Number(lng);

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  if (isCitizen) {
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">Track Delivery</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-xl text-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 bg-amber-950/60 border border-amber-900/50 px-3 py-1 rounded-full">
              Officer-Only Feature
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Access Restricted to Officers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Track Delivery is reserved for authorised government logistics officers and emergency dispatchers. Citizens can track their submitted road, flood, and landslide reports under My Reports.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/reports/track"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/20 transition-colors"
            >
              Go to My Reports
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header & Breadcrumb */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">Track Delivery</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Track Delivery</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  OFFICER PORTAL
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor assigned logistics movements across the NER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!demoActive && (
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Demo Delivery</span>
              </button>
            )}
            <Link
              href="/cargo"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              View Logistics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!demoActive ? (
        /* 2. No Active Orders State (Default empty state — NO Leaflet map mounted!) */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-xl text-slate-100">
            <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <Truck className="w-10 h-10 opacity-70" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-900/50 px-3 py-1 rounded-full">
                Status: No Active Deliveries
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                No Active Deliveries
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                There are currently no live delivery orders assigned to you for tracking.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tracking information will appear here when an authorised logistics movement is assigned.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/20 cursor-pointer transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Demo Delivery</span>
              </button>
              <Link
                href="/cargo"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer transition-colors"
              >
                View Logistics
              </Link>
            </div>
          </div>

          {/* Recent Delivery Activity Section */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Delivery Activity</h3>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-500">
              No recent delivery activity.
            </div>
          </div>
        </div>
      ) : (
        /* 5. After Demo Delivery Is Created State (Map mounts only here with valid coordinates) */
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-black text-sm text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {demoCargoItem.id}
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wide">
                    DEMO DATA
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ● In Transit
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {demoCargoItem.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>Refresh Tracking</span>
                </button>
                <button
                  onClick={() => setDemoActive(false)}
                  className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 font-bold text-xs border border-red-900/50 cursor-pointer transition-colors"
                >
                  End Demo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route</span>
                <div className="font-extrabold text-white text-sm">{demoCargoItem.origin} → {demoCargoItem.destination}</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle & Driver</span>
                <div className="font-mono font-extrabold text-emerald-400 text-xs">{demoCargoItem.vehicleId}</div>
                <div className="text-[11px] text-slate-300">{demoCargoItem.driver}</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Level</span>
                <div className="font-extrabold text-emerald-400 text-sm">{demoCargoItem.riskLevel} Risk (Optimal)</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Arrival (ETA)</span>
                <div className="font-extrabold text-white text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{demoCargoItem.eta}</span>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                <div className="font-extrabold text-white text-sm">68% Completed</div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 rounded-full w-[68%]" />
                </div>
              </div>
            </div>

            {/* Route Map Component (Only rendered after Start Demo Tracking with valid numeric coordinates) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>ROUTE MAP (Guwahati ── 🚚 ── Silchar)</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">Valid route coordinates only</span>
              </div>

              <div className="border border-slate-700 rounded-2xl overflow-hidden shadow-inner">
                {isValidCoordinate(demoOriginCoords[0], demoOriginCoords[1]) && isValidCoordinate(demoDestCoords[0], demoDestCoords[1]) ? (
                  <MapView
                    className="h-[350px] w-full"
                    originCoords={demoOriginCoords}
                    destinationCoords={demoDestCoords}
                    recommendedRoute={{
                      id: 'rec-demo',
                      name: 'Guwahati - Silchar Express Corridor',
                      origin: 'Guwahati, Assam',
                      destination: 'Silchar, Assam',
                      status: 'recommended',
                      color: '#16a34a',
                      distance: '315 km',
                      duration: '4h 30m',
                      coordinates: demoRouteCoords,
                    }}
                  />
                ) : (
                  <div className="h-[350px] w-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Tracking location unavailable</h4>
                      <p className="text-xs text-slate-400 mt-1">Coordinate data is invalid or missing.</p>
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>LAST UPDATE: Demo tracking data • Updated just now</span>
                <span className="font-mono text-emerald-400">Status: Verified Secure</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Create Demo Delivery Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">CREATE DEMO DELIVERY</span>
                <h3 className="text-lg font-extrabold text-white">Simulate Logistics Order</h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-800/80 rounded-2xl space-y-2.5 border border-slate-700/70 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Origin:</span>
                  <span className="font-bold text-white">Guwahati, Assam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-white">Silchar, Assam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-mono font-bold text-emerald-400">NER-TRK-102</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-bold text-white">Demo Driver</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Priority:</span>
                  <span className="font-bold text-emerald-400">Essential Supplies</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400">In Transit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Risk:</span>
                  <span className="font-bold text-emerald-400">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ETA:</span>
                  <span className="font-bold text-white">4h 30m</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-300/90 leading-relaxed">
                Note: Starting demo tracking will mount the route map using valid numeric coordinates for evaluation purposes.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDemoActive(true);
                  setShowDemoModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                Start Demo Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCargoPage;

