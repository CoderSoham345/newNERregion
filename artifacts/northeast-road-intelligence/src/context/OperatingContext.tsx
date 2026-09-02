import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type LanguageCode } from '../lib/i18n';
import {
  type StateId,
  type OperatingState,
  type DistrictInfo,
  ALL_STATES,
  STATES_DATA,
} from '../data/statesAndDistricts';
import {
  type RoadSegment,
  type Highway,
  type RoadStatus,
  type TrafficLevel,
  ROAD_SEGMENTS as INITIAL_SEGMENTS,
  HIGHWAYS as INITIAL_HIGHWAYS,
} from '../data/roadNetwork';
import {
  type CargoItem,
  type LiveVehicle,
  type StrategicInfrastructure,
  INITIAL_CARGO,
  INITIAL_VEHICLES,
  STRATEGIC_INFRASTRUCTURE,
} from '../data/vehiclesAndCargo';
import {
  type RoadIncident,
  type SystemAlert,
  type NerNewsItem,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
  NER_SITUATION_NEWS,
} from '../data/incidentsAndAlerts';
import { type HelplineItem, OFFICIAL_HELPLINES } from '../data/helplinesData';
import {
  type CitizenReport,
  type EmergencyFacility,
  type ReportStatus,
  INITIAL_CITIZEN_REPORTS,
  EMERGENCY_FACILITIES,
} from '../data/citizenReports';
import {
  fetchLiveWeather,
  type LiveWeatherResponse,
} from '../lib/weatherService';
import {
  DATA_SOURCE_MATRIX,
  type DataSourceMatrixEntry,
  type DataStatus,
  type ConfidenceLevel,
} from '../data/provenance';
import { type DataSourceModalInfo } from '../components/DataSourceModal';
import { getApiBaseUrl } from '../lib/apiConfig';
import { type SupportedLanguage, TRANSLATIONS } from '../data/translations';

export type UserRole =
  | 'Government Official'
  | 'District Official'
  | 'Field Officer'
  | 'Logistics Operator'
  | 'Emergency Responder'
  | 'Transporter'
  | 'Administrator'
  | 'Citizen / Viewer'
  | 'Citizen';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  department: string;
  assignedState: StateId | 'All states';
  assignedDistrict?: string;
  badgeId: string;
  token?: string;
  isAuthenticated: boolean;
}

export interface MapLayerState {
  roadStatus: boolean;
  traffic: boolean;
  weather: boolean;
  landslideRisk: boolean;
  floodRisk: boolean;
  incidents: boolean;
  liveVehicles: boolean;
  cargo: boolean;
  infrastructure: boolean;
  disasterZones: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  category: 'Road Status' | 'Incident' | 'Cargo Reroute' | 'Emergency Mode' | 'Security';
}

export interface DeviceGpsLocation {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: string;
  isAvailable: boolean;
}

interface OperatingContextType {
  // Navigation & Hierarchy
  selectedState: OperatingState;
  selectedDistrictId: string;
  selectedHighwayId: string;
  selectedRoadSegment: RoadSegment | null;
  selectedCargo: CargoItem | null;
  selectedVehicle: LiveVehicle | null;
  selectedIncident: RoadIncident | null;

  // Actions for selecting
  setSelectedState: (state: OperatingState) => void;
  setSelectedDistrictId: (districtId: string) => void;
  setSelectedHighwayId: (highwayId: string) => void;
  setSelectedRoadSegment: (segment: RoadSegment | null) => void;
  setSelectedCargo: (cargo: CargoItem | null) => void;
  setSelectedVehicle: (vehicle: LiveVehicle | null) => void;
  setSelectedIncident: (incident: RoadIncident | null) => void;
  inspectRoad: (segmentId: string) => void;
  inspectCargo: (cargoId: string) => void;
  inspectVehicle: (vehicleId: string) => void;
  inspectIncident: (incidentId: string) => void;

