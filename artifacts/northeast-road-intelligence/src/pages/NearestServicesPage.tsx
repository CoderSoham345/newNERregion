import React, { useState, useEffect, useMemo } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  EMERGENCY_FACILITIES,
  calculateDistanceKm,
  estimateRoadEta,
  getDirectionsUrl,
  type EmergencyFacility,
} from '../data/emergencyFacilitiesData';
import {
  Shield,
  HeartPulse,
  PhoneCall,
  Navigation,
  MapPin,
  Search,
  Crosshair,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  Car,
  Bed,
  Activity,
  Flame,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';

export const NearestServicesPage: React.FC = () => {
  const { selectedState, setSelectedState, selectedDistrictId, setSelectedDistrictId } = useOperating();

  // Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'loading' | 'success' | 'error'>('prompt');
  const [locationError, setLocationError] = useState<string>('');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  // Filters & Search
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'police' | 'medical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');

  // Active state & district resolution
  const activeStateKey: StateId = selectedState === 'All states' ? 'Assam' : (selectedState as StateId);
  const stateData = STATES_DATA[activeStateKey] || STATES_DATA['Assam'];
  const districtList = stateData.districts;
  const activeDistrict = districtList.find((d) => d.id === selectedDistrictId) || districtList[0];

  // Default coordinate center when GPS is not granted (uses selected state / district center)
  const defaultCoords = useMemo<[number, number]>(() => {
    if (activeDistrict?.center) {
      return activeDistrict.center;
    }
    return stateData.center || [26.1433, 91.7898]; // Dispur Guwahati default
  }, [activeDistrict, stateData]);

  // Request browser geolocation
  const requestLocation = () => {
    setLocationStatus('loading');
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationAccuracy(Math.round(position.coords.accuracy));
        setLocationStatus('success');
      },
      (error) => {
        setLocationStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Using selected district center as reference.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Location information unavailable. Using regional coordinates.');
        } else {
          setLocationError('GPS request timed out. Using regional coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Attempt auto-detect on mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Compute reference location (either live GPS or district coords)
  const referenceLat = userCoords?.lat ?? defaultCoords[0];
  const referenceLng = userCoords?.lng ?? defaultCoords[1];

  // Process facilities with distances and sorting
  const facilitiesWithDistance = useMemo(() => {
    return EMERGENCY_FACILITIES.map((facility) => {
      const dist = calculateDistanceKm(referenceLat, referenceLng, facility.coords[0], facility.coords[1]);
      const eta = estimateRoadEta(dist, facility.stateId !== 'Assam');
      const directionsUrl = getDirectionsUrl(facility.coords[0], facility.coords[1], userCoords?.lat, userCoords?.lng);
      return {
        ...facility,
        distanceKm: dist,
        roadEta: eta,
        directionsUrl,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [referenceLat, referenceLng, userCoords]);

  // Filter list
  const filteredFacilities = useMemo(() => {
    return facilitiesWithDistance.filter((item) => {
      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      // Subtype filter
      if (selectedSubtype !== 'all' && item.subType !== selectedSubtype) {
        return false;
      }
      // Search filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.districtName.toLowerCase().includes(q) ||
          item.stateId.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.capabilities.some((c) => c.toLowerCase().includes(q)) ||
          (item.nearestHighway && item.nearestHighway.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [facilitiesWithDistance, categoryFilter, selectedSubtype, searchQuery]);

  // Closest Police Station and Medical Facility
  const closestPolice = useMemo(
    () => facilitiesWithDistance.find((f) => f.category === 'police'),
    [facilitiesWithDistance]
  );
  const closestHospital = useMemo(
    () => facilitiesWithDistance.find((f) => f.category === 'medical'),
    [facilitiesWithDistance]
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-700 text-white tracking-wider">
                UTTARPŪRV EMERGENCY SAFETY HUB
              </span>
              <SourceBadge status="live" confidence="high" />
              {userCoords ? (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GPS Locked ({userCoords.lat.toFixed(4)}°N, {userCoords.lng.toFixed(4)}°E • ±{locationAccuracy}m)
                </span>
              ) : (
                <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Using Region: {activeStateKey} ({activeDistrict?.name || 'Capital'})
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
              Nearest Police Stations & Emergency Medical Hospitals
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Live proximity matrix calculated across all 8 North Eastern States. Real-time direct phone desks, 24x7 trauma wards, emergency ICUs, patrol posts, and turn-by-turn navigation routes.
            </p>
          </div>

          {/* GPS Quick Button & State Selector */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={requestLocation}
              disabled={locationStatus === 'loading'}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Crosshair className={`w-4 h-4 ${locationStatus === 'loading' ? 'animate-spin' : ''}`} />
              <span>{locationStatus === 'loading' ? 'Detecting...' : 'Detect Exact GPS'}</span>
            </button>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as OperatingState)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl"
            >
              {ALL_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Error notification if any */}
        {locationError && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Hero Quick Access: Top 2 Nearest Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nearest Police Station Card */}
        {closestPolice && (
          <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border-2 border-blue-600/40 shadow-sm text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    CLOSEST POLICE STATION
                  </div>
                  <h3 className="text-base font-black text-white">{closestPolice.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500 text-white shadow-xs">
                  {closestPolice.distanceKm} km
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">{closestPolice.roadEta} drive</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">{closestPolice.address}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {closestPolice.capabilities.slice(0, 3).map((cap, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-900/50 text-blue-200 border border-blue-800/60 font-semibold">
                  {cap}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${closestPolice.primaryPhone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {closestPolice.primaryPhone}</span>
              </a>
              <a
                href={closestPolice.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Directions</span>
              </a>
              <a
                href="tel:112"
                className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1 transition-colors"
                title="Dial All-India Emergency Police"
              >
                <span>112</span>
              </a>
            </div>
          </div>
        )}

        {/* Nearest Hospital / Medical Card */}
        {closestHospital && (
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border-2 border-emerald-600/40 shadow-sm text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    CLOSEST MEDICAL HOSPITAL
                  </div>
                  <h3 className="text-base font-black text-white">{closestHospital.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs">
                  {closestHospital.distanceKm} km
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">{closestHospital.roadEta} drive</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">{closestHospital.address}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {closestHospital.traumaLevel && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-800/80 font-bold">
                  {closestHospital.traumaLevel}
                </span>
              )}
              {closestHospital.bedCount && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-200 border border-emerald-800/60 font-semibold flex items-center gap-1">
                  <Bed className="w-3 h-3" />
                  {closestHospital.bedCount}+ Beds
                </span>
              )}
              {closestHospital.icuAvailable && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900/50 text-teal-200 border border-teal-800/60 font-semibold">
                  24x7 ICU Active
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${closestHospital.primaryPhone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {closestHospital.primaryPhone}</span>
              </a>
              <a
                href={closestHospital.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Directions</span>
              </a>
              <a
                href="tel:108"
                className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1 transition-colors"
                title="Dial 108 Emergency Ambulance"
              >
                <span>108</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>All Facilities ({facilitiesWithDistance.length})</span>
            </button>

            <button
              onClick={() => setCategoryFilter('police')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'police'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Police Stations & Highway Posts</span>
            </button>

            <button
              onClick={() => setCategoryFilter('medical')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === 'medical'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Hospitals & Trauma Centers</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search station, hospital, district, highway, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of All Facilities Sorted by Proximity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => {
          const isPolice = fac.category === 'police';

          return (
            <div
              key={fac.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isPolice
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {fac.subType}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {fac.distanceKm} km
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      ({fac.roadEta})
                    </span>
                  </div>
                </div>

                {/* Facility Name & Jurisdiction */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {fac.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {fac.districtName}, {fac.stateId}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {fac.address}
                </p>

                {/* Key Attributes */}
                <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Officer / In-Charge:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {fac.inChargeTitle}
                    </span>
                  </div>

                  {fac.nearestHighway && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Highway Sector:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {fac.nearestHighway}
                      </span>
                    </div>
                  )}

                  {fac.bedCount && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Capacity:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {fac.bedCount} Beds {fac.icuAvailable ? '• ICU Active' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Capabilities tags */}
                <div className="flex flex-wrap gap-1">
                  {fac.capabilities.slice(0, 3).map((cap, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`tel:${fac.primaryPhone}`}
                  className={`flex-1 py-2 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                    isPolice
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {fac.primaryPhone}</span>
                </a>

                <a
                  href={fac.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Open GPS Navigation in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Route</span>
                </a>

                <a
                  href={`tel:${fac.emergencyNumber}`}
                  className="py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-0.5 transition-colors"
                  title={`Dial SOS ${fac.emergencyNumber}`}
                >
                  <span>{fac.emergencyNumber}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
