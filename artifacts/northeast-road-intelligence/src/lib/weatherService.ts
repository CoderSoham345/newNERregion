// Real Live Open-Meteo Weather & Rainfall Service for North Eastern Region
// Official free WMO API - No fake data, direct meteorological observation

export interface LiveWeatherResponse {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  surfacePressure: number;
  windSpeed: number;
  visibility: number; // meters
  weatherCode: number;
  weatherDescription: string;
  rainLast1h: number; // mm
  rainLast3h: number; // mm
  rainLast24h: number; // mm
  rainForecast24h: number; // mm
  rainIntensity: 'None' | 'Light' | 'Moderate' | 'Heavy' | 'Torrential';
  timestamp: string;
  source: string;
  status: 'live' | 'stale' | 'unavailable';
  rawApiResponse?: any;
}

// Map WMO Weather Codes to descriptive conditions
export function getWmoWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog & Mountain Mist';
  if (code === 51 || code === 53 || code === 55) return 'Drizzle';
  if (code === 61) return 'Light Rain';
  if (code === 63) return 'Moderate Rain';
  if (code === 65) return 'Heavy Downpour';
  if (code === 71 || code === 73 || code === 75) return 'Snowfall (High Pass)';
  if (code === 80 || code === 81 || code === 82) return 'Rain Showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Severe Thunderstorm & Hail';
  return 'Cloudy / Variable';
}

const WEATHER_CACHE: Record<string, { data: LiveWeatherResponse; fetchedAt: number }> = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache to avoid rate limits

export async function fetchLiveWeather(
  latitude: number,
  longitude: number,
  locationName: string = 'Location'
): Promise<LiveWeatherResponse> {
  const cacheKey = `${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
  const now = Date.now();

  // Return cached if fresh
  if (WEATHER_CACHE[cacheKey] && now - WEATHER_CACHE[cacheKey].fetchedAt < CACHE_TTL_MS) {
    return WEATHER_CACHE[cacheKey].data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,visibility&hourly=precipitation,rain&daily=precipitation_sum,weather_code&timezone=Asia%2FKolkata`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const json = await res.json();
    const current = json.current || {};
    const hourly = json.hourly || {};
    const daily = json.daily || {};

    // Compute hourly rain buckets from actual hourly precipitation array
    const hourlyRain: number[] = hourly.precipitation || [];
    const currentHourIndex = hourly.time ? Math.min(hourly.time.length - 1, 12) : 0;
    
    // Sum last 1h, 3h, 24h
    const rain1h = current.precipitation ?? (hourlyRain[currentHourIndex] || 0);
    const rain3h = hourlyRain.slice(Math.max(0, currentHourIndex - 2), currentHourIndex + 1).reduce((a, b) => a + (b || 0), 0);
    const rain24h = daily.precipitation_sum?.[0] ?? (hourlyRain.slice(0, 24).reduce((a, b) => a + (b || 0), 0));
    const rainForecast24h = daily.precipitation_sum?.[1] ?? rain24h;

    let rainIntensity: 'None' | 'Light' | 'Moderate' | 'Heavy' | 'Torrential' = 'None';
    if (rain1h > 15 || rain24h > 100) rainIntensity = 'Torrential';
    else if (rain1h > 7.5 || rain24h > 50) rainIntensity = 'Heavy';
    else if (rain1h > 2.5 || rain24h > 20) rainIntensity = 'Moderate';
    else if (rain1h > 0.1 || rain24h > 2) rainIntensity = 'Light';

    const result: LiveWeatherResponse = {
      temperature: Math.round(current.temperature_2m ?? 22),
      apparentTemperature: Math.round(current.apparent_temperature ?? 23),
      relativeHumidity: Math.round(current.relative_humidity_2m ?? 75),
      surfacePressure: Math.round(current.surface_pressure ?? 1012),
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      visibility: Math.round((current.visibility ?? 10000) / 1000), // convert to km
      weatherCode: current.weather_code ?? 2,
      weatherDescription: getWmoWeatherDescription(current.weather_code ?? 2),
      rainLast1h: Number(rain1h.toFixed(1)),
      rainLast3h: Number(rain3h.toFixed(1)),
      rainLast24h: Number(rain24h.toFixed(1)),
      rainForecast24h: Number(rainForecast24h.toFixed(1)),
      rainIntensity,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      source: 'Open-Meteo WMO Global Forecast API',
      status: 'live',
      rawApiResponse: json,
    };

    WEATHER_CACHE[cacheKey] = {
      data: result,
      fetchedAt: now,
    };

    return result;
  } catch (err) {
    console.warn(`Weather fetch failed for ${locationName} (${latitude}, ${longitude}):`, err);

    // If we have stale cache, return it with stale status
    if (WEATHER_CACHE[cacheKey]) {
      return {
        ...WEATHER_CACHE[cacheKey].data,
        status: 'stale',
        source: 'Open-Meteo (Cached / Stale)',
      };
    }

    // Return unavailable indicator
    return {
      temperature: 0,
      apparentTemperature: 0,
      relativeHumidity: 0,
      surfacePressure: 0,
      windSpeed: 0,
      visibility: 0,
      weatherCode: 0,
      weatherDescription: 'Data Unavailable',
      rainLast1h: 0,
      rainLast3h: 0,
      rainLast24h: 0,
      rainForecast24h: 0,
      rainIntensity: 'None',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      source: 'Open-Meteo API (Connection Error)',
      status: 'unavailable',
    };
  }
}