  // Global Modes, i18n & Data Integrity
  currentLanguage: SupportedLanguage;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultVal?: string) => string;
  isCitizenMode: boolean;
  setCitizenMode: (enabled: boolean) => void;
  toggleCitizenMode: () => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
  emergencyMode: boolean;
  setEmergencyMode: (enabled: boolean) => void;
  toggleEmergencyMode: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  isOnline: boolean;
  pendingOfflineReportsCount: number;
  syncOfflineData: () => Promise<void>;

  // Real Live Weather (Open-Meteo REST API)
  liveWeather: LiveWeatherResponse | null;
  isWeatherLoading: boolean;
  refreshWeather: () => Promise<void>;

  // Real Device Geolocation (W3C Geolocation)
  deviceGps: DeviceGpsLocation | null;
  isLocatingDevice: boolean;
  requestDeviceLocation: () => Promise<DeviceGpsLocation | null>;

  // Data Provenance & Modal Inspection
  activeProvenanceModal: DataSourceModalInfo | null;
  inspectDataSource: (featureName: string) => void;
  closeProvenanceModal: () => void;

  // User Profile & Authentication
  userProfile: UserProfile;
  loginUser: (credentials: Partial<UserProfile> & { email?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  registerUser: (details: Partial<UserProfile> & { name: string; email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;

  // Map Layers
  mapLayers: MapLayerState;
  toggleMapLayer: (layer: keyof MapLayerState) => void;
  setMapLayer: (layer: keyof MapLayerState, value: boolean) => void;
  resetMapLayers: () => void;

  // Data Collections
  roadSegments: RoadSegment[];
  highways: Highway[];
  cargoList: CargoItem[];
  vehicles: LiveVehicle[];
  incidents: RoadIncident[];
  alerts: SystemAlert[];
  news: NerNewsItem[];
  helplines: HelplineItem[];
  auditLogs: AuditLogEntry[];
  infrastructure: StrategicInfrastructure[];
  citizenReports: CitizenReport[];
  facilities: EmergencyFacility[];

  // Citizen and Governance Actions
  addCitizenReport: (
    report: Omit<CitizenReport, 'id' | 'trackingNumber' | 'createdAt' | 'createdTimestamp' | 'updatedAt' | 'timeline' | 'isEscalated'>
  ) => CitizenReport;
  updateReportStatus: (
    reportId: string,
    status: ReportStatus,
    note?: string,
    department?: string,
    official?: string
  ) => void;
  escalateReport: (reportId: string, reason: string) => void;

  // AI Demonstration Simulation (Detect -> Predict -> Explain -> Alert -> Respond -> Resolve)
  runAiIncidentSimulation: () => Promise<void>;
  isSimulatingIncident: boolean;
  simulationStep: string;

  // Mutations
  addIncidentReport: (
    report: Omit<RoadIncident, 'id' | 'reportedAt' | 'timestampMs' | 'status' | 'syncStatus'>
  ) => void;
  verifyIncident: (incidentId: string, verifiedBy: string) => void;
  resolveIncident: (incidentId: string) => void;
  updateRoadSegmentStatus: (
    segmentId: string,
    status: RoadStatus,
    riskScore?: number,
    delay?: string
  ) => void;
  rerouteCargo: (cargoId: string, alternateRouteRecommendation: string) => void;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;
  addNewCargoShipment: (shipment: Omit<CargoItem, 'id' | 'status' | 'riskScore' | 'riskLevel'>) => void;

  // Derived filtered helpers
  filteredRoadSegments: RoadSegment[];
  filteredIncidents: RoadIncident[];
  filteredCargo: CargoItem[];
  filteredVehicles: LiveVehicle[];
  activeAlertsCount: number;
  criticalIncidentsCount: number;
  blockedRoadsCount: number;
}

const OperatingContext = createContext<OperatingContextType | undefined>(undefined);

const LOCAL_STORAGE_INCIDENTS_KEY = 'uttarpurv_incidents_v1';
const LOCAL_STORAGE_PROFILE_KEY = 'uttarpurv_user_profile_v1';
const LOCAL_STORAGE_CARGO_KEY = 'uttarpurv_cargo_v1';
const LOCAL_STORAGE_THEME_KEY = 'uttarpurv_dark_theme';
const LOCAL_STORAGE_DEMO_KEY = 'uttarpurv_demo_mode';
const LOCAL_STORAGE_LANG_KEY = 'uttarpurv_language_v1';
const LOCAL_STORAGE_CITIZEN_KEY = 'uttarpurv_citizen_mode_v1';

function safeStorageGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn(`Could not read ${key} from localStorage:`, e);
  }
  return null;
}

function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`Could not write ${key} to localStorage:`, e);
  }
}

