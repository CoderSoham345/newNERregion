import React, { useState } from 'react';
import { DATA_SOURCE_MATRIX, type DataSourceMatrixEntry } from '../data/provenance';
import { SourceBadge } from '../components/SourceBadge';
import { DataSourceModal, type DataSourceModalInfo } from '../components/DataSourceModal';
import { Database, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Filter } from 'lucide-react';

export const DataSourceMatrixPage: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<DataSourceModalInfo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMatrix = DATA_SOURCE_MATRIX.filter((item) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'live') return item.isLive;
    if (filterStatus === 'unconnected') return !item.isLive;
    return item.status === filterStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Data Source Architecture & Provenance Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            SIH26002 Real Data Compliance Audit: Complete transparency of all external meteorological feeds, GIS routing engines, device GPS sensors, official registries, and unintegrated telematics.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Sources ({DATA_SOURCE_MATRIX.length})</option>
            <option value="live">Live Connected Only</option>
            <option value="unconnected">Awaiting API Integration</option>
            <option value="field_report">Field Reports</option>
            <option value="derived">AI-Derived Models</option>
            <option value="official">Official Registries</option>
          </select>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Live Connected Feeds</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {DATA_SOURCE_MATRIX.filter((m) => m.isLive).length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Open-Meteo, MapTiler, OSRM, GPS</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Field Officer Geotags</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {DATA_SOURCE_MATRIX.filter((m) => m.status === 'field_report').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">W3C Geolocation + SDMA Verification</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">AI Predictive Models</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {DATA_SOURCE_MATRIX.filter((m) => m.status === 'derived').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Deterministic Geotechnical Formulas</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Unconnected Feeds</div>
          <div className="text-2xl font-black text-slate-500 dark:text-slate-400 mt-1">
            {DATA_SOURCE_MATRIX.filter((m) => !m.isLive && m.status === 'unavailable').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Explicitly labeled UNAVAILABLE</div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Comprehensive Data Provenance Register
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredMatrix.length} registered capabilities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Feature</th>
                <th className="p-3.5">Source Entity</th>
                <th className="p-3.5">API / Endpoint Spec</th>
                <th className="p-3.5 text-center">Live?</th>
                <th className="p-3.5">Update Frequency</th>
                <th className="p-3.5">Fallback Policy</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-white">
                    {item.feature}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {item.source}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 max-w-xs truncate" title={item.apiFeed}>
                    {item.apiFeed}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.isLive ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                        YES
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px]">
                        NO
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {item.updateFrequency}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 italic">
                    {item.fallback}
                  </td>
                  <td className="p-3.5">
                    <SourceBadge
                      status={item.status}
                      showInfoIcon={false}
                    />
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <button
                      onClick={() =>
                        setSelectedEntry({
                          feature: item.feature,
                          source: item.source,
                          endpoint: item.apiFeed,
                          dataStatus: item.status,
                          confidence: item.isLive ? 'high' : 'unverified',
                          lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
                          updateFrequency: item.updateFrequency,
                          description: item.description,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors font-bold text-[11px] cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal inspection */}
      <DataSourceModal info={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
};
