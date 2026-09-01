import React from 'react';
import { SourceBadge } from './SourceBadge';
import { type DataStatus, type ConfidenceLevel } from '../data/provenance';
import { X, Database, Globe, ShieldAlert, CheckCircle, RefreshCw, ExternalLink, Code } from 'lucide-react';

export interface DataSourceModalInfo {
  feature: string;
  source: string;
  endpoint?: string;
  dataStatus: DataStatus;
  confidence: ConfidenceLevel;
  lastUpdated: string;
  updateFrequency: string;
  description: string;
  payloadSample?: string;
}

interface DataSourceModalProps {
  info: DataSourceModalInfo | null;
  onClose: () => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Data Provenance & Source Inspection
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {info.feature}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Status & Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Data Integrity Status</div>
              <div className="mt-1">
                <SourceBadge
                  status={info.dataStatus}
                  confidence={info.confidence}
                  showInfoIcon={false}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Confidence Level</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mt-0.5">
                {info.confidence}
              </div>
            </div>
          </div>

          {/* Source Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-slate-500 dark:text-slate-400 font-semibold mb-1">Source Entity / Provider</div>
              <div className="font-bold text-slate-900 dark:text-white">{info.source}</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-slate-500 dark:text-slate-400 font-semibold mb-1">Update Frequency</div>
              <div className="font-bold text-slate-900 dark:text-white">{info.updateFrequency}</div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sm:col-span-2">
              <div className="text-slate-500 dark:text-slate-400 font-semibold mb-1">API Endpoint / Feed Spec</div>
              <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 break-all bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                {info.endpoint || 'Internal Engine / Direct Browser API'}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sm:col-span-2">
              <div className="text-slate-500 dark:text-slate-400 font-semibold mb-1">Last Timestamp</div>
              <div className="font-bold text-slate-900 dark:text-white">{info.lastUpdated}</div>
            </div>
          </div>

          {/* Description & SIH Transparency Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Source Transparency Disclosure
            </div>
            <p>{info.description}</p>
          </div>

          {/* Raw JSON sample if available */}
          {info.payloadSample && (
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> Sample Raw API Payload
              </div>
              <pre className="text-[10px] font-mono bg-slate-950 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-36 custom-scrollbar">
                {info.payloadSample}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
};