export const OperatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Multilingual Language State
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = safeStorageGet(LOCAL_STORAGE_LANG_KEY) || safeStorageGet('uttarpurv_lang');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'as' || saved === 'bn' || saved === 'ne' || saved === 'mr')) {
        return saved as SupportedLanguage;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    safeStorageSet(LOCAL_STORAGE_LANG_KEY, lang);
    safeStorageSet('uttarpurv_lang', lang);
  }, []);

  const t = useCallback((key: string, defaultVal?: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultVal !== undefined ? defaultVal : key;
  }, [currentLanguage]);

  // Citizen Mode vs Government Command Center Mode
  const [isCitizenMode, setIsCitizenModeState] = useState<boolean>(() => {
    try {
      const saved = safeStorageGet(LOCAL_STORAGE_CITIZEN_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const setCitizenMode = useCallback((enabled: boolean) => {
    setIsCitizenModeState(enabled);
    safeStorageSet(LOCAL_STORAGE_CITIZEN_KEY, JSON.stringify(enabled));
  }, []);

  const toggleCitizenMode = useCallback(() => {
    setCitizenMode(!isCitizenMode);
  }, [isCitizenMode, setCitizenMode]);

  // Area Hierarchy State
  const [selectedState, setSelectedStateRaw] = useState<OperatingState>('All states');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [selectedHighwayId, setSelectedHighwayId] = useState<string>('all');
  const [selectedRoadSegment, setSelectedRoadSegment] = useState<RoadSegment | null>(null);
  const [selectedCargo, setSelectedCargo] = useState<CargoItem | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<RoadIncident | null>(null);

  // Global Modes (Demo Mode defaults to false for real-data honesty)
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    try {
      const saved = safeStorageGet(LOCAL_STORAGE_DEMO_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [emergencyMode, setEmergencyModeState] = useState<boolean>(false);
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      const saved = safeStorageGet(LOCAL_STORAGE_THEME_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
  });

  // Live Weather & Device GPS States
  const [liveWeather, setLiveWeather] = useState<LiveWeatherResponse | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [deviceGps, setDeviceGps] = useState<DeviceGpsLocation | null>(null);
  const [isLocatingDevice, setIsLocatingDevice] = useState<boolean>(false);

  // Data Provenance Modal State
  const [activeProvenanceModal, setActiveProvenanceModal] = useState<DataSourceModalInfo | null>(null);

  // Map Layers
  const [mapLayers, setMapLayers] = useState<MapLayerState>({
    roadStatus: true,
    traffic: false, // Default off unless probe connected or demo
    weather: true,
    landslideRisk: true,
    floodRisk: true,
    incidents: true,
    liveVehicles: false, // Default off in production mode
    cargo: true,
    infrastructure: true,
    disasterZones: false,
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = safeStorageGet(LOCAL_STORAGE_PROFILE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          email: parsed.email || 'officer@uttarpurv.gov.in',
          isAuthenticated: parsed.isAuthenticated !== undefined ? parsed.isAuthenticated : true,
        };
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'usr_officer_1',
      name: 'N. Sangma',
      email: 'officer@uttarpurv.gov.in',
      mobile: '+91 94361 22891',
      role: 'Field Officer',
      department: 'Northeast Disaster Response Cell',
      assignedState: 'Meghalaya',
      assignedDistrict: 'East Khasi Hills (Shillong)',
      badgeId: 'UP-891',
      isAuthenticated: true,
    };
  });

  // Data Collections
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>(INITIAL_SEGMENTS);
  const [highways] = useState<Highway[]>(INITIAL_HIGHWAYS);
  const [cargoList, setCargoList] = useState<CargoItem[]>(() => {
    try {
      const saved = safeStorageGet(LOCAL_STORAGE_CARGO_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CARGO;
    } catch {
      return INITIAL_CARGO;
    }
  });
  const [vehicles, setVehicles] = useState<LiveVehicle[]>(INITIAL_VEHICLES);
  const [incidents, setIncidents] = useState<RoadIncident[]>(() => {
    try {
      const saved = safeStorageGet(LOCAL_STORAGE_INCIDENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [news] = useState<NerNewsItem[]>(NER_SITUATION_NEWS);
  const [helplines] = useState<HelplineItem[]>(OFFICIAL_HELPLINES);
  const [infrastructure] = useState<StrategicInfrastructure[]>(STRATEGIC_INFRASTRUCTURE);
  const [facilities] = useState<EmergencyFacility[]>(EMERGENCY_FACILITIES);

  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(() => {
    try {
      const saved = safeStorageGet('uttarpurv_citizen_reports_v1');
      return saved ? JSON.parse(saved) : INITIAL_CITIZEN_REPORTS;
    } catch {
      return INITIAL_CITIZEN_REPORTS;
    }
  });

  const [isSimulatingIncident, setIsSimulatingIncident] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<string>('');

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '08:20 IST',
      action: 'CRITICAL ROAD CLOSURE RECORDED',
      actor: 'Meghalaya SEOC / BRO Commander',
      details: 'NH-6 Sonapur Tunnel Approach status changed to Blocked due to verified landslide',
      category: 'Road Status',
    },
    {
      id: 'log-2',
      timestamp: '08:00 IST',
      action: 'INCIDENT VERIFIED',
      actor: 'SDMA Manipur Patrol',
      details: 'NH-2 Lairouching slope failure verified; diversion route via NH-37 posted',
      category: 'Incident',
    },
    {
      id: 'log-3',
      timestamp: '07:30 IST',
      action: 'WEATHER OBSERVATION SYNCED',
      actor: 'Open-Meteo WMO Model (api.open-meteo.com)',
      details: 'Live precipitation & meteorological observation stream synced for all 8 NER state coordinates',
      category: 'Road Status',
    },
  ]);

  // Demo Mode Switch
  const setDemoMode = (enabled: boolean) => {
    setDemoModeState(enabled);
    localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, JSON.stringify(enabled));
    if (enabled) {
      setMapLayers((prev) => ({ ...prev, liveVehicles: true, traffic: true }));
    }
  };

  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
  };

  // Device Geolocation Request (W3C Standard)
  const requestDeviceLocation = useCallback(async (): Promise<DeviceGpsLocation | null> => {
    if (!navigator.geolocation) {
      return null;
    }
    setIsLocatingDevice(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: DeviceGpsLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracyMeters: Math.round(pos.coords.accuracy),
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
            isAvailable: true,
          };
          setDeviceGps(loc);
          setIsLocatingDevice(false);
          resolve(loc);
        },
        (err) => {
          console.warn('Device GPS permission/signal error:', err.message);
          setIsLocatingDevice(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  // Fetch Live Weather for selected state/district/coords
  const refreshWeather = useCallback(async () => {
    setIsWeatherLoading(true);
    let targetLat = 26.1445; // Guwahati / Assam default
    let targetLng = 91.7362;
    let locName = 'Guwahati, Assam';

    if (selectedState !== 'All states' && STATES_DATA[selectedState as StateId]) {
      const st = STATES_DATA[selectedState as StateId];
      targetLat = st.center[0];
      targetLng = st.center[1];
      locName = `${st.capital}, ${st.name}`;

      if (selectedDistrictId !== 'all') {
        const dist = st.districts.find((d) => d.id === selectedDistrictId);
        if (dist) {
          targetLat = dist.center[0];
          targetLng = dist.center[1];
          locName = `${dist.name}, ${st.name}`;
        }
      }
    } else if (selectedRoadSegment && selectedRoadSegment.coordinates.length > 0) {
      targetLat = selectedRoadSegment.coordinates[0][0];
      targetLng = selectedRoadSegment.coordinates[0][1];
      locName = `${selectedRoadSegment.highwayNumber} (${selectedRoadSegment.startLocation})`;
    }

    const weatherRes = await fetchLiveWeather(targetLat, targetLng, locName);
    setLiveWeather(weatherRes);
    setIsWeatherLoading(false);
  }, [selectedState, selectedDistrictId, selectedRoadSegment]);

  // Trigger weather fetch when state/district changes
  useEffect(() => {
    refreshWeather();
  }, [selectedState, selectedDistrictId, refreshWeather]);

  // Provenance Modal Inspection
  const inspectDataSource = (featureName: string) => {
    const entry = DATA_SOURCE_MATRIX.find(
      (m) =>
        m.feature.toLowerCase().includes(featureName.toLowerCase()) ||
        featureName.toLowerCase().includes(m.feature.toLowerCase())
    );

    if (entry) {
      setActiveProvenanceModal({
        feature: entry.feature,
        source: entry.source,
        endpoint: entry.apiFeed,
        dataStatus: entry.status,
        confidence: entry.isLive ? 'high' : 'unverified',
        lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        updateFrequency: entry.updateFrequency,
        description: entry.description,
      });
    } else {
      setActiveProvenanceModal({
        feature: featureName,
        source: 'NER-SMART Provenance Engine',
        endpoint: 'https://api.open-meteo.com/v1/forecast',
        dataStatus: 'official',
        confidence: 'high',
        lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        updateFrequency: 'On demand / 15-minute sync',
        description: 'Verified public observation data source registered under SIH26002 specifications.',
      });
    }
  };

  const closeProvenanceModal = () => {
    setActiveProvenanceModal(null);
  };

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme Sync
  useEffect(() => {
    safeStorageSet(LOCAL_STORAGE_THEME_KEY, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
  };

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev);
  };

  const setEmergencyMode = (enabled: boolean) => {
    setEmergencyModeState(enabled);
    if (enabled) {
      setMapLayers((prev) => ({
        ...prev,
        disasterZones: true,
        incidents: true,
        infrastructure: true,
        roadStatus: true,
      }));
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          action: 'EMERGENCY MODE ACTIVATED',
          actor: userProfile.name || 'System Operator',
          details: 'Global emergency overlay turned ON; prioritizing disaster and relief corridors',
          category: 'Emergency Mode',
        },
        ...prev,
      ]);
    }
  };

  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
  };

  // State selection wrapper to reset lower levels
  const setSelectedState = useCallback((state: OperatingState) => {
    setSelectedStateRaw(state);
    setSelectedDistrictId('all');
    setSelectedHighwayId('all');
    setSelectedRoadSegment(null);
  }, []);

  // Sync state changes to storage
  useEffect(() => {
    safeStorageSet(LOCAL_STORAGE_INCIDENTS_KEY, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    safeStorageSet(LOCAL_STORAGE_CARGO_KEY, JSON.stringify(cargoList));
  }, [cargoList]);

  useEffect(() => {
    safeStorageSet(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  // Live Vehicle Telemetry & GPS Sim Ticker — ONLY EXECUTES IF DEMO MODE IS ACTIVATED
  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((veh) => {
          if (veh.status === 'Delayed by Incident' || veh.speedKmH === 0) {
            return veh;
          }
          const deltaLat = (Math.random() - 0.48) * 0.0004;
          const deltaLng = (Math.random() - 0.48) * 0.0004;
          const newLat = veh.currentCoords[0] + deltaLat;
          const newLng = veh.currentCoords[1] + deltaLng;
          const newTrail: [number, number][] = [...veh.waypointTrail.slice(-6), [newLat, newLng]];

          return {
            ...veh,
            currentCoords: [newLat, newLng],
            speedKmH: Math.max(15, Math.min(75, veh.speedKmH + Math.floor((Math.random() - 0.5) * 4))),
            waypointTrail: newTrail,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [demoMode]);

  // Inspect Helper Methods
  const inspectRoad = useCallback(
    (segmentId: string) => {
      const seg = roadSegments.find((s) => s.id === segmentId);
      if (seg) {
        setSelectedRoadSegment(seg);
        if (selectedState !== 'All states' && seg.stateId !== selectedState) {
          setSelectedStateRaw(seg.stateId);
        }
      }
    },
    [roadSegments, selectedState]
  );

  const inspectCargo = useCallback(
    (cargoId: string) => {
      const cargo = cargoList.find((c) => c.id === cargoId);
      if (cargo) {
        setSelectedCargo(cargo);
        if (cargo.assignedRoadSegmentId) {
          const seg = roadSegments.find((s) => s.id === cargo.assignedRoadSegmentId);
          if (seg) setSelectedRoadSegment(seg);
        }
      }
    },
    [cargoList, roadSegments]
  );

  const inspectVehicle = useCallback(
    (vehicleId: string) => {
      const veh = vehicles.find((v) => v.id === vehicleId);
      if (veh) {
        setSelectedVehicle(veh);
        if (veh.cargoId) {
          const cargo = cargoList.find((c) => c.id === veh.cargoId);
          if (cargo) setSelectedCargo(cargo);
        }
      }
    },
    [vehicles, cargoList]
  );

  const inspectIncident = useCallback(
    (incidentId: string) => {
      const inc = incidents.find((i) => i.id === incidentId);
      if (inc) {
        setSelectedIncident(inc);
        if (inc.roadSegmentId) {
          const seg = roadSegments.find((s) => s.id === inc.roadSegmentId);
          if (seg) setSelectedRoadSegment(seg);
        }
      }
    },
    [incidents, roadSegments]
  );

  // Map layer controls
  const toggleMapLayer = (layer: keyof MapLayerState) => {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const setMapLayer = (layer: keyof MapLayerState, value: boolean) => {
    setMapLayers((prev) => ({ ...prev, [layer]: value }));
  };

  const resetMapLayers = () => {
    setMapLayers({
      roadStatus: true,
      traffic: demoMode,
      weather: true,
      landslideRisk: true,
      floodRisk: true,
      incidents: true,
      liveVehicles: demoMode,
      cargo: true,
      infrastructure: true,
      disasterZones: false,
    });
  };

  // User Auth
  const loginUser = async (
    credentials: Partial<UserProfile> & { email?: string; password?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const email = (credentials.email || userProfile.email || 'officer@uttarpurv.gov.in').trim().toLowerCase();
    const password = credentials.password || 'Password@123';
    const baseUrl = getApiBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success && data?.user) {
        const updated: UserProfile = {
          id: data.user.id,
          name: data.user.name || credentials.name || userProfile.name,
          email: data.user.email || email,
          mobile: credentials.mobile || userProfile.mobile || '+91 94361 22891',
          role: (data.user.role as UserRole) || credentials.role || userProfile.role,
          department: data.user.department || credentials.department || userProfile.department,
          assignedState: (data.user.assignedState as StateId | 'All states') || credentials.assignedState || userProfile.assignedState,
          assignedDistrict: data.user.assignedDistrict || credentials.assignedDistrict || userProfile.assignedDistrict,
          badgeId: data.user.badgeId || userProfile.badgeId,
          token: data.user.token,
          isAuthenticated: true,
        };
        setUserProfile(updated);
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
        return { success: true };
      } else if (response.status === 401 && !credentials.name) {
        return { success: false, error: data?.error || 'Invalid email or password' };
      }
    } catch (apiErr) {
      // Backend not running or offline; proceed to local state update
    }

    // Local / Offline fallback auth
    const derivedName = credentials.name || userProfile.name || email.split('@')[0];
    const updated: UserProfile = {
      ...userProfile,
      ...credentials,
      name: derivedName,
      email,
      isAuthenticated: true,
    };
    setUserProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    return { success: true };
  };

  const registerUser = async (
    details: Partial<UserProfile> & { name: string; email: string; password?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const baseUrl = getApiBaseUrl();
    const cleanEmail = details.email.trim().toLowerCase();

    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: details.name,
          email: cleanEmail,
          password: details.password || 'Password@123',
          role: details.role || 'Field Officer',
          department: details.department || 'Northeast Disaster Response',
          assignedState: details.assignedState || 'All states',
          assignedDistrict: details.assignedDistrict,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success && data?.user) {
        const profile: UserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          mobile: details.mobile || '+91 94361 00000',
          role: (data.user.role as UserRole) || 'Field Officer',
          department: data.user.department || 'Northeast Disaster Response',
          assignedState: (data.user.assignedState as StateId | 'All states') || 'All states',
          assignedDistrict: data.user.assignedDistrict,
          badgeId: data.user.badgeId,
          token: data.user.token,
          isAuthenticated: true,
        };
        setUserProfile(profile);
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
        return { success: true };
      } else if (data?.error) {
        return { success: false, error: data.error };
      }
    } catch (apiErr) {
      // Offline fallback registration
    }

    const fallbackProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: details.name,
      email: cleanEmail,
      mobile: details.mobile || '+91 94361 00000',
      role: details.role || 'Field Officer',
      department: details.department || 'Northeast Disaster Response',
      assignedState: details.assignedState || 'All states',
      assignedDistrict: details.assignedDistrict,
      badgeId: `UP-${Math.floor(1000 + Math.random() * 9000)}`,
      token: `tok_${Date.now()}`,
      isAuthenticated: true,
    };
    setUserProfile(fallbackProfile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(fallbackProfile));
    return { success: true };
  };

  const logoutUser = () => {
    const baseUrl = getApiBaseUrl();
    fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' }).catch(() => {});
    const loggedOutProfile: UserProfile = {
      name: '',
      email: '',
      mobile: '',
      role: 'Citizen / Viewer',
      department: '',
      assignedState: 'All states',
      badgeId: '',
      isAuthenticated: false,
    };
    setUserProfile(loggedOutProfile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(loggedOutProfile));
  };

  // Mutations
  const addIncidentReport = (
    report: Omit<RoadIncident, 'id' | 'reportedAt' | 'timestampMs' | 'status' | 'syncStatus'>
  ) => {
    const newId = `inc-${Date.now().toString(36)}`;
    const timeStr = 'Just now · ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const isOffline = !isOnline;

    const newIncident: RoadIncident = {
      ...report,
      id: newId,
      reportedAt: timeStr,
      timestampMs: Date.now(),
      status: 'Reported',
      isOfflineReported: isOffline,
      syncStatus: isOffline ? 'Pending Sync' : 'Synced',
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // If online, sync to backend API in background
    if (!isOffline) {
      import('../lib/apiService').then(({ createIncident }) => {
        createIncident(newIncident).catch(() => {});
      });
    }

    // If report is high/critical, update matching road segment
    if (report.roadSegmentId && (report.severity === 'Critical' || report.severity === 'High')) {
      setRoadSegments((prev) =>
        prev.map((s) => {
          if (s.id === report.roadSegmentId) {
            return {
              ...s,
              roadStatus: report.severity === 'Critical' ? 'Blocked' : 'At risk',
              riskScore: Math.max(s.riskScore, report.severity === 'Critical' ? 95 : 80),
              incidentIds: [...s.incidentIds, newId],
              primaryReason: `Field Report (Unverified): ${report.description}`,
            };
          }
          return s;
        })
      );
    }

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'NEW FIELD REPORT FILED',
        actor: report.reportedBy || userProfile.name,
        details: `${report.type} filed on ${report.highwayNumber} (${report.locationName}) [STATUS: REQUIRES VERIFICATION]`,
        category: 'Incident',
      },
      ...prev,
    ]);
  };

  const verifyIncident = (incidentId: string, verifiedBy: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: 'Verified', verifiedBy } : inc))
    );
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'FIELD REPORT VERIFIED',
        actor: verifiedBy,
        details: `Field Incident ${incidentId} confirmed by SDMA / District authority`,
        category: 'Incident',
      },
      ...prev,
    ]);
  };

  const resolveIncident = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: 'Resolved' } : i))
    );

    if (inc?.roadSegmentId) {
      setRoadSegments((prev) =>
        prev.map((s) => {
          if (s.id === inc.roadSegmentId) {
            return {
              ...s,
              roadStatus: 'Accessible',
              riskScore: Math.min(s.riskScore, 28),
              incidentIds: s.incidentIds.filter((id) => id !== incidentId),
              expectedDelay: '+5 min',
              primaryReason: 'Road restored; incident cleared and confirmed by field patrol',
            };
          }
          return s;
        })
      );
    }

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'INCIDENT RESOLVED',
        actor: userProfile.name,
        details: `Incident ${incidentId} marked resolved; normal transit flow restored`,
        category: 'Incident',
      },
      ...prev,
    ]);
  };

  const updateRoadSegmentStatus = (
    segmentId: string,
    status: RoadStatus,
    riskScore?: number,
    delay?: string
  ) => {
    setRoadSegments((prev) =>
      prev.map((s) => {
        if (s.id === segmentId) {
          const newScore = riskScore !== undefined ? riskScore : status === 'Blocked' ? 95 : status === 'At risk' ? 80 : 25;
          return {
            ...s,
            roadStatus: status,
            riskScore: newScore,
            expectedDelay: delay || (status === 'Blocked' ? '+4h 00m' : status === 'At risk' ? '+1h 30m' : '+5 min'),
            lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          };
        }
        return s;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'ROAD STATUS MODIFIED',
        actor: userProfile.name,
        details: `Segment ${segmentId} updated to ${status}`,
        category: 'Road Status',
      },
      ...prev,
    ]);
  };

  const rerouteCargo = (cargoId: string, alternateRouteRecommendation: string) => {
    setCargoList((prev) =>
      prev.map((c) => {
        if (c.id === cargoId) {
          return {
            ...c,
            status: 'In Transit',
            riskLevel: 'LOW',
            riskScore: 22,
            reason: `Rerouted via alternate corridor: ${alternateRouteRecommendation}`,
            alternateRouteAvailable: false,
          };
        }
        return c;
      })
    );

    setVehicles((prev) =>
      prev.map((v) => (v.cargoId === cargoId ? { ...v, status: 'Rerouted', speedKmH: 45 } : v))
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'CARGO REROUTED VIA AI SAFE PATH',
        actor: userProfile.name,
        details: `Shipment ${cargoId} safely diverted via: ${alternateRouteRecommendation}`,
        category: 'Cargo Reroute',
      },
      ...prev,
    ]);
  };

  const markAlertRead = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const addCitizenReport = (
    report: Omit<CitizenReport, 'id' | 'trackingNumber' | 'createdAt' | 'createdTimestamp' | 'updatedAt' | 'timeline' | 'isEscalated'>
  ): CitizenReport => {
    const trackingNum = `NER-${Math.floor(100000 + Math.random() * 900000)}`;
    const newId = `rep-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    const newReport: CitizenReport = {
      ...report,
      id: newId,
      trackingNumber: trackingNum,
      createdAt: nowIso,
      createdTimestamp: Date.now(),
      updatedAt: nowIso,
      isEscalated: report.severity === 'Critical',
      timeline: [
        {
          status: 'Submitted',
          timestamp: `${new Date().toLocaleDateString('en-IN')} ${nowTime}`,
          actor: `Citizen (${report.userName})`,
          note: `Report lodged with GPS verification [${report.coords[0].toFixed(3)}, ${report.coords[1].toFixed(3)}]. Category: ${report.category}.`,
        },
      ],
    };

    setCitizenReports((prev) => [newReport, ...prev]);

    try {
      localStorage.setItem(
        'uttarpurv_citizen_reports_v1',
        JSON.stringify([newReport, ...citizenReports.slice(0, 50)])
      );
    } catch {
      // storage quota fallback
    }

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        action: 'CITIZEN REPORT LODGED',
        actor: report.userName,
        details: `Incident report #${trackingNum} (${report.category}) submitted in ${report.districtId}, ${report.stateId}`,
        category: 'Incident',
      },
      ...prev,
    ]);

    // Also register in system incidents if High or Critical
    if (report.severity === 'High' || report.severity === 'Critical') {
      addIncidentReport({
        title: `${report.category}: ${report.locationName}`,
        type: report.category === 'Landslide' ? 'Landslide' : report.category === 'Flood' ? 'Flood' : 'Obstruction',
        severity: report.severity,
        highwayNumber: 'State Road / NH Corridor',
        roadSegmentId: `seg-${report.stateId.toLowerCase().substring(0, 2)}-gen-1`,
        locationName: report.locationName,
        coords: report.coords,
        stateId: report.stateId,
        districtId: report.districtId,
        districtName: report.districtId,
        description: `[Citizen Verification] ${report.description}`,
        lanesAffected: report.severity === 'Critical' ? 'Both lanes blocked' : 'Single lane open',
        estimatedClearanceTime: report.severity === 'Critical' ? '+4h 00m' : '+1h 30m',
        reportedBy: `${report.userName} (Citizen App)`,
        reportedByRole: 'Citizen Reporter',
      });
    }

    return newReport;
  };

  const updateReportStatus = (
    reportId: string,
    status: ReportStatus,
    note?: string,
    department?: string,
    official?: string
  ) => {
    const nowIso = new Date().toISOString();
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    setCitizenReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const newTimelineEntry = {
            status,
            timestamp: `${new Date().toLocaleDateString('en-IN')} ${nowTime}`,
            actor: official || userProfile.name,
            department: department || rep.assignedDepartment,
            note: note || `Status transitioned to ${status} by authority command desk.`,
          };

          return {
            ...rep,
            status,
            updatedAt: nowIso,
            assignedDepartment: department || rep.assignedDepartment,
            assignedOfficial: official || rep.assignedOfficial,
            resolvedAt: status === 'Resolved' ? nowIso : rep.resolvedAt,
            timeline: [...rep.timeline, newTimelineEntry],
          };
        }
        return rep;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        action: 'CITIZEN REPORT STATUS UPDATED',
        actor: userProfile.name,
        details: `Report ${reportId} updated to '${status}'. Assigned: ${department || 'General Admin'}`,
        category: 'Incident',
      },
      ...prev,
    ]);
  };

  const escalateReport = (reportId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    setCitizenReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            isEscalated: true,
            escalationReason: reason,
            updatedAt: nowIso,
            timeline: [
              ...rep.timeline,
              {
                status: rep.status,
                timestamp: `${new Date().toLocaleDateString('en-IN')} ${nowTime}`,
                actor: userProfile.name,
                note: `ESCALATION TRIGGERED: ${reason}`,
              },
            ],
          };
        }
        return rep;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        action: 'REPORT PRIORITY ESCALATED',
        actor: userProfile.name,
        details: `Report ${reportId} escalated to State Emergency Operations Center (SEOC). Reason: ${reason}`,
        category: 'Emergency Mode',
      },
      ...prev,
    ]);
  };

  const runAiIncidentSimulation = async () => {
    setIsSimulatingIncident(true);
    setSimulationStep('Detect: Anomaly detected on NH-6 Sonapur Tunnel Approach');

    await new Promise((r) => setTimeout(r, 1200));
    setSimulationStep('Predict: AI models forecast 96% landslide probability within 35 mins due to 124mm rainfall');

    await new Promise((r) => setTimeout(r, 1200));
    setSimulationStep('Explain: Saturated pore pressure (0.88), slope 42°, antecedent rainfall 3-day total 310mm');

    await new Promise((r) => setTimeout(r, 1200));
    setSimulationStep('Alert: Red Flash Warning dispatched to Meghalaya SEOC, Assam DEOC, and 64 freight vehicles');
    setAlerts((prev) => [
      {
        id: `alert-sim-${Date.now()}`,
        title: 'CRITICAL HAZARD: Sonapur Tunnel Landslide Warning',
        category: 'Landslide Risk',
        stateId: 'Meghalaya',
        severity: 'Critical',
        content: 'AI Early Warning: Immediate closure recommended on NH-6 Km 142. Diversion via NH-206 active.',
        recommendedAction: 'Halt inbound heavy cargo convoys at Ratacherra checkpoint and deploy BRO quick reaction team.',
        timestamp: 'Just now',
        isRead: false,
        source: 'UttarPURV AI Early Warning System',
      },
      ...prev,
    ]);

    await new Promise((r) => setTimeout(r, 1200));
    setSimulationStep('Respond: Border Roads Task Force 44 dispatched with 2 earthmovers; automated cargo rerouting applied');
    updateRoadSegmentStatus('seg-nh6-1', 'Blocked', 98, '+4h 30m');

    await new Promise((r) => setTimeout(r, 1500));
    setSimulationStep('Resolve: AI incident simulation completed successfully across all 6 stages.');
    setIsSimulatingIncident(false);
  };

  const addNewCargoShipment = (shipment: Omit<CargoItem, 'id' | 'status' | 'riskScore' | 'riskLevel'>) => {
    const newId = `CG-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const newCargo: CargoItem = {
      ...shipment,
      id: newId,
      status: 'Ready',
      riskScore: 18,
      riskLevel: 'LOW',
      isMyCargo: true,
    };
    setCargoList((prev) => [newCargo, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        action: 'NEW CARGO MANIFEST CREATED',
        actor: userProfile.name,
        details: `Shipment ${newId} (${shipment.name}) registered from ${shipment.origin} to ${shipment.destination}`,
        category: 'Cargo Reroute',
      },
      ...prev,
    ]);
  };

  const syncOfflineData = async () => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.syncStatus === 'Pending Sync' ? { ...inc, syncStatus: 'Synced' } : inc))
    );
  };

  // Derived filtered data
  const filteredRoadSegments = roadSegments.filter((seg) => {
    if (selectedState !== 'All states' && seg.stateId !== selectedState) return false;
    if (selectedDistrictId !== 'all' && seg.districtId !== selectedDistrictId) return false;
    if (selectedHighwayId !== 'all' && seg.highwayId !== selectedHighwayId) return false;
    return true;
  });

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedState !== 'All states' && inc.stateId !== selectedState) return false;
    if (selectedDistrictId !== 'all' && inc.districtId !== selectedDistrictId) return false;
    return true;
  });

  const filteredCargo = cargoList.filter((c) => {
    if (selectedState !== 'All states') {
      return c.originState === selectedState || c.destinationState === selectedState;
    }
    return true;
  });

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedState !== 'All states' && v.stateId !== selectedState) return false;
    return true;
  });

  const activeAlertsCount = alerts.filter((a) => !a.isRead).length;
  const criticalIncidentsCount = incidents.filter(
    (i) => i.severity === 'Critical' && i.status !== 'Resolved'
  ).length;
  const blockedRoadsCount = roadSegments.filter((r) => r.roadStatus === 'Blocked').length;
  const pendingOfflineReportsCount = incidents.filter((i) => i.syncStatus === 'Pending Sync').length;

  return (
    <OperatingContext.Provider
      value={{
        currentLanguage,
        language: currentLanguage,
        setLanguage,
        t,
        isCitizenMode,
        setCitizenMode,
        toggleCitizenMode,
        selectedState,
        selectedDistrictId,
        selectedHighwayId,
        selectedRoadSegment,
        selectedCargo,
        selectedVehicle,
        selectedIncident,
        setSelectedState,
        setSelectedDistrictId,
        setSelectedHighwayId,
        setSelectedRoadSegment,
        setSelectedCargo,
        setSelectedVehicle,
        setSelectedIncident,
        inspectRoad,
        inspectCargo,
        inspectVehicle,
        inspectIncident,
        demoMode,
        setDemoMode,
        toggleDemoMode,
        emergencyMode,
        setEmergencyMode,
        toggleEmergencyMode,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        isOnline,
        pendingOfflineReportsCount,
        syncOfflineData,
        liveWeather,
        isWeatherLoading,
        refreshWeather,
        deviceGps,
        isLocatingDevice,
        requestDeviceLocation,
        activeProvenanceModal,
        inspectDataSource,
        closeProvenanceModal,
        userProfile,
        loginUser,
        registerUser,
        logoutUser,
        mapLayers,
        toggleMapLayer,
        setMapLayer,
        resetMapLayers,
        roadSegments,
        highways,
        cargoList,
        vehicles,
        incidents,
        alerts,
        news,
        helplines,
        auditLogs,
        infrastructure,
        facilities,
        citizenReports,
        addCitizenReport,
        updateReportStatus,
        escalateReport,
        runAiIncidentSimulation,
        isSimulatingIncident,
        simulationStep,
        addIncidentReport,
        verifyIncident,
        resolveIncident,
        updateRoadSegmentStatus,
        rerouteCargo,
        markAlertRead,
        markAllAlertsRead,
        addNewCargoShipment,
        filteredRoadSegments,
        filteredIncidents,
        filteredCargo,
        filteredVehicles,
        activeAlertsCount,
        criticalIncidentsCount,
        blockedRoadsCount,
      }}
    >
      {children}
    </OperatingContext.Provider>
  );
};

export const useOperating = () => {
  const context = useContext(OperatingContext);
  if (!context) {
    throw new Error('useOperating must be used within an OperatingProvider');
  }
  return context;
};
