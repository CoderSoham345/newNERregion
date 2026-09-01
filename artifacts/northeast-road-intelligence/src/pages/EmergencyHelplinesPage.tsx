import React, { useState } from 'react';
import { Link } from 'wouter';
import { useOperating } from '../context/OperatingContext';
import { MobileEmergencyScreen } from '../components/MobileEmergencyScreen';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import { NER_GOVERNMENT_DIRECTORY, type StateOfficialDirectory } from '../data/nerGovernmentDirectory';
import { OFFICIAL_HELPLINES, type HelplineItem } from '../data/helplinesData';
import {
  PhoneCall,
  Search,
  ShieldCheck,
  Building2,
  ExternalLink,
  Shield,
  HeartPulse,
  Flame,
  Truck,
  Crosshair,
  AlertTriangle,
  Info,
  CheckCircle2,
  Phone,
  Navigation,
  Globe,
  Radio,
} from 'lucide-react';

export const EmergencyHelplinesPage: React.FC = () => {
  const { selectedState, setSelectedState } = useOperating();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<'all' | 'directory' | 'facilities'>('all');

  const statesList: StateId[] = [
    'Assam',
    'Arunachal Pradesh',
    'Meghalaya',
    'Manipur',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim',
  ];

  // Filter 8-state directory by state & search query
  const filteredStates = statesList.filter((st) => {
    if (selectedState !== 'All states' && st !== selectedState) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const dir = NER_GOVERNMENT_DIRECTORY[st];
    return (
      dir.stateName.toLowerCase().includes(q) ||
      dir.capital.toLowerCase().includes(q) ||
      dir.seocContact.name.toLowerCase().includes(q) ||
      dir.policeContact.name.toLowerCase().includes(q) ||
      dir.medicalContact.serviceName.toLowerCase().includes(q) ||
      dir.pwdRoadAuthority.departmentName.toLowerCase().includes(q) ||
      dir.additionalPortals.some((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Mobile-first High-Visibility Emergency Screen */}
      <div className="block md:hidden">
        <MobileEmergencyScreen />
      </div>

      {/* Desktop Comprehensive Directory */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-16">
        {/* Top Banner Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-red-900 text-red-200 border border-red-700 tracking-wider uppercase">
                Official Directory
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                100% Government Verified Sources (.gov.in / nic.in)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              NER Emergency & Government Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Direct official portals, State Disaster Management Authorities (SEOC), Police Headquarters, PWD Highways, and Ambulance dispatch centers for all 8 North Eastern States.
            </p>
          </div>

          {/* State Selector */}
          <div className="flex items-center gap-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as OperatingState)}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {ALL_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state / department / emergency service / helpline number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Mandatory Official Government Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 p-4 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Official Government Source Verification:</strong> Emergency information is aggregated strictly from verified state government portals (.gov.in / nic.in) and official State Disaster Management Authority rosters. Numbers should be verified prior to non-emergency administrative routing.
        </div>
      </div>

      {/* National Emergency Fallback - 112 (Strictly separate from state-specific rooms) */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white p-5 rounded-2xl border border-red-800/70 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                National Emergency Fallback
              </span>
              <span className="text-xs text-red-300 font-semibold">Single Unified Pan-India Number</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              112 — Emergency Response Support System (ERSS)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              National emergency fallback integrating Police (100), Fire (101), Ambulance (108/102), and State Disaster Relief under one unified national GIS dispatch system.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:112"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 Now</span>
            </a>
            <a
              href="https://112.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span>112.gov.in</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 8-STATE CARDS DIRECTORY */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Official State Disaster & Authority Desks (All 8 NER States)</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Showing {filteredStates.length} of 8 States
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStates.map((stId) => {
            const stateDir = NER_GOVERNMENT_DIRECTORY[stId];
            const stateMeta = STATES_DATA[stId];

            return (
              <div
                key={stId}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* State Card Header */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {stateDir.stateName}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        Capital: {stateDir.capital}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {stateMeta?.districtCount || 0} Districts • {stateMeta?.monitoredHighways || 0} Monitored Corridors
                    </p>
                  </div>

                  <a
                    href={stateDir.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* State Contacts Grid */}
                <div className="p-5 space-y-4">
                  {/* SEOC / Disaster Management */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            State Disaster Management Authority (SEOC)
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {stateDir.seocContact.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                        Verified: {stateDir.seocContact.lastVerified}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${stateDir.seocContact.tollFree.split('/')[0].trim()}`}
                        className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Toll-Free: {stateDir.seocContact.tollFree}</span>
                      </a>
                      {stateDir.seocContact.website && (
                        <a
                          href={stateDir.seocContact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Website</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Police & Law Enforcement */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            State Police Control Room
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {stateDir.policeContact.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                        Verified: {stateDir.policeContact.lastVerified}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${stateDir.policeContact.emergencyNumber.split('/')[0].trim()}`}
                        className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Dial {stateDir.policeContact.emergencyNumber}</span>
                      </a>
                      <a
                        href={`tel:${stateDir.policeContact.controlRoom}`}
                        className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1"
                      >
                        <span>Desk: {stateDir.policeContact.controlRoom}</span>
                      </a>
                    </div>
                  </div>

                  {/* Medical Ambulance & Fire Services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Ambulance */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Medical / Ambulance</span>
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        {stateDir.medicalContact.serviceName}
                      </div>
                      <a
                        href={`tel:${stateDir.medicalContact.ambulanceNumber}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call {stateDir.medicalContact.ambulanceNumber}</span>
                      </a>
                    </div>

                    {/* Fire */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Fire & Emergency</span>
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        {stateDir.fireContact.serviceName}
                      </div>
                      <a
                        href={`tel:${stateDir.fireContact.emergencyNumber}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call {stateDir.fireContact.emergencyNumber}</span>
                      </a>
                    </div>
                  </div>

                  {/* PWD Road Authority & BRO Desk */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {stateDir.pwdRoadAuthority.departmentName}
                        </span>
                      </div>
                      {stateDir.pwdRoadAuthority.website && (
                        <a
                          href={stateDir.pwdRoadAuthority.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>PWD Portal</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {stateDir.pwdRoadAuthority.description}
                    </p>
                    {stateDir.broProjectDesk && (
                      <div className="pt-1 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                        BRO Liaison: <strong className="text-slate-800 dark:text-slate-200">{stateDir.broProjectDesk.projectName}</strong> ({stateDir.broProjectDesk.headquarters})
                      </div>
                    )}
                  </div>

                  {/* Additional Official Government Portals */}
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Verified State Portals (.gov.in):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stateDir.additionalPortals.map((portal, pIdx) => (
                        <a
                          key={pIdx}
                          href={portal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                        >
                          <span>{portal.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};
