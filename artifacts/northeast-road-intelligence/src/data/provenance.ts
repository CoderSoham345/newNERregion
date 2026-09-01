// Real Data Architecture & Provenance Types for UttarPURV
// Northeast India Safety, Road & Disaster Intelligence

export type DataSourceType =
  | 'official_api'
  | 'open_meteo'
  | 'maptiler_gis'
  | 'osm_osrm'
  | 'device_gps'
  | 'field_report'
  | 'derived'
  | 'simulated'
  | 'unavailable';

export type DataStatus =
  | 'live'
  | 'official'
  | 'field_report'
  | 'derived'
  | 'stale'
  | 'unavailable'
  | 'simulated';

export type ConfidenceLevel = 'verified' | 'high' | 'medium' | 'low' | 'unverified';

export interface DataProvenance {
  source: DataSourceType;
  sourceName: string;
  endpoint?: string;
  dataStatus: DataStatus;
  confidence: ConfidenceLevel;
  lastUpdated: string; // ISO or formatted
  updateFrequency: string;
  isSimulated?: boolean;
}

export interface DataSourceMatrixEntry {
  feature: string;
  source: string;
  apiFeed: string;
  isLive: boolean;
  updateFrequency: string;
  fallback: string;
  status: DataStatus;
  description: string;
}

export const DATA_SOURCE_MATRIX: DataSourceMatrixEntry[] = [
  {
    feature: 'Geographic Base Map',
    source: 'MapTiler Cloud',
    apiFeed: 'https://api.maptiler.com/maps/{style}/{z}/{x}/{y}',
    isLive: true,
    updateFrequency: 'On demand (tile caching)',
    fallback: 'OpenStreetMap standard tiles',
    status: 'live',
    description: 'High-precision topographic, street, and satellite base tiles for 8 North Eastern states.',
  },
  {
    feature: 'Live Weather & Conditions',
    source: 'Open-Meteo Global WMO API',
    apiFeed: 'https://api.open-meteo.com/v1/forecast (current temperature, humidity, pressure, wind, visibility, weather_code)',
    isLive: true,
    updateFrequency: 'Real-time / 15-minute sync',
    fallback: 'Last cached weather with STALE badge',
    status: 'live',
    description: 'Live atmospheric observations from global meteorological models for all NER state capitals and highway coordinates.',
  },
  {
    feature: 'Precipitation & Rainfall History',
    source: 'Open-Meteo High-Resolution Precipitation',
    apiFeed: 'https://api.open-meteo.com/v1/forecast (precipitation, rain, hourly accumulation)',
    isLive: true,
    updateFrequency: 'Real-time / 15-minute sync',
    fallback: 'Historical rainfall gauge reference or UNAVAILABLE',
    status: 'live',
    description: 'Real live 1h, 3h, 24h rainfall accumulation and precipitation forecast for slope instability calculation.',
  },
  {
    feature: 'Road Network Geometry & Routing',
    source: 'OpenStreetMap / OSRM Routing Machine',
    apiFeed: 'https://router.project-osrm.org/route/v1/driving',
    isLive: true,
    updateFrequency: 'Real-time path computation',
    fallback: 'Pre-computed corridor waypoints',
    status: 'live',
    description: 'Real driving geometry, distance in km, step-by-step waypoint navigation across NER terrain.',
  },
  {
    feature: 'Field Incident Reporting & GPS',
    source: 'Field Officers / Browser W3C Geolocation',
    apiFeed: 'navigator.geolocation.getCurrentPosition()',
    isLive: true,
    updateFrequency: 'On-demand submission',
    fallback: 'Manual coordinate entry with UNVERIFIED tag',
    status: 'field_report',
    description: 'Real device GPS coordinates, accuracy radius, photos, and obstacle descriptions submitted from the ground.',
  },
  {
    feature: 'AI Road Risk & Slope Index',
    source: 'UttarPURV Multi-Factor Geotechnical Risk Model',
    apiFeed: 'Internal deterministic engine (Precipitation + Slope + Soil + Incidents)',
    isLive: true,
    updateFrequency: 'Evaluated per weather update',
    fallback: 'Static slope hazard baseline with DERIVED badge',
    status: 'derived',
    description: 'Predictive hazard score combining live Open-Meteo rainfall, topographical slope exposure, and active field reports.',
  },
  {
    feature: 'Live Road Status & Closures',
    source: 'Verified Field Reports & State Emergency Feeds',
    apiFeed: 'SDMA / DDMA field reports (Awaiting automated NHAI/BRO REST feed)',
    isLive: false,
    updateFrequency: 'As reported by field officers',
    fallback: 'Corridor marked UNKNOWN (Grey) with "Feed Unavailable" notice',
    status: 'field_report',
    description: 'Corridors without recent verified reports are labeled UNKNOWN rather than guessing or fabricating closures.',
  },
  {
    feature: 'Live Traffic Probes & Speeds',
    source: 'Commercial Probe API (Google / TomTom)',
    apiFeed: 'Awaiting commercial enterprise API key configuration',
    isLive: false,
    updateFrequency: 'N/A (Unconnected)',
    fallback: 'TRAFFIC DATA UNAVAILABLE (or SIMULATED in Demo Mode)',
    status: 'unavailable',
    description: 'Honest indicator shown when live probe telemetry is not connected; no fabricated speeds.',
  },
  {
    feature: 'Live Vehicle GPS Telemetry',
    source: 'Commercial AIS-140 GPS VTS Gateway',
    apiFeed: 'Awaiting government/fleet AIS-140 MQTT/REST endpoint',
    isLive: false,
    updateFrequency: 'N/A (Unconnected in Production)',
    fallback: 'No live telemetry connected (Simulated mode available for UI testing)',
    status: 'unavailable',
    description: 'Clearly indicates when live fleet GPS transponders are offline or disconnected.',
  },
  {
    feature: 'Logistics ERP & Cargo Manifests',
    source: 'State Civil Supplies & NF Railway Freight Gateway',
    apiFeed: 'Awaiting state PDS / logistics portal integration',
    isLive: false,
    updateFrequency: 'N/A (Unconnected in Production)',
    fallback: 'Shipment data unavailable (Simulated mode available for UI testing)',
    status: 'unavailable',
    description: 'Preserves data integrity by clearly distinguishing real manifests from test consignments.',
  },
  {
    feature: 'Emergency Helplines & Desks',
    source: 'Official Government Directory (SEOC / DDMA / NDRF / BRO)',
    apiFeed: 'Verified official public registry',
    isLive: true,
    updateFrequency: 'Quarterly state verification',
    fallback: 'State Emergency Operation Center 1070',
    status: 'official',
    description: 'Direct dial numbers for all 8 State Disaster Desks, BRO HQ Task Forces, and NHAI Highway Helpline.',
  },
];
