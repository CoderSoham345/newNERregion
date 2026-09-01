export type StateId =
  | 'Assam'
  | 'Arunachal Pradesh'
  | 'Meghalaya'
  | 'Manipur'
  | 'Mizoram'
  | 'Nagaland'
  | 'Tripura'
  | 'Sikkim';

export type OperatingState = 'All states' | StateId;

export interface DistrictInfo {
  id: string;
  name: string;
  stateId: StateId;
  center: [number, number];
  population: string;
  roadCount: number;
  highwayCount: number;
  accessibilityScore: number; // 0-100
  riskScore: number; // 0-100
  weather: string;
  rainfall: number; // mm in 24h
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  trafficStatus: 'Free' | 'Moderate' | 'Heavy' | 'Severe';
  incidentCount: number;
  blockedRoadCount: number;
  atRiskRoadCount: number;
  cargoCount: number;
  terrainType: 'Hilly / Mountainous' | 'Valley / Plains' | 'Riverine / Delta' | 'Foothill';
  helplineCount: number;
}

export interface StateData {
  id: StateId;
  name: string;
  code: string;
  capital: string;
  areaSqKm: number;
  populationTotal: string;
  demographicRefYear: string;
  demographicSource: string;
  districtCount: number;
  center: [number, number];
  zoom: number;
  districts: DistrictInfo[];
  accessibility: number;
  blocked: number;
  atRisk: number;
  incidents: number;
  weatherSummary: string;
  rainfall24h: number;
  temperatureAvg: number;
  landslideRisk: number; // %
  floodRisk: number; // %
  activeCargo: number;
  monitoredHighways: number;
  roadSegments: number;
  overview: string;
}

export const ALL_STATES: OperatingState[] = [
  'All states',
  'Assam',
  'Arunachal Pradesh',
  'Meghalaya',
  'Manipur',
  'Mizoram',
  'Nagaland',
  'Tripura',
  'Sikkim',
];

