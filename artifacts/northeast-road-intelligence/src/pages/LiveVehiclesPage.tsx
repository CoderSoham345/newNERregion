import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { MapView } from '../components/MapView';
import { SourceBadge } from '../components/SourceBadge';
import { MobileVehicleTrackingScreen } from '../components/MobileVehicleTrackingScreen';
import {
  Radio,
  Truck,
  PhoneCall,
  Fuel,
  Gauge,
  MapPin,
  Clock,
  Search,
  ShieldAlert,
  CheckCircle2,
  Info,
  Sliders,
  AlertTriangle,
} from 'lucide-react';

export const LiveVehiclesPage: React.FC = () => {
  const { filteredVehicles, inspectVehicle, selectedVehicle, demoMode, toggleDemoMode, inspectDataSource } = useOperating();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const displayVehicles = filteredVehicles.filter((v) => {
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        v.id.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.cargoDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Mobile-first Dedicated Fleet Tracking Screen */}
      <div className="block md:hidden">
        <MobileVehicleTrackingScreen />
      </div>

      {/* Desktop Comprehensive Fleet Telemetry Grid */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Fleet GPS Telemetry & Transponder Management
              </h1>
              <SourceBadge
                sourceName="AIS-140 VTS Feed"
                status={demoMode ? 'simulated' : 'unavailable'}
                confidence={demoMode ? 'high' : 'unverified'}
                onClickInfo={() => inspectDataSource('Live Vehicle Telemetry & Transponders')}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
              Real-time automated vehicle location (AVL), driver dispatch, and emergency corridor navigation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                demoMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black ring-4 ring-amber-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{demoMode ? 'Simulation Active' : 'Run Field Demo'}</span>
            </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vehicle number, driver, or cargo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'Medical', 'Food Grain', 'Fuel Tanker'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    typeFilter === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Units</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {filteredVehicles.length} Vehicles
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
              AVL
            </div>
          </div>
        </div>

        {/* Main Grid: Map & Vehicle Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <MapView className="h-full w-full" />
            </div>

            {/* Vehicle List Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayVehicles.map((v) => {
                const isSelected = selectedVehicle?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => inspectVehicle(v.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                          {v.registrationNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {v.type}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'In Transit'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1 truncate">
                      {v.cargoDescription}
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 flex items-center justify-between">
                      <span>{v.destination}</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{v.speedKmH} km/h</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Driver: {v.driverName}</span>
                      <a
                        href={`tel:${v.contactNumber}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Vehicle Inspector Panel */}
          <div>
            {selectedVehicle ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">
                      TELEMETRY UNIT ACTIVE
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedVehicle.registrationNumber}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {selectedVehicle.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Assigned Driver</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedVehicle.driverName}</span>
                  </div>

                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Contact Number</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedVehicle.contactNumber}</span>
                  </div>

                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Current Velocity</span>
                    <span className="font-mono font-bold text-emerald-600">{selectedVehicle.speedKmH} km/h</span>
                  </div>

                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Destination</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedVehicle.destination}</span>
                  </div>

                  <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Cargo Item</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedVehicle.cargoDescription}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
                <Truck className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                Select any vehicle to inspect real-time telemetry diagnostics.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
