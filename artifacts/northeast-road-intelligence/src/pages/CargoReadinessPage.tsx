import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { type CargoItem, type CargoPriority } from '../data/vehiclesAndCargo';
import {
  PackageCheck,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  ArrowRight,
  ShieldAlert,
  Navigation,
  FileSpreadsheet,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { MobileLogisticsScreen } from '../components/MobileLogisticsScreen';

export const CargoReadinessPage: React.FC = () => {
  const {
    cargoList,
    addNewCargoShipment,
    rerouteCargo,
  } = useOperating();

  const [, setLocation] = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Manifest Form State
  const [newName, setNewName] = useState('');
  const [newOrigin, setNewOrigin] = useState('Guwahati Central Depot');
  const [newDest, setNewDest] = useState('Silchar Civil Hospital');
  const [newPriority, setNewPriority] = useState<CargoPriority>('Critical');
  const [newCarrier, setNewCarrier] = useState('Assam State Logistics');
  const [newWeight, setNewWeight] = useState('8.5 Tons');

  const pageCargo = cargoList.slice(0, 4);

  const filteredCargo = pageCargo.filter((c) => {
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.origin.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateManifest = (e: React.FormEvent) => {
    e.preventDefault();
    addNewCargoShipment({
      name: newName,
      category: 'Medicines',
      origin: newOrigin,
      originState: 'Assam',
      destination: newDest,
      destinationState: 'Assam',
      priority: newPriority,
      vehicleId: 'AS-01-GB-4012',
      assignedRoadSegmentId: 'seg-as-nh27-1',
      currentLocationName: newOrigin,
      currentCoords: [26.144, 91.736],
      eta: '6 hrs 30 mins',
      distanceKm: 310,
      reason: 'Optimal weather window confirmed',
      alternateRouteAvailable: false,
      alternateRouteRecommendation: 'Standard corridor clear',
      alternateRouteTimeSaved: '0 min',
      temperatureControlled: false,
      requiredDeliveryTime: 'Today · 20:00 IST',
      consignee: newCarrier,
      contactNumber: '+91 94350 11223',
    });
    setIsModalOpen(false);
    setNewName('');
  };

  return (
    <>
      {/* Mobile-first Logistics Lifeline Dashboard */}
      <div className="block md:hidden">
        <MobileLogisticsScreen cargoList={pageCargo} />
      </div>

      {/* Desktop Full Cargo Logistics Grid */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Essential Cargo Dispatch & Cold-Chain Readiness
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Priority cargo tracking and safe route management.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Cargo Manifest</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Shipments</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {pageCargo.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">In Transit Clear</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {pageCargo.filter((c) => c.status === 'In Transit').length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">At Risk / Delayed</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {pageCargo.filter((c) => c.status === 'Delayed' || c.status === 'At risk').length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Critical Blocked</div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
            {pageCargo.filter((c) => c.status === 'Blocked').length}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search manifest ID, item, origin, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Standard">Standard Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Ready for Dispatch">Ready for Dispatch</option>
            <option value="In Transit">In Transit</option>
            <option value="Delayed">Delayed</option>
            <option value="At risk">At risk</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Cargo List Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCargo.map((c) => {
          const isBlocked = c.status === 'Blocked';
          const isAtRisk = c.status === 'At risk' || c.status === 'Delayed';

          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between ${
                isBlocked
                  ? 'border-red-300 dark:border-red-900/60 hover:shadow-red-500/10'
                  : isAtRisk
                  ? 'border-amber-300 dark:border-amber-900/60 hover:shadow-amber-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                      {c.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : c.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isBlocked
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : isAtRisk
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    ● {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-2">
                  {c.name}
                </h3>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Route:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {c.origin} → {c.destination}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Consignee: {c.consignee}</span>
                    <span>Category: {c.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Vehicle: {c.vehicleId}</div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>ETA: {c.eta}</span>
                </span>

                {(isBlocked || isAtRisk) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rerouteCargo(c.id, c.alternateRouteRecommendation || 'Via alternate corridor bypass');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Apply Safe Reroute</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Manifest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Create Essential Cargo Manifest
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Register a high-priority shipment for real-time corridor monitoring and AI safe-route dispatch.
            </p>

            <form onSubmit={handleCreateManifest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cargo Description / Consignment Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Liquid Medical Oxygen Cylinders"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Origin Staging Hub
                  </label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Hub
                  </label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as CargoPriority)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Critical">Critical (Life-Saving)</option>
                    <option value="High">High (Food / Fuel)</option>
                    <option value="Standard">Standard Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gross Weight
                  </label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logistics Carrier / Transporter
                </label>
                <input
                  type="text"
                  value={newCarrier}
                  onChange={(e) => setNewCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
