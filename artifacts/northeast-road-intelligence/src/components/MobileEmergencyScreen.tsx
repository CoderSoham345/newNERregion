import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import { NER_GOVERNMENT_DIRECTORY } from '../data/nerGovernmentDirectory';
import { OFFICIAL_HELPLINES } from '../data/helplinesData';
import {
  PhoneCall,
  Shield,
  HeartPulse,
  Flame,
  Building2,
  ExternalLink,
  MapPin,
  Globe,
  Radio,
  Search,
  CheckCircle2,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useLocation } from 'wouter';

export const MobileEmergencyScreen: React.FC = () => {
  const { selectedState, setSelectedState } = useOperating();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'quick' | 'directory'>('quick');
  const [searchQuery, setSearchQuery] = useState('');

  const currentStateId: StateId = selectedState === 'All states' ? 'Assam' : (selectedState as StateId);
  const stateDir = NER_GOVERNMENT_DIRECTORY[currentStateId] || NER_GOVERNMENT_DIRECTORY['Assam'];

  return (
    <div className="space-y-4 pb-20 px-3 pt-2">
      {/* Top Banner */}
      <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              OFFICIAL NER DIRECTORY
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-80">24x7 SEOC Link</span>
        </div>
        <h1 className="text-lg font-black tracking-tight">NER Emergency Assistance</h1>
        <p className="text-[11px] text-red-100 leading-snug">
          Instant high-priority dialer for State Emergency Ops (SEOC), Police, Medical Dispatch, and PWD Highway clearances.
        </p>

        {/* State Selector */}
        <div className="pt-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as OperatingState)}
            className="w-full bg-red-700/80 border border-red-400/50 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-white outline-none cursor-pointer"
          >
            {ALL_STATES.map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-white">
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Dial 1-Touch Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href="tel:112"
          className="p-3.5 rounded-2xl bg-blue-600 active:bg-blue-700 text-white flex flex-col justify-between shadow-md active:scale-95 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/20">POLICE / 112</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono">112</div>
            <div className="text-[10px] text-blue-100 font-medium">National Emergency</div>
          </div>
        </a>

        <a
          href="tel:108"
          className="p-3.5 rounded-2xl bg-emerald-600 active:bg-emerald-700 text-white flex flex-col justify-between shadow-md active:scale-95 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <HeartPulse className="w-5 h-5" />
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/20">AMBULANCE</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono">108</div>
            <div className="text-[10px] text-emerald-100 font-medium">Trauma & Medical</div>
          </div>
        </a>

        <a
          href="tel:1070"
          className="p-3.5 rounded-2xl bg-amber-600 active:bg-amber-700 text-white flex flex-col justify-between shadow-md active:scale-95 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <Radio className="w-5 h-5" />
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/20">SDMA SEOC</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono">1070</div>
            <div className="text-[10px] text-amber-100 font-medium">Disaster Control</div>
          </div>
        </a>

        <a
          href="tel:1033"
          className="p-3.5 rounded-2xl bg-purple-600 active:bg-purple-700 text-white flex flex-col justify-between shadow-md active:scale-95 transition-transform touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/20">NHAI / HIGHWAY</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono">1033</div>
            <div className="text-[10px] text-purple-100 font-medium">Road Hazard Help</div>
          </div>
        </a>
      </div>

      {/* State Specific Official Directory */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
            {stateDir.stateName} State Roster
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">Verified .gov.in</span>
        </div>

        {/* SEOC Contact Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {stateDir.seocContact.name}
                </h3>
                <p className="text-[10px] text-slate-500">State Disaster Management Authority</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
              Active
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            Toll-Free: {stateDir.seocContact.tollFree} · Phone: {stateDir.seocContact.phone}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={`tel:${stateDir.seocContact.tollFree.replace(/[^0-9]/g, '') || stateDir.seocContact.phone.replace(/[^0-9]/g, '')}`}
              className="py-2 bg-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>CALL SEOC</span>
            </a>
            <button
              onClick={() => setLocation('/map')}
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>MAP</span>
            </button>
            <a
              href={stateDir.seocContact.website}
              target="_blank"
              rel="noreferrer"
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <Globe className="w-3.5 h-3.5 text-red-500" />
              <span>WEBSITE</span>
            </a>
          </div>
        </div>

        {/* Police Headquarters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {stateDir.policeContact.name}
                </h3>
                <p className="text-[10px] text-slate-500">State Police & Highway Patrol</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-bold">
              Dial 100 / 112
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            Emergency: {stateDir.policeContact.emergencyNumber} · Control: {stateDir.policeContact.controlRoom}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={`tel:${stateDir.policeContact.emergencyNumber.replace(/[^0-9]/g, '') || '112'}`}
              className="py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>CALL</span>
            </a>
            <button
              onClick={() => setLocation('/map')}
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>MAP</span>
            </button>
            <a
              href={stateDir.policeContact.website}
              target="_blank"
              rel="noreferrer"
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>WEBSITE</span>
            </a>
          </div>
        </div>

        {/* Medical & Ambulance Dispatch */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {stateDir.medicalContact.serviceName}
                </h3>
                <p className="text-[10px] text-slate-500">Emergency Medical & Trauma Dispatch</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
              Dial 108
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            Ambulance: {stateDir.medicalContact.ambulanceNumber} · Direct: {stateDir.medicalContact.directLine}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={`tel:${stateDir.medicalContact.ambulanceNumber.replace(/[^0-9]/g, '') || '108'}`}
              className="py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>CALL 108</span>
            </a>
            <button
              onClick={() => setLocation('/map')}
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>MAP</span>
            </button>
            <a
              href={stateDir.medicalContact.website}
              target="_blank"
              rel="noreferrer"
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>WEBSITE</span>
            </a>
          </div>
        </div>

        {/* PWD Highways / Road Authority */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {stateDir.pwdRoadAuthority.departmentName}
                </h3>
                <p className="text-[10px] text-slate-500">Highway Clearance & Heavy Machinery</p>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            Helpline: {stateDir.pwdRoadAuthority.helpline || '1033'}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={`tel:${(stateDir.pwdRoadAuthority.helpline || '1033').replace(/[^0-9]/g, '')}`}
              className="py-2 bg-purple-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>CALL</span>
            </a>
            <button
              onClick={() => setLocation('/map')}
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-500" />
              <span>MAP</span>
            </button>
            <a
              href={stateDir.pwdRoadAuthority.website}
              target="_blank"
              rel="noreferrer"
              className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
            >
              <Globe className="w-3.5 h-3.5 text-purple-500" />
              <span>PORTAL</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
