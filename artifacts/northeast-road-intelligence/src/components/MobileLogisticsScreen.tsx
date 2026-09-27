import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { type CargoItem } from '../data/vehiclesAndCargo';
import {
  PackageCheck,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldAlert,
  Search,
  Radio,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useLocation } from 'wouter';

interface MobileLogisticsScreenProps {
  cargoList: CargoItem[];
}

export const MobileLogisticsScreen: React.FC<MobileLogisticsScreenProps> = ({ cargoList }) => {
  const { inspectCargo, rerouteCargo, demoMode, toggleDemoMode } = useOperating();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DELAYED' | 'CRITICAL'>('ACTIVE');
  const [selectedCargoDetail, setSelectedCargoDetail] = useState<CargoItem | null>(null);

  const activeDeliveries = cargoList.filter((c) => c.status === 'In Transit');
  const delayedDeliveries = cargoList.filter((c) => c.status === 'Delayed' || c.status === 'At risk');
  const criticalDeliveries = cargoList.filter((c) => c.priority === 'Critical');

  const displayedList =
    activeTab === 'ACTIVE'
      ? activeDeliveries
      : activeTab === 'DELAYED'
      ? delayedDeliveries
      : criticalDeliveries;

  return (
    <div className="space-y-3.5 max-w-lg mx-auto p-3.5 pb-24">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
            LOGISTICS LIFELINE
          </span>
          <h1 className="text-xl font-black text-white mt-0.5">
            Essential Deliveries
          </h1>
        </div>

        <button
          onClick={() => setLocation('/vehicles')}
          className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 touch-manipulation"
        >
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span>GPS Fleet</span>
        </button>
      </div>

      {/* 3 Tabs: ACTIVE | DELAYED | CRITICAL */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all touch-manipulation flex flex-col items-center ${
            activeTab === 'ACTIVE'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>ACTIVE</span>
          <span className="text-[10px] opacity-80">({activeDeliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DELAYED')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all touch-manipulation flex flex-col items-center ${
            activeTab === 'DELAYED'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>DELAYED</span>
          <span className="text-[10px] opacity-80">({delayedDeliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CRITICAL')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all touch-manipulation flex flex-col items-center ${
            activeTab === 'CRITICAL'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>CRITICAL</span>
          <span className="text-[10px] opacity-80">({criticalDeliveries.length})</span>
        </button>
      </div>

      {/* Deliveries List Cards */}
      <div className="space-y-2.5">
        {displayedList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No consignments currently in this category.
          </div>
        ) : (
          displayedList.map((cargo) => (
            <div
              key={cargo.id}
              onClick={() => setSelectedCargoDetail(cargo)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer touch-manipulation space-y-2.5"
            >
              {/* Card Title & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {cargo.category}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {cargo.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {cargo.origin} → {cargo.destination}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    cargo.status === 'In Transit'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {cargo.status}
                </span>
              </div>

              {/* Specific Metrics: Vehicle, ETA, Risk, Delay */}
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-mono">Vehicle</div>
                  <div className="text-[11px] font-bold font-mono text-slate-800 dark:text-slate-200 truncate">
                    {cargo.vehicleId}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-mono">ETA</div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {cargo.eta}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-mono">Risk</div>
                  <div className={`text-[11px] font-black ${
                    cargo.priority === 'Critical' || cargo.status === 'At risk' ? 'text-red-500' : 'text-emerald-500'
                  }`}>
                    {cargo.priority === 'Critical' ? 'HIGH' : 'LOW'}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-mono">Delay</div>
                  <div className="text-[11px] font-bold text-amber-500">
                    {cargo.status === 'Delayed' ? '+28 min' : '+0 min'}
                  </div>
                </div>
              </div>

              {/* Action Buttons: [TRACK] [SAFER ROUTE] */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inspectCargo(cargo.id);
                    setLocation('/vehicles');
                  }}
                  className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>TRACK</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inspectCargo(cargo.id);
                    setLocation('/routes');
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 touch-manipulation"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SAFER ROUTE</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cargo Intelligence Modal / Sheet */}
      {selectedCargoDetail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg space-y-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  DELIVERY INTELLIGENCE
                </span>
                <h3 className="text-base font-black text-white">
                  {selectedCargoDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCargoDetail(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Consignee:</span>
                  <span className="font-bold text-white">{selectedCargoDetail.consignee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Origin / Dest:</span>
                  <span className="font-bold text-white">{selectedCargoDetail.origin} → {selectedCargoDetail.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Contact:</span>
                  <span className="font-mono text-emerald-400">{selectedCargoDetail.contactNumber}</span>
                </div>
              </div>

              {selectedCargoDetail.alternateRouteAvailable && (
                <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Safer Detour Available</span>
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    {selectedCargoDetail.alternateRouteRecommendation}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  inspectCargo(selectedCargoDetail.id);
                  setSelectedCargoDetail(null);
                  setLocation('/vehicles');
                }}
                className="py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Open Live Telemetry
              </button>
              <button
                onClick={() => {
                  inspectCargo(selectedCargoDetail.id);
                  setSelectedCargoDetail(null);
                  setLocation('/routes');
                }}
                className="py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Compute Safest Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
