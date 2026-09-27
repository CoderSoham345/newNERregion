import React from 'react';
import { useOperating } from '../context/OperatingContext';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, Clock, Check } from 'lucide-react';

export const AlertCenterPage: React.FC = () => {
  const { alerts, markAlertRead, activeAlertsCount } = useOperating();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Regional Alert & Operational Warning Dispatch
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time critical notices broadcast by SDMA, IMD, Central Water Commission, and State Police.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
          Unread Warnings: <strong className="text-amber-600">{activeAlertsCount}</strong>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {alerts.slice(0, 4).map((alt) => {
          const isCritical = alt.severity === 'Critical';

          return (
            <div
              key={alt.id}
              onClick={() => markAlertRead(alt.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                alt.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                  : isCritical
                  ? 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-900 shadow-xs'
                  : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCritical
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {alt.severity} Alert
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Source: {alt.source}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alt.timestamp}</span>
                </div>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1.5">
                {alt.title}
              </h3>

              <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                {alt.content}
              </p>

              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Recommended Protocol: </span>
                  <span className="text-slate-600 dark:text-slate-400">{alt.recommendedAction}</span>
                </div>

                {!alt.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAlertRead(alt.id);
                    }}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Check className="w-3 h-3" />
                    <span>Acknowledge</span>
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
