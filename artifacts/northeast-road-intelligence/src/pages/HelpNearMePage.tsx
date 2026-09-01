import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import {
  MapPin,
  Phone,
  Navigation,
  Compass,
  Shield,
  Hospital,
  Flame,
  Truck,
  Fuel,
  Building,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useLocation } from 'wouter';

interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Police' | 'Fire' | 'Ambulance' | 'Shelter' | 'Fuel';
  address: string;
  phone: string;
  state: string;
  lat: number;
  lng: number;
  is24x7: boolean;
}

const SAMPLE_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Guwahati Medical College & Hospital (GMCH)',
    type: 'Hospital',
    address: 'Bhangagarh, Guwahati, Assam 781032',
    phone: '+91 361 2135155',
    state: 'Assam',
    lat: 26.1553,
    lng: 91.7692,
    is24x7: true,
  },
  {
    id: 'fac-2',
    name: 'Pan Bazaar Police Control Room',
    type: 'Police',
    address: 'Pan Bazaar, Guwahati, Assam 781001',
    phone: '112 / +91 361 2540100',
    state: 'Assam',
    lat: 26.1844,
    lng: 91.7476,
    is24x7: true,
  },
  {
    id: 'fac-3',
    name: 'Shillong Civil Hospital & Emergency Trauma',
    type: 'Hospital',
    address: 'Lawmali, Shillong, Meghalaya 793001',
    phone: '+91 364 2222416',
    state: 'Meghalaya',
    lat: 25.5788,
    lng: 91.8933,
    is24x7: true,
  },
  {
    id: 'fac-4',
    name: 'East Jaintia Hills Emergency Fire Station',
    type: 'Fire',
    address: 'Khliehriat, Meghalaya 793200',
    phone: '101 / +91 3655 230111',
    state: 'Meghalaya',
    lat: 25.3235,
    lng: 92.3592,
    is24x7: true,
  },
  {
    id: 'fac-5',
    name: 'Disaster Staging & Relief Shelter (Sonapur)',
    type: 'Shelter',
    address: 'Sonapur NH-6 Approach, Assam',
    phone: '+91 361 2849005',
    state: 'Assam',
    lat: 26.1321,
    lng: 91.9542,
    is24x7: true,
  },
  {
    id: 'fac-6',
    name: 'IOCL Highway Fuel & AdBlue Station',
    type: 'Fuel',
    address: 'NH-29 Bypass, Chümoukedima, Nagaland',
    phone: '+91 3862 225333',
    state: 'Nagaland',
    lat: 25.8234,
    lng: 93.8681,
    is24x7: true,
  },
  {
    id: 'fac-7',
    name: 'Imphal JNIMS General Hospital',
    type: 'Hospital',
    address: 'Porompat, Imphal East, Manipur 795005',
    phone: '+91 385 2441146',
    state: 'Manipur',
    lat: 24.8170,
    lng: 93.9530,
    is24x7: true,
  },
  {
    id: 'fac-8',
    name: 'Aizawl Civil Hospital',
    type: 'Hospital',
    address: 'Mission Veng, Aizawl, Mizoram 796001',
    phone: '+91 389 2322318',
    state: 'Mizoram',
    lat: 23.7271,
    lng: 92.7176,
    is24x7: true,
  },
  {
    id: 'fac-9',
    name: 'Agartala GBP Hospital',
    type: 'Hospital',
    address: 'Kunjaban, Agartala, Tripura 799006',
    phone: '+91 381 2323522',
    state: 'Tripura',
    lat: 23.8315,
    lng: 91.2868,
    is24x7: true,
  },
  {
    id: 'fac-10',
    name: 'Gangtok STNM Hospital',
    type: 'Hospital',
    address: 'Sichey, Gangtok, Sikkim 737101',
    phone: '+91 3592 202203',
    state: 'Sikkim',
    lat: 27.3389,
    lng: 88.6065,
    is24x7: true,
  },
];

export const HelpNearMePage: React.FC = () => {
  const { deviceGps, requestDeviceLocation, isLocatingDevice, inspectRoad } = useOperating();
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const handleGetLocation = async () => {
    await requestDeviceLocation();
  };

  // Haversine distance calculator in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const facilitiesWithDistance = SAMPLE_FACILITIES.map((fac) => {
    let distKm: number | null = null;
    if (deviceGps && deviceGps.isAvailable) {
      distKm = calculateDistance(deviceGps.latitude, deviceGps.longitude, fac.lat, fac.lng);
    }
    return { ...fac, distKm };
  }).sort((a, b) => {
    if (a.distKm !== null && b.distKm !== null) return a.distKm - b.distKm;
    return 0;
  });

  const filteredFacilities = facilitiesWithDistance.filter((fac) => {
    if (selectedType !== 'All' && fac.type !== selectedType) return false;
    if (
      searchFilter.trim() &&
      !fac.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !fac.address.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !fac.state.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Hospital':
      case 'Ambulance':
        return <Hospital className="w-5 h-5 text-red-500" />;
      case 'Police':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'Fire':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Shelter':
        return <Building className="w-5 h-5 text-emerald-500" />;
      case 'Fuel':
        return <Fuel className="w-5 h-5 text-purple-500" />;
      default:
        return <MapPin className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800 mb-2">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            <span>UttarPURV Live Emergency Locator</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Help Near Me</h1>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            Instantly locate verified hospitals, police stations, fire rescue, emergency shelters, and fuel stations across all 8 North Eastern states using your device GPS.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleGetLocation}
            disabled={isLocatingDevice}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLocatingDevice ? 'animate-spin' : ''}`} />
            <span>{deviceGps?.isAvailable ? 'GPS Active (Update)' : 'Detect My GPS Location'}</span>
          </button>
        </div>
      </div>

      {/* GPS Status Bar if available */}
      {deviceGps && deviceGps.isAvailable ? (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              GPS locked at <strong className="font-mono">{deviceGps.latitude.toFixed(4)}°N, {deviceGps.longitude.toFixed(4)}°E</strong> (Accuracy: ±{deviceGps.accuracyMeters}m). Facilities are sorted by proximity.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">{deviceGps.timestamp}</span>
        </div>
      ) : (
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>GPS location not detected yet. Click "Detect My GPS Location" above to sort facilities by exact distance.</span>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0">
          {['All', 'Hospital', 'Police', 'Fire', 'Shelter', 'Fuel'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedType === type
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {type === 'All' ? '🌐 All Facilities' : type}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search facility name, city..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    {getIconForType(fac.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {fac.type}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{fac.name}</h3>
                  </div>
                </div>
                {fac.distKm !== null && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800 shrink-0">
                    {fac.distKm < 1 ? `${Math.round(fac.distKm * 1000)}m` : `${fac.distKm.toFixed(1)} km`}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{fac.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="font-semibold text-slate-200">State:</span> {fac.state}
                  <span className="mx-1.5">•</span>
                  <span className="text-emerald-400 font-semibold">{fac.is24x7 ? '24x7 Active' : 'Day hours'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
              <a
                href={`tel:${fac.phone.split('/')[0].trim()}`}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
              <button
                onClick={() => setLocation('/map')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Directions</span>
              </button>
              <button
                onClick={() => setLocation('/map')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Map</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No facilities found matching your filter</h3>
          <p className="text-slate-400 text-xs mt-1">Try selecting a different facility type or search term.</p>
        </div>
      )}
    </div>
  );
};
