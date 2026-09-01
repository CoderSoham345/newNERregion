import React from 'react';
import { useOperating } from '../context/OperatingContext';
import { ScrollText, ShieldCheck, Activity, CheckCircle2, Server, Database, Wifi } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const { isOnline, pendingOfflineReportsCount } = useOperating();

  const auditEvents = [
    {
      id: 'AUD-901',
      timestamp: '2 mins ago',
      actor: 'Maj. Vikram Sharma (BRO Project Pushpak)',
      action: 'Updated Road Status: NH-6 Sonapur to Blocked',
      reason: 'Landslide clearance operations with JCB deployment',
    },
    {
      id: 'AUD-900',
      timestamp: '14 mins ago',
      actor: 'AI Dispatch Engine',
      action: 'Calculated Emergency Safe Corridor: Guwahati → Silchar',
      reason: 'Automated 1-click diversion for Oxygen Tanker AS-01-GB-4012',
    },
    {
      id: 'AUD-899',
      timestamp: '45 mins ago',
      actor: 'Dr. Ananya Baruah (NDRF 1st Bn)',
      action: 'Verified Field Incident INC-401 (East Jaintia Hills)',
      reason: 'High-severity debris flow confirmed at Sonapur Tunnel approach',
    },
    {
      id: 'AUD-898',
      timestamp: '1 hour ago',
      actor: 'District Magistrate Aizawl',
      action: 'Broadcast Alert: Flash Flood Warning for NH-306',
      reason: 'Bairabi river surge crossing low-lying bridge',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Operations Audit Trail & System Health Diagnostics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable system logs, duty officer actions, AI dispatch computations, and integration telemetry.
          </p>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">GIS Vector Engine</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ● Online (Lat: 12ms)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Offline Cache Storage</div>
            <div className="text-[10px] text-slate-500">
              {pendingOfflineReportsCount} pending queue items
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">IMD Doppler Radar</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ● Connected (Radar Guwahati)
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white">
          Logged Officer Actions & Engine Operations
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {auditEvents.map((ev) => (
            <div key={ev.id} className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{ev.action}</span>
                <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                <strong>Officer / Actor:</strong> {ev.actor}
              </div>
              <div className="text-[10px] text-slate-500">
                <strong>Details:</strong> {ev.reason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
