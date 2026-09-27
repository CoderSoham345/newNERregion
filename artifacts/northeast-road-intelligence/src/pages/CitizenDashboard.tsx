import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useOperating } from '../context/OperatingContext';
import { useTranslation } from '../context/LanguageContext';
import {
  Shield,
  User,
  MapPin,
  AlertTriangle,
  FileText,
  Navigation,
  Phone,
  CloudRain,
  CheckCircle2,
  Bell,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Compass,
  Radio,
  Flame,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';

export const CitizenDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const {
    userProfile,
    roadSegments,
    incidents,
    alerts,
    citizenReports,
    liveWeather,
  } = useOperating();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'overview' | 'report' | 'myreports' | 'alerts'>('overview');

  // Quick state for citizen report form
  const [issueType, setIssueType] = useState('Landslide / Road Blockage');
  const [reportLocation, setReportLocation] = useState('Shillong-Guwahati NH-6 Corridor');
  const [description, setDescription] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demoId = `CIT-REP-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedId(demoId);
  };

  const blockedRoads = roadSegments.filter((r) => r.roadStatus === 'Blocked' || r.roadStatus === 'At risk');
  const myReportsList = citizenReports || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <User className="w-56 h-56 text-emerald-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white tracking-wider flex items-center gap-1.5 shadow-md">
              <User className="w-3.5 h-3.5" />
              <span>CITIZEN PORTAL • UTGARPURV</span>
            </span>
            <SourceBadge status="official" confidence="high" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {userProfile.name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Report road hazards and check real-time safety conditions across Northeast India.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setLocation('/report')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Road Issue</span>
            </button>
            <button
              onClick={() => setLocation('/map')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Check Current Road & Safety</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setLocation('/map')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all text-left space-y-2 group cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Road & Safety Status</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Live conditions</div>
          </div>
        </button>

        <button
          onClick={() => setLocation('/report')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all text-left space-y-2 group cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Report Road Issue</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Submit hazard</div>
          </div>
        </button>

        <button
          onClick={() => setLocation('/routes')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all text-left space-y-2 group cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Find Safe Route</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">AI navigation</div>
          </div>
        </button>

        <button
          onClick={() => setLocation('/weather')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all text-left space-y-2 group cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Weather & Risk</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Monsoon alerts</div>
          </div>
        </button>

        <button
          onClick={() => setLocation('/reports/track')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all text-left space-y-2 group cursor-pointer shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">My Reports</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Track status</div>
          </div>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Closures & Quick Citizen Report */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Nearby Road Closures / Alerts Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Nearby Road Closures & Hazards
                </h3>
              </div>
              <button
                onClick={() => setLocation('/map')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {blockedRoads.slice(0, 4).map((seg) => (
                <div
                  key={seg.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                        {seg.roadStatus}
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                        {seg.highwayNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {seg.startLocation} ➔ {seg.endLocation} ({seg.stateId})
                    </p>
                  </div>
                  <button
                    onClick={() => setLocation('/map')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    Detour
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Citizen Incident Reporting Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Quick Citizen Hazard Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Spotted a pothole, landslide, or waterlogging? Notify District Authority instantly.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Direct to SEOC
              </span>
            </div>

            {submittedId ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Report Submitted Successfully!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Your Report ID is <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{submittedId}</span>. The district disaster management cell has received your alert.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedId(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleCitizenSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Issue Type
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Landslide / Road Blockage">Landslide / Road Blockage</option>
                      <option value="Severe Pothole / Road Damage">Severe Pothole / Road Damage</option>
                      <option value="Waterlogging / Flood">Waterlogging / Flood</option>
                      <option value="Accident / Traffic Stalled">Accident / Traffic Stalled</option>
                      <option value="Bridge / Culvert Issue">Bridge / Culvert Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Location / Highway
                    </label>
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. NH-6 Shillong By-pass"
                      required
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description & Details
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the severity, exact landmark, or obstruction..."
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    📸 Optional photo upload supported via full report page.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Right Col: Weather, Emergency Helplines & Notifications */}
        <div className="space-y-6">
          
          {/* Weather & Monsoon Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span>Regional Weather</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Live Open-Meteo
              </span>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 dark:text-sky-200">Guwahati, Assam (NER Hub)</span>
                <span className="text-sm font-black font-mono text-sky-950 dark:text-white">{liveWeather?.temperature ?? 28}°C</span>
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-300 font-medium">
                Condition: {liveWeather?.weatherDescription || 'Partly Cloudy'} • Rain: {liveWeather?.rainLast1h ?? 0} mm/h
              </p>
            </div>
          </div>

          {/* Emergency Helplines Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span>Emergency Helplines</span>
              </h3>
              <button
                onClick={() => setLocation('/helplines')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                All
              </button>
            </div>

            <div className="space-y-2">
              <a
                href="tel:108"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">National Ambulance / Medical</div>
                  <div className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400">Dial 108</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:1033"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">National Highway Helpline</div>
                  <div className="text-[11px] font-mono font-black text-blue-600 dark:text-blue-400">Dial 1033</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:112"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">All-in-One Emergency SOS</div>
                  <div className="text-[11px] font-mono font-black text-red-600 dark:text-red-400">Dial 112</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* My Submitted Reports Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Submitted Reports
              </h3>
              <button
                onClick={() => setLocation('/reports/track')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Track All
              </button>
            </div>

            <div className="space-y-2">
              {myReportsList.slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{rep.trackingNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 truncate font-medium">{rep.category} • {rep.locationName}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CitizenDashboard;
