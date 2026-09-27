import React, { useState, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import { fetchLiveWeather, type LiveWeatherResponse } from '../lib/weatherService';
import { SourceBadge } from '../components/SourceBadge';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  RefreshCw,
  Eye,
  Compass,
  MapPin,
  TrendingUp,
  CloudLightning,
  CloudFog,
  ShieldAlert,
} from 'lucide-react';

interface KeyLocationWeather {
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  weather: LiveWeatherResponse | null;
  isLoading: boolean;
}

const KEY_CORRIDOR_STATIONS: { name: string; state: string; lat: number; lng: number; elevationMeters: number }[] = [
  { name: 'Sonapur Tunnel Approach (NH-6)', state: 'Meghalaya', lat: 25.105, lng: 92.365, elevationMeters: 620 },
  { name: 'Sela Pass Ridge (NH-13)', state: 'Arunachal Pradesh', lat: 27.505, lng: 92.102, elevationMeters: 4170 },
  { name: 'Guwahati Jalukbari Junction (NH-27)', state: 'Assam', lat: 26.144, lng: 91.736, elevationMeters: 55 },
  { name: 'Kohima Bypass Corridor (NH-2)', state: 'Nagaland', lat: 25.674, lng: 94.111, elevationMeters: 1444 },
  { name: 'Imphal Valley - Senapati (NH-2)', state: 'Manipur', lat: 25.265, lng: 94.025, elevationMeters: 840 },
  { name: 'Aizawl Sairang Ridge (NH-306)', state: 'Mizoram', lat: 23.731, lng: 92.718, elevationMeters: 1132 },
  { name: 'Nathula / Gangtok Highway (NH-10)', state: 'Sikkim', lat: 27.338, lng: 88.606, elevationMeters: 1650 },
  { name: 'Agartala - Khowai Link (NH-8)', state: 'Tripura', lat: 23.831, lng: 91.286, elevationMeters: 28 },
];

export const WeatherIntelligencePage: React.FC = () => {
  const { selectedState, setSelectedState, inspectDataSource } = useOperating();

  const [stations, setStations] = useState<KeyLocationWeather[]>(
    KEY_CORRIDOR_STATIONS.map((s) => ({ ...s, weather: null, isLoading: true }))
  );
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Load live weather for all stations
  const loadAllStationsWeather = async () => {
    setRefreshing(true);
    const updated = await Promise.all(
      KEY_CORRIDOR_STATIONS.map(async (st) => {
        const res = await fetchLiveWeather(st.lat, st.lng, st.name);
        return {
          ...st,
          weather: res,
          isLoading: false,
        };
      })
    );
    setStations(updated);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllStationsWeather();
  }, []);

  const activeStation = stations[selectedStationIndex] || stations[0];
  const activeWeather = activeStation.weather;

  // Filter stations based on state selector
  const visibleStations = (selectedState === 'All states'
    ? stations
    : stations.filter((s) => s.state === selectedState)).slice(0, 4);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Source Transparency */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600/10 text-sky-600 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Live Meteorological & Monsoon Telemetry
            </h1>
            <SourceBadge
              sourceName="Open-Meteo WMO API"
              status={activeWeather?.status === 'live' ? 'live' : 'derived'}
              confidence="high"
              lastUpdated={activeWeather?.timestamp}
              onClickInfo={() => inspectDataSource('Weather & Rainfall API')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllStationsWeather}
            disabled={refreshing}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Polling WMO Feeds...' : 'Refresh Weather Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Card: Active Station Live Telemetry */}
      {activeWeather && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeStation.state} · {activeStation.elevationMeters}m Elevation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeStation.name}</h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Coordinates: {activeStation.lat.toFixed(4)}°N, {activeStation.lng.toFixed(4)}°E</span>
                <span>•</span>
                <span>Feed: Open-Meteo ECMWF/GFS ({activeWeather.timestamp})</span>
              </div>
            </div>

            {/* Big Temperature & Condition Badge */}
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <CloudRain className="w-8 h-8 text-sky-400" />
                <div>
                  <div className="text-3xl font-black">{activeWeather.temperature.toFixed(1)}°C</div>
                  <div className="text-xs font-semibold text-slate-300">{activeWeather.weatherDescription}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Meteorological Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Precipitation (24h)</span>
              </div>
              <div className="text-xl font-bold text-white">
                {activeWeather.rainLast24h.toFixed(1)} mm
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {activeWeather.rainLast24h > 40 ? '⚠️ High flash flood risk' : 'Normal rainfall range'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>Wind Speed</span>
              </div>
              <div className="text-xl font-bold text-white">
                {activeWeather.windSpeed.toFixed(1)} km/h
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Intensity: {activeWeather.rainIntensity}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Surface Visibility</span>
              </div>
              <div className="text-xl font-bold text-white">
                {activeWeather.visibility.toFixed(1)} km
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {activeWeather.visibility < 2 ? 'Dense mountain fog' : 'Clear corridor sight'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Relative Humidity</span>
              </div>
              <div className="text-xl font-bold text-white">
                {activeWeather.relativeHumidity}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Soil saturation factor: {(activeWeather.relativeHumidity * 0.9).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Key Mountain Passes and Valley Corridor Stations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Key Strategic Mountain Passes & Transit Nodes ({visibleStations.length})
          </h2>
          <span className="text-xs text-slate-500">Click any card to load comprehensive telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleStations.map((st) => {
            const originalIndex = stations.findIndex((s) => s.name === st.name);
            const isSelected = originalIndex === selectedStationIndex;
            const w = st.weather;

            return (
              <div
                key={st.name}
                onClick={() => setSelectedStationIndex(originalIndex)}
                className={`p-5 min-h-44 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 shadow-md ring-2 ring-sky-400/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400">
                      {st.state}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight line-clamp-2">
                      {st.name}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{st.elevationMeters}m</span>
                </div>

                {st.isLoading ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1" />
                    Fetching live feed...
                  </div>
                ) : w ? (
                  <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                        {w.temperature.toFixed(1)}°C
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {w.weatherDescription}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Rain (24h): {w.rainLast24h.toFixed(1)} mm</span>
                      <span>Wind: {w.windSpeed.toFixed(0)} km/h</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-slate-400">Station feed unavailable</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