export const STATES_DATA: Record<StateId, StateData> = {
  Assam: {
    id: 'Assam',
    name: 'Assam',
    code: 'AS',
    capital: 'Dispur / Guwahati',
    areaSqKm: 78438,
    populationTotal: '31.20 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 35,
    center: [26.2006, 92.9376],
    zoom: 7,
    accessibility: 88,
    blocked: 3,
    atRisk: 14,
    incidents: 6,
    weatherSummary: 'Scattered monsoon showers with Brahmaputra riverine flood watch',
    rainfall24h: 42,
    temperatureAvg: 28,
    landslideRisk: 34,
    floodRisk: 68,
    activeCargo: 48,
    monitoredHighways: 12,
    roadSegments: 42,
    overview:
      'Crucial transit corridor connecting the rest of India with all Sister States through the Siliguri corridor. High river-basin exposure along Brahmaputra valley with heavy logistical traffic along NH-27 and NH-37.',
    districts: [
      { id: 'as-kamrup-metro', name: 'Kamrup Metropolitan (Guwahati)', stateId: 'Assam', center: [26.1445, 91.7362], population: '1.25M', roadCount: 142, highwayCount: 6, accessibilityScore: 92, riskScore: 24, weather: 'Partly Cloudy', rainfall: 18, temperature: 29, humidity: 78, windSpeed: 12, trafficStatus: 'Heavy', incidentCount: 2, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 26, terrainType: 'Valley / Plains', helplineCount: 8 },
      { id: 'as-dibrugarh', name: 'Dibrugarh', stateId: 'Assam', center: [27.4728, 94.912], population: '1.32M', roadCount: 98, highwayCount: 4, accessibilityScore: 84, riskScore: 38, weather: 'Moderate Rain', rainfall: 48, temperature: 27, humidity: 86, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 14, terrainType: 'Riverine / Delta', helplineCount: 6 },
      { id: 'as-cachar', name: 'Cachar (Silchar)', stateId: 'Assam', center: [24.8333, 92.7789], population: '1.73M', roadCount: 110, highwayCount: 5, accessibilityScore: 72, riskScore: 62, weather: 'Heavy Showers', rainfall: 64, temperature: 26, humidity: 92, windSpeed: 14, trafficStatus: 'Heavy', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 18, terrainType: 'Riverine / Delta', helplineCount: 7 },
      { id: 'as-sonitpur', name: 'Sonitpur (Tezpur)', stateId: 'Assam', center: [26.6528, 92.7926], population: '1.92M', roadCount: 86, highwayCount: 3, accessibilityScore: 90, riskScore: 22, weather: 'Overcast', rainfall: 22, temperature: 28, humidity: 80, windSpeed: 10, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 9, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'as-dima-hasao', name: 'Dima Hasao (Haflong)', stateId: 'Assam', center: [25.178, 93.02], population: '214K', roadCount: 54, highwayCount: 3, accessibilityScore: 65, riskScore: 76, weather: 'Heavy Mountain Rain', rainfall: 78, temperature: 23, humidity: 94, windSpeed: 18, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 4, cargoCount: 7, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'as-jorhat', name: 'Jorhat', stateId: 'Assam', center: [26.7509, 94.2037], population: '1.09M', roadCount: 76, highwayCount: 3, accessibilityScore: 88, riskScore: 28, weather: 'Scattered Showers', rainfall: 32, temperature: 28, humidity: 82, windSpeed: 11, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 12, terrainType: 'Valley / Plains', helplineCount: 6 },
      { id: 'as-nagaon', name: 'Nagaon', stateId: 'Assam', center: [26.3467, 92.684], population: '2.82M', roadCount: 88, highwayCount: 4, accessibilityScore: 89, riskScore: 30, weather: 'Cloudy', rainfall: 24, temperature: 29, humidity: 81, windSpeed: 12, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 15, terrainType: 'Valley / Plains', helplineCount: 6 },
      { id: 'as-karbi-anglong', name: 'Karbi Anglong (Diphu)', stateId: 'Assam', center: [25.843, 93.435], population: '956K', roadCount: 62, highwayCount: 3, accessibilityScore: 74, riskScore: 58, weather: 'Thunderstorms', rainfall: 56, temperature: 25, humidity: 90, windSpeed: 15, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 8, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'as-tinsukia', name: 'Tinsukia', stateId: 'Assam', center: [27.4922, 95.3468], population: '1.32M', roadCount: 70, highwayCount: 3, accessibilityScore: 85, riskScore: 34, weather: 'Moderate Rain', rainfall: 42, temperature: 27, humidity: 85, windSpeed: 13, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 11, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'as-barpeta', name: 'Barpeta', stateId: 'Assam', center: [26.3211, 91.0044], population: '1.69M', roadCount: 68, highwayCount: 2, accessibilityScore: 86, riskScore: 40, weather: 'Overcast', rainfall: 28, temperature: 28, humidity: 84, windSpeed: 12, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 7, terrainType: 'Riverine / Delta', helplineCount: 5 },
      { id: 'as-dhubri', name: 'Dhubri', stateId: 'Assam', center: [26.02, 89.98], population: '1.94M', roadCount: 64, highwayCount: 2, accessibilityScore: 82, riskScore: 45, weather: 'Showers', rainfall: 35, temperature: 29, humidity: 86, windSpeed: 14, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 9, terrainType: 'Riverine / Delta', helplineCount: 5 },
      { id: 'as-golaghat', name: 'Golaghat', stateId: 'Assam', center: [26.52, 93.97], population: '1.06M', roadCount: 58, highwayCount: 2, accessibilityScore: 87, riskScore: 26, weather: 'Partly Cloudy', rainfall: 20, temperature: 28, humidity: 79, windSpeed: 10, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 6, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'as-sivasagar', name: 'Sivasagar', stateId: 'Assam', center: [26.98, 94.63], population: '1.15M', roadCount: 60, highwayCount: 2, accessibilityScore: 88, riskScore: 24, weather: 'Light Rain', rainfall: 26, temperature: 27, humidity: 82, windSpeed: 11, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 7, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'as-kokrajhar', name: 'Kokrajhar (BTR)', stateId: 'Assam', center: [26.4, 90.27], population: '887K', roadCount: 56, highwayCount: 2, accessibilityScore: 84, riskScore: 32, weather: 'Cloudy', rainfall: 22, temperature: 28, humidity: 80, windSpeed: 12, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 8, terrainType: 'Foothill', helplineCount: 5 },
      { id: 'as-karimganj', name: 'Karimganj', stateId: 'Assam', center: [24.87, 92.35], population: '1.22M', roadCount: 54, highwayCount: 2, accessibilityScore: 76, riskScore: 54, weather: 'Moderate Rain', rainfall: 52, temperature: 27, humidity: 89, windSpeed: 13, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 8, terrainType: 'Riverine / Delta', helplineCount: 5 },
    ],
  },
  'Arunachal Pradesh': {
    id: 'Arunachal Pradesh',
    name: 'Arunachal Pradesh',
    code: 'AR',
    capital: 'Itanagar',
    areaSqKm: 83743,
    populationTotal: '1.38 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 26,
    center: [28.218, 94.7278],
    zoom: 7,
    accessibility: 69,
    blocked: 7,
    atRisk: 21,
    incidents: 9,
    weatherSummary: 'Persistent orographic rainfall along foothill and high-altitude passes',
    rainfall24h: 68,
    temperatureAvg: 20,
    landslideRisk: 79,
    floodRisk: 42,
    activeCargo: 22,
    monitoredHighways: 8,
    roadSegments: 36,
    overview:
      'Strategic eastern frontier state with extreme elevation gradients. Highways NH-13 (Trans-Arunachal Highway) and NH-415 are subject to cloudbursts and rockfall during monsoon seasons.',
    districts: [
      { id: 'ar-papum-pare', name: 'Papum Pare (Itanagar)', stateId: 'Arunachal Pradesh', center: [27.0844, 93.6053], population: '176K', roadCount: 62, highwayCount: 3, accessibilityScore: 78, riskScore: 48, weather: 'Continuous Rain', rainfall: 54, temperature: 24, humidity: 89, windSpeed: 14, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 12, terrainType: 'Foothill', helplineCount: 6 },
      { id: 'ar-west-kameng', name: 'West Kameng (Bomdila)', stateId: 'Arunachal Pradesh', center: [27.2645, 92.421], population: '84K', roadCount: 48, highwayCount: 2, accessibilityScore: 61, riskScore: 82, weather: 'Heavy Mountain Rain', rainfall: 82, temperature: 16, humidity: 95, windSpeed: 22, trafficStatus: 'Heavy', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 6, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ar-tawang', name: 'Tawang', stateId: 'Arunachal Pradesh', center: [27.5861, 91.8594], population: '50K', roadCount: 38, highwayCount: 2, accessibilityScore: 58, riskScore: 86, weather: 'Fog & Mountain Rain', rainfall: 72, temperature: 13, humidity: 96, windSpeed: 24, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'ar-lohit', name: 'Lohit (Tezu)', stateId: 'Arunachal Pradesh', center: [27.914, 96.166], population: '145K', roadCount: 44, highwayCount: 2, accessibilityScore: 74, riskScore: 55, weather: 'Showers', rainfall: 44, temperature: 25, humidity: 87, windSpeed: 12, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 6, terrainType: 'Foothill', helplineCount: 5 },
      { id: 'ar-east-siang', name: 'East Siang (Pasighat)', stateId: 'Arunachal Pradesh', center: [28.0667, 95.3333], population: '99K', roadCount: 46, highwayCount: 2, accessibilityScore: 72, riskScore: 52, weather: 'Overcast & Drizzle', rainfall: 38, temperature: 26, humidity: 84, windSpeed: 15, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 4, cargoCount: 8, terrainType: 'Foothill', helplineCount: 5 },
      { id: 'ar-changlang', name: 'Changlang', stateId: 'Arunachal Pradesh', center: [27.13, 95.73], population: '148K', roadCount: 36, highwayCount: 2, accessibilityScore: 65, riskScore: 68, weather: 'Heavy Showers', rainfall: 64, temperature: 23, humidity: 92, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ar-tirap', name: 'Tirap (Khonsa)', stateId: 'Arunachal Pradesh', center: [27.01, 95.53], population: '111K', roadCount: 32, highwayCount: 2, accessibilityScore: 63, riskScore: 72, weather: 'Mountain Downpour', rainfall: 70, temperature: 21, humidity: 93, windSpeed: 18, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ar-lower-subansiri', name: 'Lower Subansiri (Ziro)', stateId: 'Arunachal Pradesh', center: [27.53, 93.83], population: '83K', roadCount: 34, highwayCount: 1, accessibilityScore: 67, riskScore: 64, weather: 'Misty Rain', rainfall: 50, temperature: 18, humidity: 91, windSpeed: 14, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ar-upper-siang', name: 'Upper Siang (Yingkiong)', stateId: 'Arunachal Pradesh', center: [28.62, 94.97], population: '35K', roadCount: 28, highwayCount: 1, accessibilityScore: 52, riskScore: 88, weather: 'Torrential Rain', rainfall: 88, temperature: 17, humidity: 97, windSpeed: 20, trafficStatus: 'Severe', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 4, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ar-dibang-valley', name: 'Dibang Valley (Anini)', stateId: 'Arunachal Pradesh', center: [28.78, 95.9], population: '8K', roadCount: 22, highwayCount: 1, accessibilityScore: 45, riskScore: 92, weather: 'Heavy Mountain Rain', rainfall: 96, temperature: 14, humidity: 98, windSpeed: 22, trafficStatus: 'Severe', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 4, cargoCount: 2, terrainType: 'Hilly / Mountainous', helplineCount: 4 },
    ],
  },
  Meghalaya: {
    id: 'Meghalaya',
    name: 'Meghalaya',
    code: 'ML',
    capital: 'Shillong',
    areaSqKm: 22429,
    populationTotal: '2.97 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 12,
    center: [25.5788, 91.8933],
    zoom: 8,
    accessibility: 67,
    blocked: 5,
    atRisk: 18,
    incidents: 8,
    weatherSummary: 'Heavy orographic rainfall over southern plateau escarpment; Sonapur slope watch',
    rainfall24h: 76,
    temperatureAvg: 21,
    landslideRisk: 84,
    floodRisk: 61,
    activeCargo: 32,
    monitoredHighways: 7,
    roadSegments: 38,
    overview:
      'Abode of clouds with high global precipitation records. NH-6 (Shillong-Jowai-Silchar) and NH-106 are critical arterial life lines vulnerable to soil saturation landslides and mudflows.',
    districts: [
      { id: 'ml-east-khasi-hills', name: 'East Khasi Hills (Shillong)', stateId: 'Meghalaya', center: [25.5788, 91.8933], population: '825K', roadCount: 88, highwayCount: 4, accessibilityScore: 66, riskScore: 82, weather: 'Heavy Rainfall', rainfall: 88, temperature: 20, humidity: 95, windSpeed: 18, trafficStatus: 'Heavy', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 6, cargoCount: 18, terrainType: 'Hilly / Mountainous', helplineCount: 8 },
      { id: 'ml-ri-bhoi', name: 'Ri-Bhoi (Nongpoh)', stateId: 'Meghalaya', center: [25.903, 91.881], population: '258K', roadCount: 56, highwayCount: 3, accessibilityScore: 82, riskScore: 42, weather: 'Moderate Rain', rainfall: 45, temperature: 25, humidity: 88, windSpeed: 12, trafficStatus: 'Heavy', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 3, cargoCount: 14, terrainType: 'Foothill', helplineCount: 6 },
      { id: 'ml-west-jaintia-hills', name: 'West Jaintia Hills (Jowai)', stateId: 'Meghalaya', center: [25.45, 92.2], population: '270K', roadCount: 52, highwayCount: 2, accessibilityScore: 62, riskScore: 86, weather: 'Intense Monsoon Downpour', rainfall: 98, temperature: 19, humidity: 98, windSpeed: 20, trafficStatus: 'Severe', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 9, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'ml-west-garo-hills', name: 'West Garo Hills (Tura)', stateId: 'Meghalaya', center: [25.514, 90.22], population: '643K', roadCount: 64, highwayCount: 2, accessibilityScore: 70, riskScore: 56, weather: 'Thunderstorms', rainfall: 58, temperature: 26, humidity: 90, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 6, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'ml-east-jaintia-hills', name: 'East Jaintia Hills (Khliehriat)', stateId: 'Meghalaya', center: [25.35, 92.36], population: '122K', roadCount: 42, highwayCount: 2, accessibilityScore: 59, riskScore: 89, weather: 'Heavy Torrential Rain', rainfall: 110, temperature: 20, humidity: 99, windSpeed: 22, trafficStatus: 'Severe', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 11, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ml-west-khasi-hills', name: 'West Khasi Hills (Nongstoin)', stateId: 'Meghalaya', center: [25.52, 91.27], population: '383K', roadCount: 44, highwayCount: 2, accessibilityScore: 64, riskScore: 74, weather: 'Heavy Rain', rainfall: 74, temperature: 21, humidity: 94, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ml-south-west-khasi-hills', name: 'South West Khasi Hills (Mawkyrwat)', stateId: 'Meghalaya', center: [25.37, 91.45], population: '110K', roadCount: 36, highwayCount: 1, accessibilityScore: 60, riskScore: 80, weather: 'Heavy Showers', rainfall: 82, temperature: 21, humidity: 95, windSpeed: 18, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ml-eastern-west-khasi-hills', name: 'Eastern West Khasi Hills (Mairang)', stateId: 'Meghalaya', center: [25.57, 91.63], population: '131K', roadCount: 38, highwayCount: 2, accessibilityScore: 68, riskScore: 70, weather: 'Showers', rainfall: 60, temperature: 20, humidity: 92, windSpeed: 14, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ml-north-garo-hills', name: 'North Garo Hills (Resubelpara)', stateId: 'Meghalaya', center: [25.9, 90.58], population: '118K', roadCount: 34, highwayCount: 1, accessibilityScore: 72, riskScore: 48, weather: 'Thunderstorms', rainfall: 48, temperature: 26, humidity: 88, windSpeed: 12, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 4, terrainType: 'Foothill', helplineCount: 5 },
      { id: 'ml-east-garo-hills', name: 'East Garo Hills (Williamnagar)', stateId: 'Meghalaya', center: [25.6, 90.62], population: '145K', roadCount: 36, highwayCount: 1, accessibilityScore: 68, riskScore: 58, weather: 'Moderate Rain', rainfall: 52, temperature: 25, humidity: 89, windSpeed: 13, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ml-south-garo-hills', name: 'South Garo Hills (Baghmara)', stateId: 'Meghalaya', center: [25.2, 90.63], population: '142K', roadCount: 32, highwayCount: 1, accessibilityScore: 56, riskScore: 78, weather: 'Heavy Rain', rainfall: 76, temperature: 26, humidity: 93, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'ml-south-west-garo-hills', name: 'South West Garo Hills (Ampati)', stateId: 'Meghalaya', center: [25.43, 89.93], population: '172K', roadCount: 34, highwayCount: 1, accessibilityScore: 75, riskScore: 44, weather: 'Overcast & Rain', rainfall: 42, temperature: 27, humidity: 87, windSpeed: 12, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 4, terrainType: 'Valley / Plains', helplineCount: 5 },
    ],
  },
  Manipur: {
    id: 'Manipur',
    name: 'Manipur',
    code: 'MN',
    capital: 'Imphal',
    areaSqKm: 22327,
    populationTotal: '2.86 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 16,
    center: [24.817, 93.9368],
    zoom: 8,
    accessibility: 58,
    blocked: 8,
    atRisk: 24,
    incidents: 11,
    weatherSummary: 'Heavy precipitation with recurring slope disruption on NH-2 and NH-37',
    rainfall24h: 84,
    temperatureAvg: 23,
    landslideRisk: 81,
    floodRisk: 52,
    activeCargo: 20,
    monitoredHighways: 6,
    roadSegments: 32,
    overview:
      'Central Imphal valley surrounded by high hill ranges. Critical supply routes depend heavily on NH-2 (via Kohima) and NH-37 (via Jiribam/Silchar), where mudslides and bridge stresses frequently disrupt traffic.',
    districts: [
      { id: 'mn-imphal-west', name: 'Imphal West', stateId: 'Manipur', center: [24.817, 93.9368], population: '517K', roadCount: 78, highwayCount: 4, accessibilityScore: 78, riskScore: 38, weather: 'Showers', rainfall: 42, temperature: 25, humidity: 86, windSpeed: 10, trafficStatus: 'Heavy', incidentCount: 2, blockedRoadCount: 0, atRiskRoadCount: 3, cargoCount: 12, terrainType: 'Valley / Plains', helplineCount: 7 },
      { id: 'mn-imphal-east', name: 'Imphal East', stateId: 'Manipur', center: [24.8, 94.0], population: '456K', roadCount: 68, highwayCount: 3, accessibilityScore: 76, riskScore: 42, weather: 'Moderate Rain', rainfall: 46, temperature: 25, humidity: 87, windSpeed: 11, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 3, cargoCount: 10, terrainType: 'Valley / Plains', helplineCount: 6 },
      { id: 'mn-senapati', name: 'Senapati (Lairouching / Mao)', stateId: 'Manipur', center: [25.267, 94.017], population: '193K', roadCount: 48, highwayCount: 2, accessibilityScore: 48, riskScore: 92, weather: 'Intense Downpour', rainfall: 104, temperature: 18, humidity: 97, windSpeed: 20, trafficStatus: 'Severe', incidentCount: 4, blockedRoadCount: 3, atRiskRoadCount: 7, cargoCount: 6, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'mn-churachandpur', name: 'Churachandpur', stateId: 'Manipur', center: [24.333, 93.683], population: '274K', roadCount: 52, highwayCount: 2, accessibilityScore: 60, riskScore: 68, weather: 'Heavy Rain', rainfall: 62, temperature: 22, humidity: 91, windSpeed: 12, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 4, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'mn-jiribam', name: 'Jiribam', stateId: 'Manipur', center: [24.8, 93.12], population: '43K', roadCount: 34, highwayCount: 2, accessibilityScore: 64, riskScore: 74, weather: 'Thunderstorms', rainfall: 72, temperature: 27, humidity: 93, windSpeed: 15, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 4, cargoCount: 8, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'mn-ukhrul', name: 'Ukhrul', stateId: 'Manipur', center: [25.11, 94.36], population: '183K', roadCount: 42, highwayCount: 2, accessibilityScore: 54, riskScore: 84, weather: 'Mountain Downpour', rainfall: 86, temperature: 19, humidity: 96, windSpeed: 18, trafficStatus: 'Heavy', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mn-tamenglong', name: 'Tamenglong', stateId: 'Manipur', center: [24.98, 93.49], population: '140K', roadCount: 38, highwayCount: 1, accessibilityScore: 49, riskScore: 90, weather: 'Torrential Rain', rainfall: 98, temperature: 20, humidity: 98, windSpeed: 21, trafficStatus: 'Severe', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mn-bishnupur', name: 'Bishnupur', stateId: 'Manipur', center: [24.63, 93.76], population: '237K', roadCount: 46, highwayCount: 2, accessibilityScore: 79, riskScore: 40, weather: 'Showers', rainfall: 38, temperature: 25, humidity: 85, windSpeed: 11, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 6, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'mn-thoubal', name: 'Thoubal', stateId: 'Manipur', center: [24.64, 93.99], population: '422K', roadCount: 52, highwayCount: 2, accessibilityScore: 81, riskScore: 36, weather: 'Cloudy with Rain', rainfall: 35, temperature: 26, humidity: 84, windSpeed: 12, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 7, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'mn-chandel', name: 'Chandel', stateId: 'Manipur', center: [24.32, 94.0], population: '144K', roadCount: 36, highwayCount: 1, accessibilityScore: 58, riskScore: 76, weather: 'Heavy Showers', rainfall: 68, temperature: 22, humidity: 92, windSpeed: 15, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
    ],
  },
  Mizoram: {
    id: 'Mizoram',
    name: 'Mizoram',
    code: 'MZ',
    capital: 'Aizawl',
    areaSqKm: 21081,
    populationTotal: '1.09 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 11,
    center: [23.1645, 92.9376],
    zoom: 8,
    accessibility: 63,
    blocked: 6,
    atRisk: 19,
    incidents: 7,
    weatherSummary: 'Steep longitudinal ridge terrain prone to slope fractures along NH-306 lifeline',
    rainfall24h: 70,
    temperatureAvg: 22,
    landslideRisk: 86,
    floodRisk: 31,
    activeCargo: 16,
    monitoredHighways: 5,
    roadSegments: 28,
    overview:
      'North-south aligned mountain terrain with deep valleys. NH-306 (Silchar-Vairengte-Aizawl) is the solitary primary heavy goods corridor connecting the state with the national supply chain.',
    districts: [
      { id: 'mz-aizawl', name: 'Aizawl', stateId: 'Mizoram', center: [23.7271, 92.7176], population: '400K', roadCount: 66, highwayCount: 3, accessibilityScore: 68, riskScore: 78, weather: 'Mountain Showers', rainfall: 68, temperature: 22, humidity: 92, windSpeed: 16, trafficStatus: 'Heavy', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 4, cargoCount: 10, terrainType: 'Hilly / Mountainous', helplineCount: 7 },
      { id: 'mz-kolasib', name: 'Kolasib (Vairengte Entry)', stateId: 'Mizoram', center: [24.224, 92.678], population: '84K', roadCount: 42, highwayCount: 2, accessibilityScore: 70, riskScore: 84, weather: 'Heavy Monsoon Rain', rainfall: 84, temperature: 25, humidity: 95, windSpeed: 18, trafficStatus: 'Severe', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 12, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'mz-lunglei', name: 'Lunglei', stateId: 'Mizoram', center: [22.887, 92.744], population: '161K', roadCount: 48, highwayCount: 2, accessibilityScore: 59, riskScore: 74, weather: 'Showers & Fog', rainfall: 58, temperature: 21, humidity: 93, windSpeed: 14, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mz-champhai', name: 'Champhai (Zokhawthar Border)', stateId: 'Mizoram', center: [23.475, 93.328], population: '125K', roadCount: 40, highwayCount: 2, accessibilityScore: 61, riskScore: 68, weather: 'Misty Rain', rainfall: 52, temperature: 19, humidity: 90, windSpeed: 12, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 6, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mz-mamit', name: 'Mamit', stateId: 'Mizoram', center: [23.93, 92.49], population: '86K', roadCount: 34, highwayCount: 1, accessibilityScore: 62, riskScore: 76, weather: 'Heavy Showers', rainfall: 72, temperature: 24, humidity: 94, windSpeed: 15, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mz-serchhip', name: 'Serchhip', stateId: 'Mizoram', center: [23.34, 92.85], population: '65K', roadCount: 32, highwayCount: 1, accessibilityScore: 66, riskScore: 70, weather: 'Moderate Rain', rainfall: 54, temperature: 22, humidity: 91, windSpeed: 13, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mz-lawngtlai', name: 'Lawngtlai', stateId: 'Mizoram', center: [22.53, 92.89], population: '118K', roadCount: 30, highwayCount: 1, accessibilityScore: 54, riskScore: 82, weather: 'Heavy Rain', rainfall: 78, temperature: 23, humidity: 95, windSpeed: 17, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'mz-saiha', name: 'Siaha', stateId: 'Mizoram', center: [22.49, 92.98], population: '56K', roadCount: 28, highwayCount: 1, accessibilityScore: 52, riskScore: 80, weather: 'Overcast & Rain', rainfall: 70, temperature: 21, humidity: 94, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 2, cargoCount: 2, terrainType: 'Hilly / Mountainous', helplineCount: 4 },
    ],
  },
  Nagaland: {
    id: 'Nagaland',
    name: 'Nagaland',
    code: 'NL',
    capital: 'Kohima',
    areaSqKm: 16579,
    populationTotal: '1.98 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 16,
    center: [26.1584, 94.5624],
    zoom: 8,
    accessibility: 65,
    blocked: 5,
    atRisk: 17,
    incidents: 8,
    weatherSummary: 'Active monsoon cloud cover with slope instability around Kohima-Dimapur corridor',
    rainfall24h: 62,
    temperatureAvg: 22,
    landslideRisk: 83,
    floodRisk: 28,
    activeCargo: 24,
    monitoredHighways: 6,
    roadSegments: 30,
    overview:
      'NH-2 and NH-29 are critical high-volume corridors connecting railhead Dimapur with Kohima and Manipur. Paglapahar and Dzüdza river gorge sections face severe geological sliding hazards during heavy rains.',
    districts: [
      { id: 'nl-dimapur', name: 'Dimapur (Commercial Hub)', stateId: 'Nagaland', center: [25.9068, 93.7274], population: '379K', roadCount: 72, highwayCount: 3, accessibilityScore: 88, riskScore: 32, weather: 'Scattered Showers', rainfall: 36, temperature: 28, humidity: 82, windSpeed: 11, trafficStatus: 'Heavy', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 16, terrainType: 'Valley / Plains', helplineCount: 7 },
      { id: 'nl-kohima', name: 'Kohima (State Capital)', stateId: 'Nagaland', center: [25.6747, 94.1107], population: '270K', roadCount: 64, highwayCount: 3, accessibilityScore: 65, riskScore: 84, weather: 'Mountain Downpour', rainfall: 82, temperature: 19, humidity: 95, windSpeed: 18, trafficStatus: 'Severe', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 11, terrainType: 'Hilly / Mountainous', helplineCount: 7 },
      { id: 'nl-mokokchung', name: 'Mokokchung', stateId: 'Nagaland', center: [26.326, 94.521], population: '194K', roadCount: 52, highwayCount: 2, accessibilityScore: 72, riskScore: 58, weather: 'Showers', rainfall: 48, temperature: 21, humidity: 89, windSpeed: 14, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 6, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'nl-mon', name: 'Mon', stateId: 'Nagaland', center: [26.74, 95.06], population: '250K', roadCount: 42, highwayCount: 1, accessibilityScore: 56, riskScore: 82, weather: 'Heavy Rain', rainfall: 78, temperature: 22, humidity: 96, windSpeed: 19, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 4, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'nl-tuensang', name: 'Tuensang', stateId: 'Nagaland', center: [26.28, 94.83], population: '196K', roadCount: 40, highwayCount: 1, accessibilityScore: 54, riskScore: 85, weather: 'Dense Mountain Rain', rainfall: 85, temperature: 18, humidity: 97, windSpeed: 20, trafficStatus: 'Moderate', incidentCount: 2, blockedRoadCount: 2, atRiskRoadCount: 4, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'nl-wokha', name: 'Wokha', stateId: 'Nagaland', center: [26.1, 94.26], population: '166K', roadCount: 44, highwayCount: 2, accessibilityScore: 70, riskScore: 66, weather: 'Showers', rainfall: 54, temperature: 22, humidity: 90, windSpeed: 15, trafficStatus: 'Free', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'nl-zunheboto', name: 'Zunheboto', stateId: 'Nagaland', center: [25.97, 94.52], population: '141K', roadCount: 38, highwayCount: 1, accessibilityScore: 58, riskScore: 78, weather: 'Heavy Showers', rainfall: 68, temperature: 20, humidity: 94, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'nl-phek', name: 'Phek', stateId: 'Nagaland', center: [25.68, 94.5], population: '163K', roadCount: 40, highwayCount: 1, accessibilityScore: 57, riskScore: 80, weather: 'Mountain Rain', rainfall: 74, temperature: 19, humidity: 95, windSpeed: 17, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
    ],
  },
  Tripura: {
    id: 'Tripura',
    name: 'Tripura',
    code: 'TR',
    capital: 'Agartala',
    areaSqKm: 10486,
    populationTotal: '3.67 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 8,
    center: [23.8315, 91.2868],
    zoom: 8,
    accessibility: 82,
    blocked: 2,
    atRisk: 9,
    incidents: 4,
    weatherSummary: 'Moderate monsoon showers with low elevation river-basin waterlogging',
    rainfall24h: 38,
    temperatureAvg: 28,
    landslideRisk: 22,
    floodRisk: 58,
    activeCargo: 22,
    monitoredHighways: 4,
    roadSegments: 24,
    overview:
      'Border state bordered on three sides by Bangladesh. NH-8 (Assam-Agartala Highway) is the single arterial road link connecting Tripura with the rest of the country through Churaibari.',
    districts: [
      { id: 'tr-west-tripura', name: 'West Tripura (Agartala)', stateId: 'Tripura', center: [23.8315, 91.2868], population: '917K', roadCount: 82, highwayCount: 3, accessibilityScore: 90, riskScore: 28, weather: 'Scattered Rain', rainfall: 32, temperature: 29, humidity: 80, windSpeed: 10, trafficStatus: 'Heavy', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 14, terrainType: 'Valley / Plains', helplineCount: 7 },
      { id: 'tr-north-tripura', name: 'North Tripura (Dharmanagar)', stateId: 'Tripura', center: [24.37, 92.17], population: '417K', roadCount: 56, highwayCount: 2, accessibilityScore: 78, riskScore: 54, weather: 'Heavy Showers', rainfall: 52, temperature: 27, humidity: 88, windSpeed: 14, trafficStatus: 'Heavy', incidentCount: 2, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 8, terrainType: 'Foothill', helplineCount: 6 },
      { id: 'tr-dhalai', name: 'Dhalai (Ambassa)', stateId: 'Tripura', center: [23.92, 91.85], population: '377K', roadCount: 48, highwayCount: 2, accessibilityScore: 75, riskScore: 48, weather: 'Moderate Rain', rainfall: 42, temperature: 27, humidity: 86, windSpeed: 12, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 6, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'tr-south-tripura', name: 'South Tripura (Belonia / Sabroom)', stateId: 'Tripura', center: [23.25, 91.45], population: '433K', roadCount: 50, highwayCount: 2, accessibilityScore: 84, riskScore: 32, weather: 'Overcast & Showers', rainfall: 34, temperature: 28, humidity: 84, windSpeed: 11, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 7, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'tr-gomati', name: 'Gomati (Udaipur)', stateId: 'Tripura', center: [23.53, 91.48], population: '438K', roadCount: 52, highwayCount: 2, accessibilityScore: 86, riskScore: 30, weather: 'Light Rain', rainfall: 28, temperature: 29, humidity: 82, windSpeed: 10, trafficStatus: 'Moderate', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 5, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'tr-unakoti', name: 'Unakoti (Kailashahar)', stateId: 'Tripura', center: [24.3, 92.0], population: '277K', roadCount: 44, highwayCount: 1, accessibilityScore: 76, riskScore: 46, weather: 'Showers', rainfall: 45, temperature: 28, humidity: 87, windSpeed: 13, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 4, terrainType: 'Foothill', helplineCount: 5 },
      { id: 'tr-khowai', name: 'Khowai', stateId: 'Tripura', center: [24.06, 91.6], population: '327K', roadCount: 42, highwayCount: 1, accessibilityScore: 80, riskScore: 35, weather: 'Cloudy with Rain', rainfall: 30, temperature: 28, humidity: 83, windSpeed: 11, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 4, terrainType: 'Valley / Plains', helplineCount: 5 },
      { id: 'tr-sepahijala', name: 'Sepahijala (Bishramganj)', stateId: 'Tripura', center: [23.68, 91.33], population: '484K', roadCount: 46, highwayCount: 2, accessibilityScore: 88, riskScore: 26, weather: 'Partly Cloudy', rainfall: 24, temperature: 29, humidity: 80, windSpeed: 10, trafficStatus: 'Moderate', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 1, cargoCount: 5, terrainType: 'Valley / Plains', helplineCount: 5 },
    ],
  },
  Sikkim: {
    id: 'Sikkim',
    name: 'Sikkim',
    code: 'SK',
    capital: 'Gangtok',
    areaSqKm: 7096,
    populationTotal: '0.61 Million',
    demographicRefYear: 'Census 2011',
    demographicSource: 'Office of the Registrar General of India & MDoNER',
    districtCount: 6,
    center: [27.533, 88.5122],
    zoom: 8,
    accessibility: 60,
    blocked: 4,
    atRisk: 15,
    incidents: 6,
    weatherSummary: 'Heavy Teesta basin rainfall; high vulnerability on NH-10 corridor',
    rainfall24h: 72,
    temperatureAvg: 18,
    landslideRisk: 91,
    floodRisk: 55,
    activeCargo: 18,
    monitoredHighways: 4,
    roadSegments: 26,
    overview:
      'Himalayan state with severe topographical constraints. NH-10 along the turbulent Teesta River gorge is the critical lifeline connecting Siliguri with Gangtok, vulnerable to glacial outbursts, flash floods, and massive rockslides.',
    districts: [
      { id: 'sk-east-sikkim', name: 'East Sikkim (Gangtok)', stateId: 'Sikkim', center: [27.3389, 88.6065], population: '283K', roadCount: 60, highwayCount: 2, accessibilityScore: 62, riskScore: 85, weather: 'Heavy Mountain Rain', rainfall: 86, temperature: 17, humidity: 96, windSpeed: 18, trafficStatus: 'Severe', incidentCount: 3, blockedRoadCount: 2, atRiskRoadCount: 5, cargoCount: 10, terrainType: 'Hilly / Mountainous', helplineCount: 7 },
      { id: 'sk-north-sikkim', name: 'North Sikkim (Mangan / Chungthang)', stateId: 'Sikkim', center: [27.51, 88.53], population: '43K', roadCount: 32, highwayCount: 1, accessibilityScore: 42, riskScore: 96, weather: 'Intense Torrential Downpour', rainfall: 112, temperature: 13, humidity: 99, windSpeed: 24, trafficStatus: 'Severe', incidentCount: 3, blockedRoadCount: 3, atRiskRoadCount: 5, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 6 },
      { id: 'sk-south-sikkim', name: 'South Sikkim (Namchi)', stateId: 'Sikkim', center: [27.17, 88.35], population: '146K', roadCount: 44, highwayCount: 1, accessibilityScore: 68, riskScore: 68, weather: 'Showers & Fog', rainfall: 58, temperature: 20, humidity: 91, windSpeed: 14, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 0, atRiskRoadCount: 3, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'sk-west-sikkim', name: 'West Sikkim (Gyalshing)', stateId: 'Sikkim', center: [27.28, 88.23], population: '136K', roadCount: 40, highwayCount: 1, accessibilityScore: 64, riskScore: 76, weather: 'Heavy Showers', rainfall: 74, temperature: 18, humidity: 94, windSpeed: 16, trafficStatus: 'Moderate', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 4, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'sk-pakyong', name: 'Pakyong (Airport Sub-division)', stateId: 'Sikkim', center: [27.23, 88.58], population: '74K', roadCount: 36, highwayCount: 1, accessibilityScore: 66, riskScore: 78, weather: 'Foggy Rain', rainfall: 68, temperature: 19, humidity: 95, windSpeed: 15, trafficStatus: 'Heavy', incidentCount: 1, blockedRoadCount: 1, atRiskRoadCount: 3, cargoCount: 5, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
      { id: 'sk-soreng', name: 'Soreng', stateId: 'Sikkim', center: [27.17, 88.2], population: '65K', roadCount: 30, highwayCount: 1, accessibilityScore: 65, riskScore: 72, weather: 'Showers', rainfall: 60, temperature: 19, humidity: 92, windSpeed: 13, trafficStatus: 'Free', incidentCount: 0, blockedRoadCount: 0, atRiskRoadCount: 2, cargoCount: 3, terrainType: 'Hilly / Mountainous', helplineCount: 5 },
    ],
  },
};
