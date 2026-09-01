import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { Truck, Clock, CheckCircle2, AlertTriangle, Navigation, MapPin, Search } from 'lucide-react';
import { Link } from 'wouter';

export const MyCargoPage: React.FC = () => {
  const { cargoList, userProfile, rerouteCargo } = useOperating();
  const [searchQuery, setSearchQuery] = useState('');

  const myCargo = cargoList.filter((c) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.consignee.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              My Assigned Shipments & Consignment Lifelines
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transporter & duty officer portal for live tracking, driver coordination, and dynamic emergency re-routing.
          </p>
        </div>

        <Link
          href="/cargo"
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700"
        >
          All Regional Cargo
        </Link>
      </div>

      {/* Cargo List */}
      <div className="space-y-4">
        {myCargo.map((c) => {
          const isProblem = c.status === 'Blocked' || c.status === 'At risk' || c.status === 'Delayed';

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {c.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {c.priority} Priority
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Blocked'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : c.status === 'At risk'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    ● {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {c.name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span><strong>Route:</strong> {c.origin} → {c.destination}</span>
                  <span><strong>Vehicle:</strong> {c.vehicleId}</span>
                  <span><strong>Consignee:</strong> {c.consignee}</span>
                  <span><strong>Category:</strong> {c.category}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <strong>Status Note:</strong> {c.reason}
                </p>
              </div>

              {/* Right Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Arrival</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.eta}</span>
                  </div>
                </div>

                {isProblem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rerouteCargo(c.id, c.alternateRouteRecommendation || 'Via alternate corridor bypass');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Execute Safe Reroute</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
