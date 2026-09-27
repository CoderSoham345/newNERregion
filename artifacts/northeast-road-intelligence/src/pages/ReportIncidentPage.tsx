import React, { useState, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useTranslation } from '../context/LanguageContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import { type ReportCategory } from '../data/citizenReports';
import { SourceBadge } from '../components/SourceBadge';
import {
  saveOfflineReport,
  getPendingOfflineReports,
  subscribeToOfflineSyncUpdates,
  type OfflineReportRecord,
} from '../lib/indexedDb';
import {
  AlertOctagon,
  Camera,
  MapPin,
  Send,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Compass,
  Radio,
  FileCheck2,
  Upload,
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { MobileIncidentReporting } from '../components/MobileIncidentReporting';

export const ReportIncidentPage: React.FC = () => {
  const {
    addCitizenReport,
    addIncidentReport,
    userProfile,
    isOnline,
    deviceGps,
    isLocatingDevice,
    requestDeviceLocation,
    inspectDataSource,
  } = useOperating();
  const { t, startVoiceInput, isListening } = useTranslation();
  const [, setLocation] = useLocation();

  const [userName, setUserName] = useState(userProfile?.name || 'Citizen User');
  const [userPhone, setUserPhone] = useState(userProfile?.mobile || '');
  const [stateId, setStateId] = useState<StateId>('Assam');
  const [districtId, setDistrictId] = useState('as-kamrup-metro');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Landslide');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Critical'>('High');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [capturedGps, setCapturedGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [generatedTrackingId, setGeneratedTrackingId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(0);
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToOfflineSyncUpdates((count) => {
      setPendingOfflineCount(count);
    });
    return () => unsub();
  }, []);

  const availableDistricts = STATES_DATA[stateId]?.districts || [];

  const handleStateChange = (st: StateId) => {
    setStateId(st);
    if (STATES_DATA[st]?.districts.length > 0) {
      setDistrictId(STATES_DATA[st].districts[0].id);
    }
  };

  const handleCaptureGps = async () => {
    const loc = await requestDeviceLocation();
    if (loc) {
      setCapturedGps({
        lat: loc.latitude,
        lng: loc.longitude,
        accuracy: loc.accuracyMeters,
      });
      if (!locationName) {
        setLocationName(`GPS: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    setVoiceError(null);
    startVoiceInput(
      (transcript) => {
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      (err) => {
        setVoiceError(`Voice input error: ${err}`);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fallbackCoords = STATES_DATA[stateId]?.center || [26.1445, 91.7362];
    const coords: [number, number] = capturedGps
      ? [capturedGps.lat, capturedGps.lng]
      : [fallbackCoords[0], fallbackCoords[1]];

    // 1. Submit to Citizen Reports System (creates timeline & unique tracking number)
    const newReport = addCitizenReport({
      userName: userName || 'Anonymous Citizen',
      userPhone: userPhone || undefined,
      stateId,
      districtId,
      locationName: locationName || `${category} on Highway / Road`,
      coords,
      category,
      severity,
      description: description || `Reported ${category} requiring inspection and clearance.`,
      photoUrl: photoPreview || undefined,
      status: 'Submitted',
    });

    // 2. Also register into GIS Incident feed
    addIncidentReport({
      title: `${category}: ${locationName || stateId}`,
      description: description || `Reported ${category} requiring road clearance.`,
      type: category === 'Landslide' ? 'Landslide' : category === 'Flood' ? 'Flood' : category === 'Broken Road' ? 'Road Damage' : category === 'Bridge Problem' ? 'Bridge Damage' : category === 'Traffic Problem' ? 'Traffic Block' : 'Obstruction',
      severity,
      stateId,
      districtId,
      districtName: availableDistricts.find((d) => d.id === districtId)?.name || stateId,
      highwayNumber: 'State / National Road',
      roadSegmentId: `seg-${stateId.toLowerCase().substring(0, 2)}-gen-1`,
      locationName: locationName || `${category} Site`,
      coords,
      reportedBy: userName,
      reportedByRole: 'Citizen Reporter',
      lanesAffected: severity === 'Critical' ? 'Both lanes blocked' : 'Single lane open',
      estimatedClearanceTime: 'Under Assessment',
      isOfflineReported: !isOnline,
    });

    // 3. Persist into IndexedDB if offline or for audit assurance
    try {
      await saveOfflineReport({
        trackingNumber: newReport.trackingNumber,
        category: (category as any) || 'Other Hazard',
        severity,
        locationName: locationName || `${category} Site`,
        stateId,
        districtId,
        coords,
        description: description || `Reported ${category}`,
        userName: userName || 'Citizen User',
        userPhone: userPhone || undefined,
        photoBase64: photoPreview || undefined,
        createdTimestamp: Date.now(),
        createdAtIso: new Date().toISOString(),
      });
      setIsSavedOffline(!isOnline);
    } catch {
      // Ignore indexedDB error in unsupported environments
    }

    setGeneratedTrackingId(newReport.trackingNumber);
  };

  return (
    <>
      {/* Mobile-first Dedicated Field Lodgement Screen */}
      <div className="block md:hidden">
        <MobileIncidentReporting />
      </div>

      {/* Desktop Comprehensive Incident Management View */}
      <div className="hidden md:block p-4 sm:p-6 space-y-6 max-w-6xl mx-auto pb-16">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-red-600 text-white tracking-wider">
                  FIELD PROBLEM & DISASTER LODGEMENT
                </span>
                <SourceBadge status="field_report" confidence="unverified" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                {t('reportTitle')}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {t('reportSubtitle')}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link
                href="/my-reports"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('navMyReports')}</span>
              </Link>
            </div>
          </div>
        </div>

      {/* Success Modal / Banner */}
      {generatedTrackingId ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500 p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              SUCCESSFULLY LODGED WITH DISTRICT CONTROL ROOM
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              Tracking ID: {generatedTrackingId}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Your field incident report has been registered into the UTTARPURV AI Governance System. Responsible engineering and emergency response units have been notified.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/my-reports"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Track Report Progress</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setGeneratedTrackingId(null);
                setDescription('');
                setPhotoPreview(null);
                setLocationName('');
              }}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* The Report Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6"
        >
          {/* Section 1: Problem Category */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>1. Problem Type</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Landslide', label: 'Landslide' },
                { id: 'Flood', label: 'Flood' },
                { id: 'Broken Road', label: 'Broken Road' },
                { id: 'Road Blocked', label: 'Road Blocked' },
                { id: 'Bridge Problem', label: 'Bridge Problem' },
                { id: 'Heavy Rain', label: 'Heavy Rain' },
                { id: 'Traffic Problem', label: 'Traffic Problem' },
                { id: 'Other', label: 'Other' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCategory(item.id as ReportCategory)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    category === item.id
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 ring-2 ring-red-500/20 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-sm leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Location & GPS */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>2. Location & State Jurisdiction</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  State
                </label>
                <select
                  value={stateId}
                  onChange={(e) => handleStateChange(e.target.value as StateId)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  {ALL_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  District
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  {availableDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                {t('locationDetails')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. NH-27 Milepost 42 near Jatinga River Bridge"
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isLocatingDevice}
                  className="px-3 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  title="Auto-fill with GPS"
                >
                  <Compass className={`w-4 h-4 ${isLocatingDevice ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{capturedGps ? 'GPS Captured' : t('useMyLocation')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Description & Voice Input */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                3. {t('descriptionLabel')}
              </label>

              {/* Voice-First Speech Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? t('listening') : t('speak')}</span>
              </button>
            </div>

            {voiceError && (
              <p className="text-xs text-red-500 font-semibold">{voiceError}</p>
            )}

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Section 4: Photo Evidence & Severity */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              4. Evidence Photo & Impact Level
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo Upload Box */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  {t('uploadPhoto')}
                </label>
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-32 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={photoPreview}
                      alt="Uploaded field evidence"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Tap to capture or upload
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Severity Selection */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Severity & Blockage Level
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'Critical', desc: 'Total road block / Major disaster (Immediate SDRF/BRO response)' },
                    { id: 'High', desc: 'Single lane blocked / Heavy delays expected' },
                    { id: 'Moderate', desc: 'Potholes / Minor scour / Caution required' },
                    { id: 'Low', desc: 'Debris on shoulder / Light nuisance' },
                  ].map((lvl) => (
                    <label
                      key={lvl.id}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        severity === lvl.id
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-slate-900 dark:text-white font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="severity"
                        checked={severity === lvl.id}
                        onChange={() => setSeverity(lvl.id as any)}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="block font-bold">{lvl.id}</span>
                        <span className="text-[10px] text-slate-400">{lvl.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Citizen Contact (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Phone Number (For SMS Status Updates)
              </label>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="+91 94350 XXXXX"
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>{t('submitReport')}</span>
            </button>
          </div>
        </form>
      )}
      </div>
    </>
  );
};
