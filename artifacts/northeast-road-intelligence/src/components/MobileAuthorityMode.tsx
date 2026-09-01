import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import {
  Shield,
  AlertTriangle,
  Truck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Radio,
  Clock,
  Sparkles,
  Send,
  Navigation,
  FileCheck2,
} from 'lucide-react';
import { useLocation } from 'wouter';

export const MobileAuthorityMode: React.FC = () => {
  const {
    incidents,
    roadSegments,
    cargoList,
    inspectRoad,
    inspectCargo,
    inspectIncident,
  } = useOperating();
  const [, setLocation] = useLocation();

  const [acknowledgedList, setAcknowledgedList] = useState<string[]>([]);
  const [dispatchedList, setDispatchedList] = useState<string[]>([]);

  const criticalIncidents = incidents.filter(
    (i) => i.severity === 'Critical' || i.severity === 'High'
  );
  const criticalRoads = roadSegments.filter((r) => r.roadStatus === 'Blocked');
  const atRiskDeliveries = cargoList.filter(
    (c) => c.priority === 'Critical' || c.status === 'At risk'
  );

  const toggleAck = (id: string) => {
    setAcknowledgedList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDispatch = (id: string) => {
    setDispatchedList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto p-3.5 pb-24">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
              AUTHORITY CONTROL ROOM
            </span>
            <h1 className="text-xl font-black text-white mt-0.5">
              District Operational Dispatch
            </h1>
          </div>
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top 3 Core Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center shadow-xs">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Critical Incidents</div>
          <div className="text-xl font-black text-red-500 mt-0.5">
            {criticalIncidents.length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center shadow-xs">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Critical Roads</div>
          <div className="text-xl font-black text-orange-500 mt-0.5">
            {criticalRoads.length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center shadow-xs">
          <div className="text-[9px] font-bold text-slate-400 uppercase">At-Risk Cargo</div>
          <div className="text-xl font-black text-amber-500 mt-0.5">
            {atRiskDeliveries.length}
          </div>
        </div>
      </div>

      {/* PRIORITY ACTIONS LIST */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          PRIORITY ACTIONS & DIRECTIVES
        </h2>

        {/* Priority 1: Inspect NH-6 / Blocked Road */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>1. Inspect NH-6 Slope Section</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Meghalaya PWD & BRO unit deployment for mud clearance and slope netting.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-500">
              URGENT
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => toggleAck('act-1')}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all touch-manipulation ${
                acknowledgedList.includes('act-1')
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {acknowledgedList.includes('act-1') ? '✓ ACKED' : 'ACKNOWLEDGE'}
            </button>

            <button
              onClick={() => toggleDispatch('act-1')}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all touch-manipulation ${
                dispatchedList.includes('act-1')
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {dispatchedList.includes('act-1') ? '✓ SENT' : 'DISPATCH'}
            </button>

            <button
              onClick={() => setLocation('/alerts')}
              className="py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase touch-manipulation"
            >
              ALERT
            </button>

            <button
              onClick={() => setLocation('/map')}
              className="py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase touch-manipulation"
            >
              RESOLVE
            </button>
          </div>
        </div>

        {/* Priority 2: Redirect Medicine Truck V102 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>2. Redirect Medicine Vehicle AS-01-GB-4012</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Send automated AIS-140 telematics detour notification via Umroi Bypass (+18 km).
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-500">
              SAFETY DETOUR
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => toggleAck('act-2')}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all touch-manipulation ${
                acknowledgedList.includes('act-2')
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {acknowledgedList.includes('act-2') ? '✓ ACKED' : 'ACKNOWLEDGE'}
            </button>

            <button
              onClick={() => toggleDispatch('act-2')}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all touch-manipulation ${
                dispatchedList.includes('act-2')
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {dispatchedList.includes('act-2') ? '✓ SENT' : 'DISPATCH'}
            </button>

            <button
              onClick={() => setLocation('/alerts')}
              className="py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase touch-manipulation"
            >
              ALERT
            </button>

            <button
              onClick={() => setLocation('/routes')}
              className="py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase touch-manipulation"
            >
              RESOLVE
            </button>
          </div>
        </div>

        {/* Priority 3: Alert District Disaster Authorities */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>3. Alert Meghalaya SDMA & Traffic Control</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Broadcast public transit advisory to all commercial operators on state portal.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-500">
              BROADCAST
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => toggleAck('act-3')}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all touch-manipulation ${
                acknowledgedList.includes('act-3')
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {acknowledgedList.includes('act-3') ? '✓ ACKED' : 'ACKNOWLEDGE'}
            </button>

            <button
              onClick={() => toggleDispatch('act-3')}
              className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all touch-manipulation ${
                dispatchedList.includes('act-3')
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {dispatchedList.includes('act-3') ? '✓ SENT' : 'DISPATCH'}
            </button>

            <button
              onClick={() => setLocation('/alerts')}
              className="py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase touch-manipulation"
            >
              ALERT
            </button>

            <button
              onClick={() => setLocation('/governance')}
              className="py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase touch-manipulation"
            >
              RESOLVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
