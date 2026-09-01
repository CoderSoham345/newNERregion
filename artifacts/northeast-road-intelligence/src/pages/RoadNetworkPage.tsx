import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import { type RoadSegment, type RoadStatus, type HighwayType } from '../data/roadNetwork';
import { RoadIntelligenceDrawer } from '../components/RoadIntelligenceDrawer';
import {
  Route,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Edit,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const RoadNetworkPage: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    filteredRoadSegments,
    inspectRoad,
    updateRoadSegmentStatus,
    userProfile,
  } = useOperating();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'risk' | 'delay' | 'length' | 'speed'>('risk');

  // Edit Modal State
  const [editingSegment, setEditingSegment] = useState<RoadSegment | null>(null);
  const [newStatus, setNewStatus] = useState<RoadStatus>('Accessible');
  const [newDelay, setNewDelay] = useState('');
  const [newReason, setNewReason] = useState('');

  const displaySegments = filteredRoadSegments
    .filter((seg) => {
      if (statusFilter !== 'all' && seg.roadStatus !== statusFilter) return false;
      if (typeFilter !== 'all' && seg.highwayType !== typeFilter) return false;
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          seg.highwayNumber.toLowerCase().includes(q) ||
          seg.startLocation.toLowerCase().includes(q) ||
          seg.endLocation.toLowerCase().includes(q) ||
          seg.districtName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'delay') return a.expectedDelay.localeCompare(b.expectedDelay);
      if (sortBy === 'length') return b.lengthKm - a.lengthKm;
      if (sortBy === 'speed') return a.averageSpeed - b.averageSpeed;
      return 0;
    });

  const handleOpenEdit = (seg: RoadSegment, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSegment(seg);
    setNewStatus(seg.roadStatus);
    setNewDelay(seg.expectedDelay);
    setNewReason(seg.primaryReason);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSegment) return;
    updateRoadSegmentStatus(editingSegment.id, newStatus, undefined, newDelay);
    setEditingSegment(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Overview */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Road Network & Highway Segment Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete inventory of National Highways (NH), State Highways (SH), and Major District Roads (MDR) across the North Eastern region.
          </p>
        </div>

        {/* State Selector */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value as OperatingState)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
        >
          {ALL_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Highway (NH-6, NH-10), town, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Accessible">Accessible</option>
            <option value="Caution">Caution</option>
            <option value="At risk">At risk</option>
            <option value="Blocked">Blocked</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Road Classes</option>
            <option value="NH">National Highways (NH)</option>
            <option value="SH">State Highways (SH)</option>
            <option value="MDR">Major District Roads (MDR)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="risk">Sort by Highest Risk</option>
            <option value="delay">Sort by Expected Delay</option>
            <option value="length">Sort by Segment Length</option>
            <option value="speed">Sort by Lowest Speed</option>
          </select>
        </div>
      </div>

      {/* Segments Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Highway & Segment</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk Meter</th>
                <th className="py-3 px-4">Speed / Delay</th>
                <th className="py-3 px-4">Weather / Rainfall</th>
                <th className="py-3 px-4">Primary Reason</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {displaySegments.map((seg) => (
                <tr
                  key={seg.id}
                  onClick={() => inspectRoad(seg.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-800 font-mono text-xs">
                        {seg.highwayNumber}
                      </span>
                      <span>
                        {seg.startLocation} → {seg.endLocation}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {seg.lengthKm} km · {seg.highwayType} · {seg.elevationMeters}m MSL
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div className="font-semibold">{seg.stateId}</div>
                    <div className="text-[10px] text-slate-400">{seg.districtName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        seg.roadStatus === 'Accessible'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : seg.roadStatus === 'Blocked'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse'
                          : seg.roadStatus === 'At risk'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                      }`}
                    >
                      ● {seg.roadStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            seg.riskScore >= 75
                              ? 'bg-red-500'
                              : seg.riskScore >= 45
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${seg.riskScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {seg.riskScore}/100
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {seg.averageSpeed} km/h
                    </div>
                    <div className="text-[10px] text-red-600 font-semibold">
                      +{seg.expectedDelay}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div>{seg.rainfall} mm (24h)</div>
                    <div className="text-[10px] text-slate-400">{seg.weatherCondition}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {seg.primaryReason}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={(e) => handleOpenEdit(seg, e)}
                      title="Update Road Status (Field Officers)"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-emerald-700 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Road Status Update Modal */}
      {editingSegment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Field Status Update: {editingSegment.highwayNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {editingSegment.startLocation} → {editingSegment.endLocation} ({editingSegment.districtName})
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Road Operational Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RoadStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Accessible">Accessible (Clear)</option>
                  <option value="Caution">Caution (Slow / Slippery)</option>
                  <option value="At risk">At risk (Active Hazard Threat)</option>
                  <option value="Blocked">Blocked (Total Closure)</option>
                  <option value="Under maintenance">Under maintenance (Repair Crews)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Transit Delay
                </label>
                <input
                  type="text"
                  value={newDelay}
                  onChange={(e) => setNewDelay(e.target.value)}
                  placeholder="e.g. 3 hrs, 45 mins, Nil"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operational Reason / Assessment
                </label>
                <textarea
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSegment(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <RoadIntelligenceDrawer />
    </div>
  );
};
