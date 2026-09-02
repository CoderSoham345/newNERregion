import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useOperating } from '../context/OperatingContext';
import {
  LayoutDashboard,
  Map,
  Route,
  Navigation,
  Brain,
  Truck,
  Radio,
  Flame,
  Bell,
  AlertOctagon,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronRight,
  Layers,
  CloudRain,
  Mountain,
  Waves,
  FileText,
  Database,
  ChevronsLeft,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [location, setLocation] = useLocation();
  const {
    activeAlertsCount,
    criticalIncidentsCount,
    blockedRoadsCount,
    demoMode,
    userProfile,
    logoutUser,
  } = useOperating();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;
  const handleToggleCollapse = onToggleCollapse || (() => setInternalCollapsed(prev => !prev));

  const isCitizen = userProfile.role === 'Citizen';

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 select-none z-30 ${
        isOpenMobile ? 'fixed inset-y-0 left-0 w-64 shadow-2xl flex' : `hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'}`
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
            उ
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-xs font-black tracking-wider text-white uppercase">UttarPURV</div>
              <div className="text-[9px] text-emerald-400 font-mono truncate">
                {isCitizen ? 'Citizen Portal' : 'NER Road Intelligence'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Main Link */}
      <div className="p-2.5 border-b border-slate-800/80">
        <Link
          href="/"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            location === '/'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 shrink-0 ${location === '/' ? 'text-white' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="truncate flex-1">{isCitizen ? 'Citizen Dashboard' : 'Dashboard'}</span>}
        </Link>
      </div>

      {/* Navigation List grouped as per reference */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 custom-scrollbar">
        
        {isCitizen ? (
          /* CITIZEN NAVIGATION */
          <div className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
                PUBLIC SERVICES
              </div>
            )}

            <Link
              href="/map"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/map' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Road & Safety Status</span>}
            </Link>

            <Link
              href="/report"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/report' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <AlertOctagon className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Report Road Issue</span>}
            </Link>

            <Link
              href="/routes"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/routes' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Find Safe Route</span>}
            </Link>

            <Link
              href="/nearest-help"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/nearest-help' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <PhoneCall className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Emergency Help</span>}
            </Link>

            <Link
              href="/weather"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/weather' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <CloudRain className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Weather & Risk Alerts</span>}
            </Link>

            <Link
              href="/reports/track"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/reports/track' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">My Reports</span>}
            </Link>

            <Link
              href="/profile"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/profile' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Profile</span>}
            </Link>
          </div>
        ) : (
          /* OFFICER / GOVERNMENT OPERATIONS */
          <React.Fragment>
            <div className="space-y-0.5">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
                  OPERATIONS
                </div>
              )}

              <Link
                href="/map"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/map'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Map className={`w-4 h-4 shrink-0 ${location === '/map' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Map & Routes</span>}
              </Link>

              <Link
                href="/routes"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/routes' || location === '/ai-routes'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Navigation className={`w-4 h-4 shrink-0 ${location === '/routes' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">AI Safe Routes</span>}
              </Link>

              <Link
                href="/disaster"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/disaster' || location === '/alerts'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Flame className={`w-4 h-4 shrink-0 ${location === '/disaster' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Incidents</span>}
                {!isCollapsed && criticalIncidentsCount > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                    {criticalIncidentsCount}
                  </span>
                )}
              </Link>

              <Link
                href="/report"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/report'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <AlertOctagon className={`w-4 h-4 shrink-0 ${location === '/report' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Report Incident</span>}
              </Link>

              <Link
                href="/cargo"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/cargo' || location === '/my-cargo'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Truck className={`w-4 h-4 shrink-0 ${location === '/cargo' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Logistics</span>}
              </Link>

              <Link
                href="/my-cargo"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/my-cargo' || location === '/track-delivery'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Radio className={`w-4 h-4 shrink-0 ${location === '/my-cargo' || location === '/track-delivery' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Track Delivery</span>}
              </Link>
            </div>

            {/* INTELLIGENCE */}
            <div className="space-y-0.5 pt-2 border-t border-slate-800/80">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
                  INTELLIGENCE
                </div>
              )}

              <Link
                href="/weather"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/weather'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <CloudRain className={`w-4 h-4 shrink-0 ${location === '/weather' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Weather & Risk</span>}
              </Link>

              <Link
                href="/landslide-risk"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/landslide-risk'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Mountain className={`w-4 h-4 shrink-0 ${location === '/landslide-risk' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Landslide Intelligence</span>}
              </Link>

              <Link
                href="/flood-risk"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/flood-risk'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Waves className={`w-4 h-4 shrink-0 ${location === '/flood-risk' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Flood Intelligence</span>}
              </Link>
            </div>

            {/* MORE */}
            <div className="space-y-0.5 pt-2 border-t border-slate-800/80">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
                  MORE
                </div>
              )}

              <Link
                href="/helplines"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/helplines'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <PhoneCall className={`w-4 h-4 shrink-0 ${location === '/helplines' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Emergency Directory</span>}
              </Link>

              <Link
                href="/reports/track"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/reports/track'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${location === '/reports/track' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Reports</span>}
              </Link>

              <Link
                href="/governance"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/governance'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 shrink-0 ${location === '/governance' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Authority Room</span>}
              </Link>

              <Link
                href="/data-sources"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/data-sources'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Database className={`w-4 h-4 shrink-0 ${location === '/data-sources' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Sync Center</span>}
                {!isCollapsed && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    3
                  </span>
                )}
              </Link>
            </div>
          </React.Fragment>
        )}

      </div>

      {/* Bottom System Status & Collapse */}
      <div className="p-3 m-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 text-xs space-y-2.5">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-white">System Status</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Operational</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              All Systems Operational
            </div>
            <button
              onClick={handleToggleCollapse}
              className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
              <span>Collapse</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleToggleCollapse}
            title="Expand Sidebar"
            className="w-full p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

