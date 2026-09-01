import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useTranslation } from '../context/LanguageContext';
import { STATES_DATA, ALL_STATES, type StateId } from '../data/statesAndDistricts';
import { type ReportStatus, type CitizenReport } from '../data/citizenReports';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Shield,
  Phone,
  FileText,
  Camera,
  Volume2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'wouter';
import { SourceBadge } from '../components/SourceBadge';

export const CitizenReportsTrackingPage: React.FC = () => {
  const { citizenReports, selectedState, setSelectedState } = useOperating();
  const { t, speakText } = useTranslation();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTrackingId, setSearchTrackingId] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  const filteredReports = citizenReports.filter((rep) => {
    if (selectedState !== 'All states' && rep.stateId !== selectedState) return false;
    if (selectedStatus !== 'all' && rep.status !== selectedStatus) return false;
    if (
      searchTrackingId &&
      !rep.trackingNumber.toLowerCase().includes(searchTrackingId.toLowerCase()) &&
      !rep.locationName.toLowerCase().includes(searchTrackingId.toLowerCase()) &&
      !rep.category.toLowerCase().includes(searchTrackingId.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {t('reportStatusSubmitted')}
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" />
            {t('reportStatusReview')}
          </span>
        );
      case 'Assigned':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            {t('reportStatusAssigned')}
          </span>
        );
      case 'Action in Progress':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('reportStatusAction')}
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('reportStatusResolved')}
          </span>
        );
    }
  };

  const steps: ReportStatus[] = [
    'Submitted',
    'Under Review',
    'Assigned',
    'Action in Progress',
    'Resolved',
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-600 text-white tracking-wider">
                CITIZEN PARTICIPATION & TRACKING
              </span>
              <SourceBadge status="official" confidence="high" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              {t('myReportsTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Track live status, department assignments, and resolution milestones for public road & disaster reports.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/report"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t('submitReport')}</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          {/* State selector */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as any)}
            className="bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          >
            <option value="All states">{t('allStates')}</option>
            {ALL_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          >
            <option value="all">All Statuses ({citizenReports.length})</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Action in Progress">Action in Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTrackingId}
              onChange={(e) => setSearchTrackingId(e.target.value)}
              placeholder="Search by Tracking ID (#NER-000123) or Location..."
              className="w-full bg-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Reports List & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of reports */}
        <div className="lg:col-span-2 space-y-4">
          {filteredReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            const currentStepIdx = steps.indexOf(report.status);

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-300 dark:border-emerald-800">
                      {report.trackingNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {report.stateId} • {report.category}
                    </span>
                    {report.isEscalated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse">
                        ESCALATED
                      </span>
                    )}
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                {/* Location & Title */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{report.locationName}</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {report.description}
                  </p>
                </div>

                {/* Visual Progress Bar Steps */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
                      }}
                    />

                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-900'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] font-semibold mt-1 hidden sm:inline ${
                              isCurrent
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                : isCompleted
                                ? 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Department Footer */}
                {report.assignedDepartment && (
                  <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Shield className="w-3.5 h-3.5 text-purple-500" />
                      <span className="font-semibold">{report.assignedDepartment}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {report.assignedOfficial || 'Officer Assigned'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No citizen reports found matching criteria
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Use the "Report a Problem" button to lodge a new road or disaster issue.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Report Inspection */}
        <div className="space-y-4">
          {selectedReport ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 sticky top-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    REPORT DOSSIER
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {selectedReport.trackingNumber}
                  </h3>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>

              {/* Photo Preview if available */}
              {selectedReport.photoUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={selectedReport.photoUrl}
                    alt={selectedReport.locationName}
                    className="w-full h-44 object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    Field Photo
                  </span>
                </div>
              )}

              {/* Info fields */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Location:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReport.locationName} ({selectedReport.stateId})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Description:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {selectedReport.description}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Reported By:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReport.userName} ({selectedReport.userPhone || 'Registered Citizen'})
                  </p>
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Resolution Milestones & Audit Trail
                </h4>
                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {selectedReport.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-6 text-xs space-y-0.5">
                      <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 -translate-x-1/2 ring-2 ring-white dark:ring-slate-900" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        <strong>{item.actor}</strong> {item.department ? `(${item.department})` : ''}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded">
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    speakText(
                      `Report ${selectedReport.trackingNumber}, location ${selectedReport.locationName}. Current status is ${selectedReport.status}. Assigned to ${selectedReport.assignedDepartment || 'District Desk'}.`
                    )
                  }
                  className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('listen')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Select a report to inspect
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any report from the list to view its complete audit timeline, assigned engineer, and photographic evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
