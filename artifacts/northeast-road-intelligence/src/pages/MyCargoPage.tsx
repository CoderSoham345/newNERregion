import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { Truck, Clock, CheckCircle2, AlertTriangle, Navigation, MapPin, Search, PlusCircle, ShieldAlert, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export const MyCargoPage: React.FC = () => {
  const { cargoList, rerouteCargo } = useOperating();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    eta: '4h 30m',
    riskLevel: 'Low' as const,
    reason: 'DEMO SIMULATION: Route clear of obstructions',
    consignee: 'Civil Hospital Silchar',
    consigneeContact: '+91 98640 55443',
  };

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
                  NER-INTEL
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Live Delivery Monitoring
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
        /* 2. No Active Orders State (Dark navy card matching requirements) */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-xl text-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
            <Truck className="w-10 h-10 opacity-70" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-900/50 px-3 py-1 rounded-full">
              Status: No Active Deliveries
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
              No Active Deliveries
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              There are currently no live delivery orders available for tracking.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Live tracking will become available when an authorised logistics order is assigned.
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
      ) : (
        /* 5. After Demo Delivery Is Created State */
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong>DEMO DATA:</strong> The tracking card below represents a simulated demo delivery for evaluation purposes only. Never represent simulated data as real logistics data.
              </div>
            </div>
            <button
              onClick={() => setDemoActive(false)}
              className="px-3 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-900 text-amber-100 font-bold shrink-0 cursor-pointer transition-colors"
            >
              Clear Demo
            </button>
          </div>

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

              <button
                onClick={handleRefresh}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer self-start sm:self-auto transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Refresh Tracking</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route</span>
                <div className="font-extrabold text-white text-sm">{demoCargoItem.origin} → {demoCargoItem.destination}</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle</span>
                <div className="font-mono font-extrabold text-emerald-400 text-sm">{demoCargoItem.vehicleId}</div>
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
            </div>

            {/* Simulated Progress Visual */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Guwahati Dispatch</span>
                <span className="text-emerald-400 font-bold">In Progress (45% Completed)</span>
                <span>Silchar Destination</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="h-full bg-emerald-500 rounded-full w-[45%] transition-all duration-500 animate-pulse" />
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
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">DEMO SIMULATION</span>
                <h3 className="text-lg font-extrabold text-white">Create Demo Delivery</h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-800/80 rounded-2xl space-y-2.5 border border-slate-700/70">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">From:</span>
                  <span className="font-bold text-white">Guwahati, Assam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">To:</span>
                  <span className="font-bold text-white">Silchar, Assam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Vehicle:</span>
                  <span className="font-mono font-bold text-emerald-400">NER-TRK-102</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="font-bold text-emerald-400">In Transit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Risk:</span>
                  <span className="font-bold text-emerald-400">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">ETA:</span>
                  <span className="font-bold text-white">4h 30m</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-300/90 leading-relaxed">
                Note: This creates a clearly labelled demo delivery for demonstration purposes and will not affect real-world transport operations.
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
                Create Demo Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCargoPage;
