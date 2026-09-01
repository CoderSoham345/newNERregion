import React, { useState } from 'react';
import { useOperating, type UserRole } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import {
  User,
  Shield,
  Phone,
  Building,
  MapPin,
  CheckCircle2,
  Bell,
  Radio,
  Moon,
  Sun,
  ShieldCheck,
  Save,
  LogOut,
  AlertTriangle,
  Globe,
  Sliders,
  Mail,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { SourceBadge } from '../components/SourceBadge';

export const MyProfilePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const {
    userProfile,
    loginUser,
    logoutUser,
    demoMode,
    toggleDemoMode,
    darkMode,
    toggleDarkMode,
    setSelectedState,
    setSelectedDistrictId,
  } = useOperating();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email || 'officer@uttarpurv.gov.in');
  const [mobile, setMobile] = useState(userProfile.mobile);
  const [role, setRole] = useState<UserRole>(userProfile.role);
  const [department, setDepartment] = useState(userProfile.department);
  const [assignedState, setAssignedState] = useState<StateId | 'All states'>(
    userProfile.assignedState
  );
  const [assignedDistrict, setAssignedDistrict] = useState<string>(
    userProfile.assignedDistrict || 'East Khasi Hills (Shillong)'
  );

  // Preference switches
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [landslideWarnings, setLandslideWarnings] = useState(true);
  const [cargoRerouting, setCargoRerouting] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableDistricts =
    assignedState !== 'All states' && STATES_DATA[assignedState as StateId]
      ? STATES_DATA[assignedState as StateId].districts
      : [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: name.trim() || 'Officer in Charge',
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      role,
      department: department.trim() || 'NER Operations Command',
      assignedState,
      assignedDistrict,
    });
    if (assignedState !== 'All states') {
      setSelectedState(assignedState);
      const matchedDist = availableDistricts.find((d) => d.name === assignedDistrict);
      if (matchedDist) {
        setSelectedDistrictId(matchedDist.id);
      }
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logoutUser();
    setLocation('/login');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center text-white text-2xl font-black shadow-md">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">{userProfile.name}</h1>
              <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded border border-emerald-800">
                {userProfile.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {userProfile.email} • {userProfile.department} • Badge: {userProfile.badgeId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHENTICATED</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile configuration saved. Operating context and local assignments updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Officer Profile & Operational Jurisdiction
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Official Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Account Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Mobile
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Operational Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Logistics Operator">Logistics Operator</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Emergency Responder">Emergency Responder</option>
                    <option value="Government Official">Government Official</option>
                    <option value="Transporter">Transporter</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Citizen / Viewer">Citizen / Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Department / Agency
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assigned State
                  </label>
                  <select
                    value={assignedState}
                    onChange={(e) => {
                      const st = e.target.value as StateId | 'All states';
                      setAssignedState(st);
                      if (st !== 'All states' && STATES_DATA[st]?.districts.length > 0) {
                        setAssignedDistrict(STATES_DATA[st].districts[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ALL_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Operational District
                  </label>
                  <select
                    value={assignedDistrict}
                    onChange={(e) => setAssignedDistrict(e.target.value)}
                    disabled={assignedState === 'All states'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {assignedState === 'All states' ? (
                      <option value="All districts">All Districts</option>
                    ) : (
                      availableDistricts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile & Jurisdiction</span>
                </button>
              </div>
            </form>
          </div>

          {/* Alert Preferences */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Operational Notification Streams
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Emergency Broadcast Alerts (Red Priority)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Receive immediate notices when State SEOC activates highway red zones
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={(e) => setEmergencyAlerts(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Landslide Saturation & Blockage Warnings
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Triggers notifications when slope saturation index exceeds 80% on active corridors
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={landslideWarnings}
                  onChange={(e) => setLandslideWarnings(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    AI Logistics Auto-Reroute Recommendations
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Suggest lower-risk alternative routes when primary highway suffers bottleneck
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={cargoRerouting}
                  onChange={(e) => setCargoRerouting(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Controls */}
        <div className="space-y-6">
          {/* Data Honesty Card */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              UttarPURV Data Policy
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              UttarPURV is designed with strict data provenance. Real feeds are used for weather (Open-Meteo REST) and basemaps (MapTiler). Historical demographic data explicitly references Census of India.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>• Demographic Source: Census of India / MDoNER</div>
              <div>• Telemetry Mode: {demoMode ? 'SIMULATED DEMO' : 'LIVE / REAL-DATA FIRST'}</div>
            </div>
          </div>

          {/* Quick System Toggles */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Platform Mode Controls
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Evaluation Demo Mode
                </div>
                <div className="text-[10px] text-slate-500">
                  {demoMode ? 'Simulated fleets active' : 'Strict real-data mode'}
                </div>
              </div>
              <button
                onClick={toggleDemoMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  demoMode
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {demoMode ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Theme Mode</div>
                <div className="text-[10px] text-slate-500">
                  {darkMode ? 'Dark Command View' : 'Light Operations View'}
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer flex items-center gap-1.5"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                <span>{darkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
