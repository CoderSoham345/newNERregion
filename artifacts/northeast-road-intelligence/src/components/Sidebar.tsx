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
  ShieldCheck,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronRight,
  Layers,
  CloudRain,
  FileText,
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
      className={`bg-white text-black flex flex-col border-r border-slate-200 transition-all duration-300 select-none z-30 ${
        isOpenMobile ? 'fixed inset-y-0 left-0 w-64 shadow-2xl flex' : `hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'}`
      }`}
    >
      {/* Dashboard Main Link */}
      <div className="p-2.5 border-b border-slate-200">
        <Link
          href="/"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            location === '/'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'hover:bg-slate-100 text-black hover:text-black'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 shrink-0 ${location === '/' ? 'text-white' : 'text-[#1F2937]'}`} />
          {!isCollapsed && <span className="truncate flex-1">{isCitizen ? 'Citizen Dashboard' : 'Dashboard'}</span>}
        </Link>
      </div>

      {/* Navigation List grouped as per reference */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 custom-scrollbar">
        
        {isCitizen ? (
          /* CITIZEN NAVIGATION */
          <div className="space-y-0.5">
            {!isCollapsed && (
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#1F2937] px-3 py-1">
                PUBLIC SERVICES
              </div>
            )}

            <Link
              href="/map"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/map' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
              }`}
              >
              <Map className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Road & Safety Status</span>}
            </Link>

            <Link
              href="/report"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/report' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
              }`}
              >
              <AlertOctagon className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Report Road Issue</span>}
            </Link>

            <Link
              href="/routes"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/routes' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
              }`}
              >
              <Navigation className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Find Safe Route</span>}
            </Link>

            <Link
              href="/weather"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/weather' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
              }`}
              >
              <CloudRain className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">Weather & Risk Alerts</span>}
            </Link>

            <Link
              href="/reports/track"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/reports/track' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
              }`}
              >
              <FileText className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span className="truncate flex-1">My Reports</span>}
            </Link>

            <Link
              href="/profile"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location === '/profile' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
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
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#1F2937] px-3 py-1">
                  OPERATIONS
                </div>
              )}

              <Link
                href="/map"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/map'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
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
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
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
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
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
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
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
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
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
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
                }`}
              >
                <Radio className={`w-4 h-4 shrink-0 ${location === '/my-cargo' || location === '/track-delivery' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Track Delivery</span>}
              </Link>
            </div>

            {/* INTELLIGENCE */}
            <div className="space-y-0.5 pt-2 border-t border-slate-800/80">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#1F2937] px-3 py-1">
                  INTELLIGENCE
                </div>
              )}

              <Link
                href="/weather"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/weather'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
                }`}
              >
                <CloudRain className={`w-4 h-4 shrink-0 ${location === '/weather' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Weather & Risk</span>}
              </Link>

            </div>

            {/* MORE */}
            <div className="space-y-0.5 pt-2 border-t border-slate-800/80">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#1F2937] px-3 py-1">
                  MORE
                </div>
              )}

              <Link
                href="/reports/track"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location === '/reports/track'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:bg-slate-100 text-[#1F2937] hover:text-[#1F2937]'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${location === '/reports/track' ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1">Reports</span>}
              </Link>

            </div>
          </React.Fragment>
        )}

      </div>

    </aside>
  );
};

