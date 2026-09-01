import React, { useState, useEffect, useRef } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useTranslation } from '../context/LanguageContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import { type ReportCategory } from '../data/citizenReports';
import {
  saveOfflineReport,
  getPendingOfflineReports,
  subscribeToOfflineSyncUpdates,
} from '../lib/indexedDb';
import {
  AlertOctagon,
  Camera,
  MapPin,
  Send,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  FileCheck2,
  Upload,
  X,
  Sparkles,
  RefreshCw,
  Compass,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useLocation } from 'wouter';

export const MobileIncidentReporting: React.FC = () => {
  const {
    addCitizenReport,
    addIncidentReport,
    userProfile,
    isOnline,
    deviceGps,
    isLocatingDevice,
    requestDeviceLocation,
  } = useOperating();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const [category, setCategory] = useState<ReportCategory>('Road Blocked');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Critical'>('High');
  const [stateId, setStateId] = useState<StateId>('Meghalaya');
  const [districtId, setDistrictId] = useState('mg-east-khasi-hills');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [capturedGps, setCapturedGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<'idle' | 'online_submitted' | 'offline_saved'>('idle');
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeToOfflineSyncUpdates((count) => {
      setPendingCount(count);
    });
    // Auto-capture GPS on screen load
    handleCaptureGps();
    return () => unsub();
  }, []);

  const handleCaptureGps = async () => {
    setGpsError(null);
    try {
      const loc = await requestDeviceLocation();
      if (loc) {
        setCapturedGps({
          lat: loc.latitude,
          lng: loc.longitude,
          accuracy: loc.accuracyMeters,
        });
        setLocationName(`Near GPS (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)})`);
      } else {
        setGpsError('GPS permission was not granted or signal unavailable.');
      }
    } catch (err: any) {
      setGpsError('Could not acquire device coordinates.');
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fallbackCoords = STATES_DATA[stateId]?.center || [25.5788, 91.8933];
    const coords: [number, number] = capturedGps
      ? [capturedGps.lat, capturedGps.lng]
      : [fallbackCoords[0], fallbackCoords[1]];

    // 1. Submit citizen report
    const newReport = addCitizenReport({
      userName: userProfile?.name || 'Field Officer',
      userPhone: userProfile?.mobile || undefined,
      stateId,
      districtId,
      locationName: locationName || `${category} - Field Lodgement`,
      coords,
      category,
      severity,
      description: description || `Field incident ${category} recorded with device telemetry.`,
      photoUrl: photoPreview || undefined,
      status: 'Submitted',
    });

    // 2. Incident report in GIS
    addIncidentReport({
      title: `${category}: ${locationName || stateId}`,
      description: description || `Field reported ${category}. Urgent verification requested.`,
      type: category === 'Landslide' ? 'Landslide' : category === 'Flood' ? 'Flood' : 'Obstruction',
      severity,
      stateId,
      districtId,
      districtName: stateId,
      highwayNumber: 'Field Road',
      roadSegmentId: `seg-${stateId.toLowerCase().substring(0, 2)}-gen-1`,
      locationName: locationName || `${category} Site`,
      coords,
      reportedBy: userProfile?.name || 'Field Officer',
      reportedByRole: 'Field Officer',
      lanesAffected: severity === 'Critical' ? 'Both lanes blocked' : 'Single lane open',
      estimatedClearanceTime: 'Assessing',
      isOfflineReported: !isOnline,
    });

    // 3. Persistent Local IndexedDB for safe offline survivability
    try {
      await saveOfflineReport({
        trackingNumber: newReport.trackingNumber,
        category: (category as any) || 'Road Blockage',
        severity,
        locationName: locationName || `${category} Site`,
        stateId,
        districtId,
        coords,
        description: description || `Field reported ${category}`,
        userName: userProfile?.name || 'Field Officer',
        userPhone: userProfile?.mobile || undefined,
        photoBase64: photoPreview || undefined,
        createdTimestamp: Date.now(),
        createdAtIso: new Date().toISOString(),
      });
    } catch {
      // Ignore
    }

    setTrackingCode(newReport.trackingNumber);
    setSubmittedStatus(isOnline ? 'online_submitted' : 'offline_saved');
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto p-3.5 pb-24">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                &lt; 20s FIELD SUBMIT
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </span>
            </div>
            <h1 className="text-xl font-black text-white mt-1">
              REPORT INCIDENT
            </h1>
          </div>

          {pendingCount > 0 && (
            <div className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-bold text-center">
              <div>{pendingCount} PENDING</div>
              <div className="text-[8px] text-amber-400 font-mono">OFFLINE SYNC</div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation State */}
      {submittedStatus !== 'idle' ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {submittedStatus === 'online_submitted' ? '🟢 SUBMITTED TO CONTROL ROOM' : '🔴 SAVED OFFLINE'}
            </span>
            <h2 className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1">
              {trackingCode}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {submittedStatus === 'online_submitted'
                ? 'Your incident is live in the GIS operations room and visible to district emergency response units.'
                : 'Incident and photo cached in local device storage. Will sync automatically when network returns.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setSubmittedStatus('idle');
                setDescription('');
                setPhotoPreview(null);
              }}
              className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl active:scale-95 touch-manipulation"
            >
              Report Another
            </button>

            <button
              onClick={() => setLocation('/map')}
              className="py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 touch-manipulation"
            >
              View on Map
            </button>
          </div>
        </div>
      ) : (
        /* The < 20-second Rapid Mobile Form */
        <form onSubmit={handleQuickSubmit} className="space-y-3.5">
          {/* Incident Type Select */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Incident Type</span>
              <span className="text-[10px] font-mono text-emerald-500">REQUIRED</span>
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full px-3.5 py-3 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Road Blocked">Road Blockage / Tree Fall</option>
              <option value="Landslide">Landslide & Mudflow</option>
              <option value="Flood">Waterlogging / River Flood</option>
              <option value="Broken Road">Road Damage / Subsidence</option>
              <option value="Bridge Problem">Bridge Damage / Culvert Washout</option>
              <option value="Traffic Problem">Heavy Traffic Disruption</option>
              <option value="Other">Other Hazard</option>
            </select>
          </div>

          {/* Severity & State */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-1.5 shadow-xs">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Critical">🔴 Critical (Total Block)</option>
                <option value="High">🟠 High (Partial Lane)</option>
                <option value="Moderate">🟡 Moderate (Slow)</option>
                <option value="Low">🟢 Low (Caution)</option>
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-1.5 shadow-xs">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                State
              </label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value as StateId)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {ALL_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Location (Auto-captured) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>GPS Location</span>
              </label>
              <button
                type="button"
                onClick={handleCaptureGps}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <Compass className={`w-3.5 h-3.5 ${isLocatingDevice ? 'animate-spin' : ''}`} />
                <span>{isLocatingDevice ? 'Locating...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {capturedGps
                    ? `${capturedGps.lat.toFixed(4)}°N, ${capturedGps.lng.toFixed(4)}°E (±${Math.round(capturedGps.accuracy)}m)`
                    : 'Auto-capturing device coordinates...'}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                📍 Captured
              </span>
            </div>

            {gpsError && (
              <p className="text-[10px] text-amber-500 font-medium">
                {gpsError} (State fallback coordinates will be used).
              </p>
            )}
          </div>

          {/* Photo Capture */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-500" />
                <span>Capture Photo</span>
              </label>
              <span className="text-[10px] text-slate-400">Optional</span>
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
                <img
                  src={photoPreview}
                  alt="Incident Photo"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all touch-manipulation cursor-pointer"
              >
                <Camera className="w-6 h-6 text-emerald-500" />
                <span className="text-xs font-bold">📷 Tap to Open Camera / Upload Photo</span>
                <span className="text-[10px] text-slate-400">Works 100% offline</span>
              </button>
            )}
          </div>

          {/* Optional Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1.5 shadow-xs">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Description / Landmark</span>
              <span className="text-[10px] text-slate-400">Optional</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 2km before Shillong bypass, mud on uphill lane..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Large Primary Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all touch-manipulation cursor-pointer min-h-[54px]"
          >
            <Send className="w-4 h-4" />
            <span>SAVE INCIDENT</span>
          </button>

          {!isOnline && (
            <p className="text-center text-[11px] text-amber-400 font-medium">
              🔴 Offline Mode: Report will be stored locally and synced automatically when network returns.
            </p>
          )}
        </form>
      )}
    </div>
  );
};
