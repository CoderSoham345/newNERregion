import React, { useState } from 'react';
import { type DataStatus, type ConfidenceLevel } from '../data/provenance';
import { Info, CheckCircle2, AlertTriangle, HelpCircle, Radio, Clock, ShieldCheck, Database } from 'lucide-react';

interface SourceBadgeProps {
  status: DataStatus;
  sourceName?: string;
  lastUpdated?: string;
  confidence?: ConfidenceLevel;
  endpoint?: string;
  onClickInfo?: () => void;
  className?: string;
  showInfoIcon?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  status,
  sourceName,
  lastUpdated,
  confidence,
  endpoint,
  onClickInfo,
  className = '',
  showInfoIcon = true,
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'live':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-500 animate-pulse',
          label: 'LIVE',
          icon: Radio,
        };
      case 'official':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300',
          dot: 'bg-blue-500',
          label: 'OFFICIAL',
          icon: ShieldCheck,
        };
      case 'field_report':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300',
          dot: 'bg-purple-500',
          label: confidence === 'unverified' ? 'FIELD REPORT (UNVERIFIED)' : 'FIELD REPORT',
          icon: CheckCircle2,
        };
      case 'derived':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-300',
          dot: 'bg-indigo-500',
          label: 'AI-DERIVED',
          icon: Database,
        };
      case 'stale':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-500',
          label: 'STALE',
          icon: Clock,
        };
      case 'simulated':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/60 border-dashed border-orange-400 dark:border-orange-600 text-orange-800 dark:text-orange-300',
          dot: 'bg-orange-500',
          label: 'SIMULATED',
          icon: HelpCircle,
        };
      case 'unavailable':
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
          dot: 'bg-slate-400',
          label: 'DATA UNAVAILABLE',
          icon: HelpCircle,
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold whitespace-nowrap tracking-wide select-none ${badge.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
      <span>{badge.label}</span>

      {showInfoIcon && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClickInfo) onClickInfo();
          }}
          title={sourceName ? `Source: ${sourceName} (${lastUpdated || 'Latest'})` : 'Inspect data provenance'}
          className="opacity-70 hover:opacity-100 transition-opacity ml-0.5 cursor-pointer"
        >
          <Info className="w-3 h-3 inline" />
        </button>
      )}
    </div>
  );
};
