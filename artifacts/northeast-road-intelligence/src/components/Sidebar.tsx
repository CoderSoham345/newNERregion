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
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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

  // Submenu toggle states
  const [openRiskIntel, setOpenRiskIntel] = useState(false);
  const [openLogistics, setOpenLogistics] = useState(false);
  const [openMore, setOpenMore] = useState(false);

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 select-none z-30 ${
        isOpenMobile ? 'fixed inset-y-0 left-0 w-64 shadow-2xl flex' : 'hidden lg:flex w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            उ
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-white uppercase">UTTARPŪRV</div>
            <div className="text-[9px] text-emerald-400 font-mono">NER Road Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation List - Guided Operational Workflow */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 custom-scrollbar">
        
        {/* START HERE */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 px-2.5 py-1">
            START HERE
          </div>
          
          <Link
            href="/"
            onClick={onCloseMobile}
            className={`flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 mt-0.5 shrink-0 ${location === '/' ? 'text-white' : 'text-slate-400'}`} />
            <div className="flex flex-col flex-1 truncate">
              <span className="font-bold">Command Center</span>
              <span className={`text-[9px] font-normal truncate ${location === '/' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Overview & live situation
              </span>
            </div>
            {blockedRoadsCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white self-center">
                {blockedRoadsCount}
              </span>
            )}
          </Link>
        </div>

        {/* MONITOR */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
            MONITOR
          </div>

          <Link
            href="/map"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/map'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Map className={`w-4 h-4 shrink-0 ${location === '/map' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Live GIS Map</span>
          </Link>
        </div>

        {/* DETECT */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
            DETECT
          </div>

          <Link
            href="/alerts"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/alerts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bell className={`w-4 h-4 shrink-0 ${location === '/alerts' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Alert Center</span>
            {activeAlertsCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                {activeAlertsCount}
              </span>
            )}
          </Link>

          <Link
            href="/disaster"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/disaster'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Flame className={`w-4 h-4 shrink-0 ${location === '/disaster' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Critical Incidents</span>
            {criticalIncidentsCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                {criticalIncidentsCount}
              </span>
            )}
          </Link>
        </div>

        {/* INVESTIGATE */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
            INVESTIGATE
          </div>

          {/* Risk Intelligence Submenu */}
          <div>
            <button
              onClick={() => setOpenRiskIntel(!openRiskIntel)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer`}
            >
              <Brain className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate flex-1 text-left">Risk Intelligence</span>
              {openRiskIntel ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openRiskIntel && (
              <div className="pl-6 pr-1 py-1 space-y-1 border-l border-slate-800 ml-4 my-1">
                <Link
                  href="/weather"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/weather' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Weather & Climate
                </Link>
                <Link
                  href="/landslide-risk"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/landslide-risk' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Landslide Intelligence
                </Link>
                <Link
                  href="/flood-risk"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/flood-risk' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Flood Intelligence
                </Link>
                <Link
                  href="/traffic"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/traffic' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Traffic Intelligence
                </Link>
                <Link
                  href="/states"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/states' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  State Intelligence
                </Link>
                <Link
                  href="/districts"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/districts' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  District Intelligence
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/roads"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/roads'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Route className={`w-4 h-4 shrink-0 ${location === '/roads' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Road Network</span>
          </Link>
        </div>

        {/* DECIDE */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
            DECIDE
          </div>

          <Link
            href="/routes"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/routes' || location === '/ai-routes' || location === '/compare'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60'
            }`}
          >
            <Navigation className={`w-4 h-4 shrink-0 ${location === '/routes' ? 'text-white' : 'text-emerald-400'}`} />
            <span className="truncate flex-1">AI Safe Routes</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>

          <Link
            href="/assam-corridor"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/assam-corridor'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="truncate flex-1">Assam Smart Corridor</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">PILOT</span>
          </Link>
        </div>

        {/* OPERATE */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
            OPERATE
          </div>

          {/* Logistics Submenu */}
          <div>
            <button
              onClick={() => setOpenLogistics(!openLogistics)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer`}
            >
              <Truck className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate flex-1 text-left">Logistics</span>
              {openLogistics ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openLogistics && (
              <div className="pl-6 pr-1 py-1 space-y-1 border-l border-slate-800 ml-4 my-1">
                <Link
                  href="/cargo"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/cargo' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Cargo Readiness
                </Link>
                <Link
                  href="/my-cargo"
                  onClick={onCloseMobile}
                  className={`block px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    location === '/my-cargo' ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  My Shipments & At-Risk Deliveries
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/vehicles"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/vehicles'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Radio className={`w-4 h-4 shrink-0 ${location === '/vehicles' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Live Vehicles</span>
            {demoMode && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </Link>
        </div>

        {/* ACT */}
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
            ACT
          </div>

          <Link
            href="/report"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/report'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <AlertOctagon className={`w-4 h-4 shrink-0 ${location === '/report' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Field Report</span>
          </Link>

          <Link
            href="/helplines"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/helplines' || location === '/nearest-services'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <PhoneCall className={`w-4 h-4 shrink-0 ${location === '/helplines' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Emergency Directory</span>
          </Link>

          <Link
            href="/governance"
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              location === '/governance'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 shrink-0 ${location === '/governance' ? 'text-white' : 'text-slate-400'}`} />
            <span className="truncate flex-1">Authority Room</span>
          </Link>
        </div>

        {/* MORE / SECONDARY */}
        <div className="space-y-0.5 pt-2 border-t border-slate-800">
          <button
            onClick={() => setOpenMore(!openMore)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer`}
          >
            <Layers className="w-4 h-4 shrink-0 text-slate-400" />
            <span className="truncate flex-1 text-left">MORE</span>
            {openMore ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openMore && (
            <div className="pl-6 pr-1 py-1 space-y-1 border-l border-slate-800 ml-4 my-1">
              <Link
                href="/news"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Northeast Situation News
              </Link>
              <Link
                href="/reports/track"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Citizen Reports & Tracking
              </Link>
              <Link
                href="/nearest-services"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Nearest Police & Medical
              </Link>
              <Link
                href="/compare"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Analytics & Benchmarking
              </Link>
              <Link
                href="/data-sources"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Data Source Matrix
              </Link>
              <Link
                href="/audit"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Audit & System Health
              </Link>
              <Link
                href="/profile"
                onClick={onCloseMobile}
                className="block px-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800"
              >
                My Profile & Jurisdiction
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* User Quick Info & Sign Out */}
      <div className="p-3 m-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{userProfile.name}</div>
              <div className="text-[10px] text-emerald-400 truncate font-mono">
                🟢 Online
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              if (onCloseMobile) onCloseMobile();
              setLocation('/login');
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/70 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="truncate">{userProfile.role}</span>
          <Link
            href="/profile"
            onClick={onCloseMobile}
            className="text-emerald-400 hover:underline font-bold shrink-0 ml-1"
          >
            Profile →
          </Link>
        </div>
      </div>
    </aside>
  );
};
