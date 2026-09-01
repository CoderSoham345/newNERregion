import React, { useState, useEffect } from 'react';
import { useOperating, type UserRole } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import { LANGUAGES, type SupportedLanguage } from '../data/translations';
import {
  Shield,
  AlertTriangle,
  Search,
  Moon,
  Sun,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  User,
  Activity,
  Layers,
  MapPin,
  Truck,
  CheckCircle2,
  X,
  FileText,
  HelpCircle,
  ExternalLink,
  Database,
  Radio,
  Sliders,
  Sparkles,
  Bot,
  Clock,
  Menu,
  LogOut,
  Globe,
  Compass,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { LoginModal } from './LoginModal';
import { AiAssistantModal } from './AiAssistantModal';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
  onOpenSystemHealth?: () => void;
  onOpenAuditLog?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onOpenSystemHealth, onOpenAuditLog }) => {
  const {
    currentLanguage,
    setLanguage,
    t,
    isCitizenMode,
    toggleCitizenMode,
    selectedState,
    setSelectedState,
    emergencyMode,
    toggleEmergencyMode,
    demoMode,
    toggleDemoMode,
    darkMode,
    toggleDarkMode,
    isOnline,
    pendingOfflineReportsCount,
    syncOfflineData,
    liveWeather,
    refreshWeather,
    userProfile,
    loginUser,
    logoutUser,
    activeAlertsCount,
    alerts,
    markAlertRead,
    roadSegments,
    cargoList,
    vehicles,
    incidents,
    inspectRoad,
    inspectCargo,
    inspectVehicle,
    inspectIncident,
  } = useOperating();

  const [, setLocation] = useLocation();

  // Dynamic Live IST Clock (updates every second)
  const [istTime, setIstTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
  });
  const [istDate, setIstDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
      setIstDate(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  // Global Search Filtering
  const matchingRoads = searchQuery.trim().length > 1
    ? roadSegments.filter(
        (r) =>
          r.highwayNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.endLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.districtName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingCargo = searchQuery.trim().length > 1
    ? cargoList.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.destination.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingVehicles = searchQuery.trim().length > 1
    ? vehicles.filter(
        (v) =>
          v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.driverName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingIncidents = searchQuery.trim().length > 1
    ? incidents.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.highwayNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.districtName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleManualSync = async () => {
    setSyncing(true);
    await syncOfflineData();
    await refreshWeather();
    setTimeout(() => setSyncing(false), 800);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-900 text-white border-b border-slate-800 transition-colors shadow-sm">
        {/* Top Demo Mode Banner if Enabled */}
        {demoMode && (
          <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-slate-950" />
              <span>
                DEMO MODE ACTIVE — Telemetry, test vehicles, and manifests are SIMULATED for SIH evaluation purposes.
              </span>
            </div>
            <button
              onClick={toggleDemoMode}
              className="underline hover:text-white text-[11px] font-black cursor-pointer ml-2"
            >
              Switch to Real-Data First Mode
            </button>
          </div>
        )}

        {/* Top Notification Bar if Emergency Mode is Active */}
        {emergencyMode && (
          <div className="bg-red-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                EMERGENCY PROTOCOL ACTIVATED: High-priority relief corridors, disaster staging hubs, and hospital supply lines are prioritized.
              </span>
            </div>
            <button
              onClick={toggleEmergencyMode}
              className="underline hover:text-red-100 text-[11px] font-bold cursor-pointer shrink-0 ml-2"
            >
              Deactivate Emergency
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Menu Toggle & Brand Identity */}
          <div className="flex items-center gap-3">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs tracking-tight">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-white">
                    UttarPURV
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-800">
                    NER-INTEL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block font-medium truncate max-w-[220px] lg:max-w-none">
                  {t('brandTagline', 'Northeast India Safety, Road & Disaster Intelligence')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Global State Selector & Search */}
          <div className="flex items-center gap-2 flex-1 max-w-xl justify-center">
            {/* Citizen Mode vs Command Center Mode Switch */}
            <button
              onClick={toggleCitizenMode}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isCitizenMode
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/80 hover:bg-amber-900'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 text-slate-200'
              }`}
              title="Toggle between Simplified Citizen Mode and Government Command Center"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isCitizenMode ? t('citizenMode', 'Citizen Mode') : t('governmentMode', 'Command Center')}</span>
            </button>

            {/* Operating State Selector */}
            <div className="relative flex items-center">
              <MapPin className="w-3.5 h-3.5 absolute left-2.5 text-emerald-400 pointer-events-none" />
              <select
                id="global-state-selector"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as OperatingState)}
                className="pl-8 pr-7 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold text-slate-100 rounded-xl border border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
              >
                {ALL_STATES.map((state) => (
                  <option key={state} value={state} className="bg-slate-900 text-white">
                    {state === 'All states' ? `🌐 ${t('allStates', 'All 8 NE States')}` : `📍 ${state}`}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 hidden md:block">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Highway (NH-6), Segment, District, Cargo..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {searchOpen && searchQuery.trim().length > 1 && (
                <div
                  className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-2 z-50 max-h-96 overflow-y-auto"
                  onMouseLeave={() => setSearchOpen(false)}
                >
                  {matchingRoads.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                        Roads & Corridors
                      </div>
                      {matchingRoads.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            inspectRoad(r.id);
                            setSearchOpen(false);
                            setLocation('/map');
                          }}
                          className="p-2 hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-white">{r.highwayNumber}</span>
                            <span className="text-slate-400 ml-1.5">
                              {r.startLocation} → {r.endLocation}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              r.roadStatus === 'Accessible'
                                ? 'bg-emerald-950 text-emerald-300'
                                : r.roadStatus === 'Blocked'
                                ? 'bg-red-950 text-red-300'
                                : 'bg-amber-950 text-amber-300'
                            }`}
                          >
                            {r.roadStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingCargo.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                        Cargo & Shipments
                      </div>
                      {matchingCargo.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            inspectCargo(c.id);
                            setSearchOpen(false);
                            setLocation('/cargo');
                          }}
                          className="p-2 hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-white">{c.name}</span>
                            <span className="text-slate-400 ml-1.5">to {c.destination}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingRoads.length === 0 && matchingCargo.length === 0 && (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No matching records found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Dynamic IST Clock, AI Assistant Button & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                title="Change Platform Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 border-b border-slate-800 mb-1">
                    Select Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Live IST Clock */}
            <div className="hidden 2xl:flex flex-col items-end px-3 py-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-right">
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{istTime}</span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium">{istDate}</div>
            </div>

            {/* Floating/Header "Ask UttarPURV AI" Button */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('askAiAction', 'Ask UttarPURV AI')}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {activeAlertsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>

              {alertsDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-3 z-50"
                  onMouseLeave={() => setAlertsDropdownOpen(false)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">Active System Alerts</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {activeAlertsCount} Unread
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 py-2">
                    {alerts.slice(0, 4).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          markAlertRead(a.id);
                          setAlertsDropdownOpen(false);
                          setLocation('/alerts');
                        }}
                        className="p-2 bg-slate-800/80 hover:bg-slate-800 rounded-xl cursor-pointer text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{a.title}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded ${
                              a.severity === 'Critical'
                                ? 'bg-red-950 text-red-300'
                                : 'bg-amber-950 text-amber-300'
                            }`}
                          >
                            {a.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{a.content}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/alerts"
                    onClick={() => setAlertsDropdownOpen(false)}
                    className="block text-center text-xs text-emerald-400 hover:underline font-bold pt-2 border-t border-slate-800"
                  >
                    View All Alerts →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Avatar / Login & Logout */}
            <div className="flex items-center gap-1.5">
              {userProfile.isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 cursor-pointer"
                    title={`${userProfile.name} (${userProfile.email || 'Officer'}) • ${userProfile.role}`}
                  >
                    <div className="text-left hidden md:block">
                      <div className="font-bold truncate max-w-[110px] leading-tight text-white">
                        {userProfile.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[110px] leading-tight">
                        {userProfile.role}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      logoutUser();
                      setLocation('/login');
                    }}
                    title="Sign Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login / Onboarding Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </>
  );
};
