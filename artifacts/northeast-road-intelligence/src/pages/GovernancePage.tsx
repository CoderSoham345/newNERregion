import React, { useState, useMemo } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useTranslation } from '../context/LanguageContext';
import { STATES_DATA, ALL_STATES, type StateId } from '../data/statesAndDistricts';
import { type ReportStatus, type CitizenReport } from '../data/citizenReports';
import { MobileAuthorityMode } from '../components/MobileAuthorityMode';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Building2,
  Users,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  History,
  AlertOctagon,
  FileCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const GovernancePage: React.FC = () => {
  const {
    citizenReports,
    updateReportStatus,
    escalateReport,
    selectedState,
    setSelectedState,
    auditLogs,
    userProfile,
  } = useOperating();
  const { t } = useTranslation();

  const [selectedReportId, setSelectedReportId] = useState<string | null>(citizenReports[0]?.id || null);
  const [assignDeptInput, setAssignDeptInput] = useState<string>('PWD Roads & Bridges');
  const [assignOfficialInput, setAssignOfficialInput] = useState<string>('');
  const [statusUpdateInput, setStatusUpdateInput] = useState<ReportStatus>('Assigned');
  const [officialNoteInput, setOfficialNoteInput] = useState<string>('');
  const [escalateReasonInput, setEscalateReasonInput] = useState<string>('');

  const activeReport = useMemo(
    () => citizenReports.find((r) => r.id === selectedReportId) || citizenReports[0],
    [citizenReports, selectedReportId]
  );

  const departments = [
    'PWD Roads & Bridges',
    'Border Roads Organisation (BRO)',
    'National Highways Authority of India (NHAI)',
    'State Disaster Response Force (SDRF)',
    'District Administration / Revenue Circle',
    'State Electricity & Utility Board',
  ];

  // Statistics calculation
  const totalReports = citizenReports.length;
  const submittedCount = citizenReports.filter((r) => r.status === 'Submitted').length;
  const underReviewCount = citizenReports.filter((r) => r.status === 'Under Review').length;
  const assignedCount = citizenReports.filter((r) => r.status === 'Assigned').length;
  const inProgressCount = citizenReports.filter((r) => r.status === 'Action in Progress').length;
  const resolvedCount = citizenReports.filter((r) => r.status === 'Resolved').length;
  const escalatedCount = citizenReports.filter((r) => r.isEscalated && r.status !== 'Resolved').length;

  const resolutionRate = totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  // Chart data: by Category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizenReports.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [citizenReports]);

  // Chart data: by State
  const stateData = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_STATES.forEach((st) => {
      counts[st] = 0;
    });
    citizenReports.forEach((r) => {
      counts[r.stateId] = (counts[r.stateId] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .filter((d) => d.count > 0);
  }, [citizenReports]);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;
    updateReportStatus(
      activeReport.id,
      statusUpdateInput,
      assignDeptInput,
      assignOfficialInput || 'Officer in Charge',
      officialNoteInput || `Status transitioned to ${statusUpdateInput}`
    );
    setOfficialNoteInput('');
  };

  const handleEscalate = () => {
    if (!activeReport) return;
    const reason =
      escalateReasonInput ||
      `Critical hazard blockage unresolved over 6 hours; direct inter-ministerial intervention requested.`;
    escalateReport(activeReport.id, reason);
    setEscalateReasonInput('');
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <>
      {/* Mobile-first Authority Mode */}
      <div className="block md:hidden">
        <MobileAuthorityMode />
      </div>

      {/* Desktop Comprehensive SLA & Inter-agency Governance Room */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-purple-700 text-white tracking-wider">
                  GOVERNMENT ACCOUNTABILITY & DISPATCH
                </span>
                <SourceBadge status="official" confidence="high" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                {t('govOverviewTitle')}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Inter-agency coordination console for PWD, BRO, NHAI, SDRF and District Magistrates. Triage citizen field reports, dispatch heavy machinery, monitor SLA targets, and enforce escalations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as any)}
                className="bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 font-semibold"
              >
                <option value="All states">{t('allStates')}</option>
                {ALL_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] font-bold uppercase text-slate-400">Total Logged</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalReports}</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] font-bold uppercase text-amber-500">Unassigned</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{submittedCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] font-bold uppercase text-blue-500">In Action</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{inProgressCount + assignedCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] font-bold uppercase text-emerald-500">Resolved</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{resolvedCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] font-bold uppercase text-red-500">Escalated</div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{escalatedCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] font-bold uppercase text-purple-500">Resolution Rate</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{resolutionRate}%</div>
          </div>
        </div>

        {/* Main 2-Column Triage Console */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Report Feed and SLA Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Field Incident Queue & SLA Status
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Auto-synced with citizen apps
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {citizenReports.map((report) => {
                  const isSelected = activeReport?.id === report.id;
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-sm ring-1 ring-purple-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                              {report.trackingNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                              {report.category}
                            </span>
                            {report.isEscalated && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                                ESCALATED
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {report.locationName} ({report.stateId})
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {report.description}
                          </p>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              report.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : report.status === 'Action in Progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {report.status}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {report.assignedDepartment || 'Unassigned'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Detailed Action & Escalation Panel */}
          <div className="space-y-4">
            {activeReport ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                      ACTIVE INCIDENT DETAILS
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {activeReport.trackingNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {activeReport.category}: {activeReport.locationName}
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Reported By</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeReport.userName} ({activeReport.userPhone || 'No Phone'})</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Current Status</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{activeReport.status}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Assigned Department</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeReport.assignedDepartment || 'None'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500 block mb-1">Citizen Narrative</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{activeReport.description}</p>
                  </div>
                </div>

                {/* Dispatch / Update Form */}
                <form onSubmit={handleUpdateStatus} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                    Update Workflow & Assign Agency
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Responsible Agency</label>
                    <select
                      value={assignDeptInput}
                      onChange={(e) => setAssignDeptInput(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Transition Status</label>
                    <select
                      value={statusUpdateInput}
                      onChange={(e) => setStatusUpdateInput(e.target.value as ReportStatus)}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned to Field Unit</option>
                      <option value="Action in Progress">Action in Progress (Machinery Deployed)</option>
                      <option value="Resolved">Resolved & Cleared</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Official Action Note</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. JCB backhoe excavator dispatched from Shillong sub-division depot..."
                      value={officialNoteInput}
                      onChange={(e) => setOfficialNoteInput(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Commit Workflow Update
                  </button>
                </form>

                {/* Escalation Button */}
                {!activeReport.isEscalated && activeReport.status !== 'Resolved' && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleEscalate}
                      className="w-full py-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl border border-red-500/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Escalate to District Magistrate & SDRF</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                Select an incident report from the queue.
              </div>
            )}

            {/* By State Breakdown Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Citizen Reports by State
              </h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
