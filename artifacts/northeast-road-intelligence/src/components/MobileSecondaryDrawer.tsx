import React from 'react';
import { useLocation } from 'wouter';
import {
  X,
  Bell,
  Truck,
  PhoneCall,
  Shield,
  BarChart3,
  Settings,
  CloudRain,
  Radio,
  FileSpreadsheet,
  Globe,
  Database,
  Navigation,
  Mountain,
  Layers,
  Bot,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';

interface MobileSecondaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSecondaryDrawer: React.FC<MobileSecondaryDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [, setLocation] = useLocation();
  const {
    selectedState,
    setSelectedState,
    emergencyMode,
    toggleEmergencyMode,
    demoMode,
    toggleDemoMode,
    isOnline,
    pendingOfflineReportsCount,
    syncOfflineData,
    activeAlertsCount,
    runAiIncidentSimulation,
    isSimulatingIncident,
  } = useOperating();

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    setLocation(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer content */}
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-5 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              UTTARPŪRV · FIELD INTELLIGENCE
            </span>
            <h3 className="text-base font-black text-white">Operations & Toolsets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 NER States Quick Switcher */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Active Operating State ({selectedState})
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {ALL_STATES.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-manipulation ${
                  selectedState === st
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Field Demo Button */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 to-slate-900 rounded-2xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                Assam Smart Corridor (Pilot)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px]">
              BARAK VALLEY
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Interactive 90-second SIH presentation engine: Silchar-Hailakandi medicine reroute, AI explainability & multi-agency response.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={() => navigateTo('/assam-corridor')}
              className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-98 cursor-pointer touch-manipulation"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Pilot Dashboard</span>
            </button>
            <button
              onClick={() => {
                runAiIncidentSimulation();
                onClose();
                setLocation('/map');
              }}
              disabled={isSimulatingIncident}
              className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-98 cursor-pointer touch-manipulation"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSimulatingIncident ? 'Simulating...' : 'Run Quick Sim'}</span>
            </button>
          </div>
        </div>

        {/* Primary Operational Links */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigateTo('/alerts')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Alerts Center</div>
              <div className="text-[10px] text-slate-400">
                {activeAlertsCount} active warnings
              </div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/vehicles')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Live Vehicles</div>
              <div className="text-[10px] text-slate-400">Fleet GPS & VTS</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/helplines')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Emergency 112</div>
              <div className="text-[10px] text-slate-400">8 State Directory</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/governance')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Authority Room</div>
              <div className="text-[10px] text-slate-400">Dispatch & Actions</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/weather')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Weather Radar</div>
              <div className="text-[10px] text-slate-400">Live Open-Meteo</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/landslide-risk')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Landslide Risk</div>
              <div className="text-[10px] text-slate-400">Slope & Geo Models</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/reports/track')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Track Reports</div>
              <div className="text-[10px] text-slate-400">Pending & Synced</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('/routes')}
            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left touch-manipulation"
          >
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Safer Routes</div>
              <div className="text-[10px] text-slate-400">AI Bypass Engine</div>
            </div>
          </button>
        </div>

        {/* Offline Sync Controls */}
        <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-emerald-400 ring-4 ring-emerald-950' : 'bg-red-400 ring-4 ring-red-950'
              }`}
            />
            <div>
              <div className="text-xs font-bold text-white">
                {isOnline ? 'Network Connected' : 'Offline Mode Active'}
              </div>
              <div className="text-[10px] text-slate-400">
                {pendingOfflineReportsCount > 0
                  ? `${pendingOfflineReportsCount} reports waiting to sync`
                  : 'All local field data up to date'}
              </div>
            </div>
          </div>
          {isOnline && pendingOfflineReportsCount > 0 && (
            <button
              onClick={syncOfflineData}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-500"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
