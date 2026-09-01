import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import {
  Truck,
  PhoneCall,
  Navigation,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { useLocation } from 'wouter';

export const MobileVehicleTrackingScreen: React.FC = () => {
  const { vehicles, inspectVehicle, selectedVehicle, demoMode, toggleDemoMode } = useOperating();
  const [, setLocation] = useLocation();
  const [activeVehicleId, setActiveVehicleId] = useState<string>(vehicles[0]?.id || 'VEH-01');

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  return (
    <div className="space-y-4 pb-20 px-3 pt-2">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-400">
              FIELD FLEET TELEMETRY
            </span>
          </div>
          <h1 className="text-base font-black text-white mt-0.5">Live Vehicle Tracking</h1>
        </div>

        <button
          onClick={toggleDemoMode}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 touch-manipulation ${
            demoMode
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>{demoMode ? 'Simulating' : 'Simulate'}</span>
        </button>
      </div>

      {/* Map View Frame */}
      <div className="h-56 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <MapView className="h-full w-full" />
      </div>

      {/* Vehicle Selector Carousel */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 px-1">
          Active Transponder Units ({vehicles.length})
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {vehicles.map((v) => {
            const isSelected = v.id === activeVehicleId;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setActiveVehicleId(v.id);
                  inspectVehicle(v.id);
                }}
                className={`shrink-0 px-3 py-2 rounded-xl text-left border transition-all active:scale-95 touch-manipulation ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs">{v.registrationNumber}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      v.status === 'In Transit' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="text-[10px] opacity-90 truncate max-w-[130px]">
                  {v.cargoDescription || v.type}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Vehicle Details Card */}
      {activeVehicle && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono font-black text-xs">
                  {activeVehicle.registrationNumber}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {activeVehicle.type}
                </span>
              </div>
              <h3 className="text-sm font-black mt-1">
                {activeVehicle.cargoDescription || 'Essential Consignment'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Driver: {activeVehicle.driverName} ({activeVehicle.contactNumber})
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono">SPEED</div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
                {activeVehicle.speedKmH} km/h
              </div>
            </div>
          </div>

          {/* Key Metrics: ETA, Status, Destination */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Destination</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {activeVehicle.destination}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Status</div>
              <div className={`text-xs font-black ${
                activeVehicle.status === 'Delayed by Incident' ? 'text-red-500' : 'text-emerald-500'
              }`}>
                {activeVehicle.status.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">ETA</div>
              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {activeVehicle.eta}
              </div>
            </div>
          </div>

          {/* Real-time Route Progress Timeline */}
          <div className="space-y-2 pt-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Corridor Waypoint Track</span>

            <div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-800 text-[11px]">
              <div className="relative">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Checkpoint: Jorabat Interstate Post
                </div>
                <div className="text-[10px] text-slate-400">Passed · Weight & cold-chain verified</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  Current Telemetry: Active on Corridor
                </div>
                <div className="text-[10px] text-blue-500 font-mono">Live AIS-140 AVL Feed</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="font-bold text-amber-600 dark:text-amber-400">
                  Approaching: NH-6 Slope Corridor (Landslide Risk Section)
                </div>
                <div className="text-[10px] text-amber-500">AI Bypass suggested if blocked</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
                <div className="font-bold text-slate-500 dark:text-slate-400">
                  Destination: {activeVehicle.destination}
                </div>
                <div className="text-[10px] text-slate-400">Expected ETA: {activeVehicle.eta}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setLocation('/routes')}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 touch-manipulation cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Safer Route</span>
            </button>

            <a
              href={`tel:${activeVehicle.contactNumber}`}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 touch-manipulation text-center"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>Call Driver</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
