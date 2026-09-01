import React, { useState, useMemo } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useTranslation } from '../context/LanguageContext';
import { STATES_DATA, ALL_STATES, type StateId } from '../data/statesAndDistricts';
import {
  Phone,
  MapPin,
  Navigation,
  Crosshair,
  Shield,
  Flame,
  Building2,
  Fuel,
  Home,
  CheckCircle2,
  Search,
  ExternalLink,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';

export const NearestHelpPage: React.FC = () => {
  const {
    facilities,
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    deviceGps,
    requestDeviceLocation,
    isLocatingDevice,
  } = useOperating();
  const { t, speakText } = useTranslation();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate distance in km between two GPS coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // User reference location: Device GPS if available, else selected State Capital center
  const userCoords: [number, number] = useMemo(() => {
    if (deviceGps && deviceGps.isAvailable) {
      return [deviceGps.latitude, deviceGps.longitude];
    }
    if (selectedState !== 'All states' && STATES_DATA[selectedState as StateId]) {
      return STATES_DATA[selectedState as StateId].center;
    }
    return [26.1445, 91.7362]; // Guwahati center
  }, [deviceGps, selectedState]);

  // Filter and sort facilities by distance
  const filteredFacilities = useMemo(() => {
    return facilities
      .filter((fac) => {
        if (selectedState !== 'All states' && fac.stateId !== selectedState) return false;
        if (selectedDistrictId !== 'all' && fac.districtId !== selectedDistrictId) return false;
        if (selectedType !== 'all' && fac.type !== selectedType) return false;
        if (
          searchTerm &&
          !fac.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !fac.address.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .map((fac) => ({
        ...fac,
        distance: calculateDistance(userCoords[0], userCoords[1], fac.coords[0], fac.coords[1]),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [facilities, selectedState, selectedDistrictId, selectedType, searchTerm, userCoords]);

  const activeStateData = selectedState !== 'All states' ? STATES_DATA[selectedState as StateId] : null;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-blue-600 text-white tracking-wider">
                EMERGENCY PUBLIC INFRASTRUCTURE
              </span>
              <SourceBadge status="official" confidence="high" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              {t('nearestHelpTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {t('nearestHelpSubtitle')}
            </p>
          </div>

          {/* GPS Locate Button */}
          <div className="shrink-0">
            <button
              onClick={() => requestDeviceLocation()}
              disabled={isLocatingDevice}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Crosshair className={`w-4 h-4 ${isLocatingDevice ? 'animate-spin' : ''}`} />
              <span>{deviceGps?.isAvailable ? 'GPS Location Active' : t('useMyLocation')}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          {/* State Selector */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as any)}
            className="bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
          >
            <option value="All states">{t('allStates')}</option>
            {ALL_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* District Selector */}
          {activeStateData && (
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="all">{t('allDistricts')}</option>
              {activeStateData.districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by facility name, trauma unit, town..."
              className="w-full bg-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Facility Type Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'all', label: t('filterAllFacilities'), icon: Building2 },
          { id: 'hospital', label: t('filterHospitals'), icon: Building2 },
          { id: 'police', label: t('filterPolice'), icon: Shield },
          { id: 'fire_station', label: t('filterFire'), icon: Flame },
          { id: 'relief_center', label: t('filterDisasterResponse'), icon: Shield },
          { id: 'fuel', label: t('filterFuel'), icon: Fuel },
          { id: 'government_office', label: 'DEOC / Control Rooms', icon: Home },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Facility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => {
          const isHospital = fac.type === 'hospital';
          const isPolice = fac.type === 'police';
          const isFire = fac.type === 'fire_station';

          return (
            <div
              key={fac.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-2 rounded-xl text-white ${
                        isHospital
                          ? 'bg-red-600'
                          : isPolice
                          ? 'bg-blue-600'
                          : isFire
                          ? 'bg-orange-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {isHospital ? (
                        <Building2 className="w-4 h-4" />
                      ) : isPolice ? (
                        <Shield className="w-4 h-4" />
                      ) : isFire ? (
                        <Flame className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        {fac.stateId} • {fac.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {fac.name}
                      </h3>
                    </div>
                  </div>

                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded-lg shrink-0">
                    ~{fac.distance} {t('distanceKm')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{fac.address}</span>
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{fac.status}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Dial, Directions, Audio Read */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`tel:${fac.phone.split('/')[0].replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('callNow')}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${fac.coords[0]},${fac.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Open GPS Directions"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t('directions')}</span>
                </a>

                <button
                  onClick={() => speakText(`${fac.name}, located at ${fac.address}. Contact number ${fac.phone}`)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
                  title="Listen in chosen language"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredFacilities.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching emergency facilities found
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Try switching your state or selecting "All Facilities"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
