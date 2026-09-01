import type { StateId } from './statesAndDistricts';

export type IncidentType =
  | 'Landslide'
  | 'Flood'
  | 'Road Damage'
  | 'Bridge Damage'
  | 'Accident'
  | 'Traffic Block'
  | 'Rockfall'
  | 'Obstruction';

export type IncidentSeverity = 'Critical' | 'High' | 'Moderate' | 'Low';
export type IncidentStatus = 'Reported' | 'Under Review' | 'Verified' | 'Resolved';

export interface RoadIncident {
  id: string;
  title: string;
  type: IncidentType;
  stateId: StateId;
  districtId: string;
  districtName: string;
  highwayNumber: string;
  roadSegmentId: string;
  locationName: string;
  coords: [number, number];
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  reportedByRole: string;
  reportedAt: string;
  timestampMs: number;
  description: string;
  lanesAffected: 'Single lane open' | 'Both lanes blocked' | 'Shoulder only' | 'Intermittent flow';
  estimatedClearanceTime: string;
  verifiedBy?: string;
  photoUrl?: string;
  isOfflineReported?: boolean;
  syncStatus?: 'Synced' | 'Pending Sync';
}

export interface SystemAlert {
  id: string;
  title: string;
  category: 'Landslide Risk' | 'Flood Watch' | 'Road Closure' | 'Heavy Rainfall' | 'Logistics Bottleneck' | 'Emergency Advisory';
  stateId: StateId | 'All states';
  districtName?: string;
  severity: IncidentSeverity;
  timestamp: string;
  content: string;
  recommendedAction: string;
  roadSegmentId?: string;
  isRead: boolean;
  source: string;
}

export interface NerNewsItem {
  id: string;
  title: string;
  summary: string;
  stateId: StateId | 'Regional';
  category: 'Rainfall' | 'Landslide' | 'Flood' | 'Road Closure' | 'Logistics' | 'Advisory';
  source: string;
  timestamp: string;
  bulletins: string[];
  affectedHighways: string[];
  impactRating: 'High' | 'Moderate' | 'Informational';
}

export const INITIAL_INCIDENTS: RoadIncident[] = [
  {
    id: 'inc-ml-03',
    title: 'Major Mudflow & Boulder Block at Sonapur Tunnel Portal',
    type: 'Landslide',
    stateId: 'Meghalaya',
    districtId: 'ml-east-jaintia-hills',
    districtName: 'East Jaintia Hills',
    highwayNumber: 'NH-6',
    roadSegmentId: 'seg-nh6-4',
    locationName: 'NH-6 km 114 · Sonapur Tunnel Approach',
    coords: [25.176, 92.381],
    severity: 'Critical',
    status: 'Verified',
    reportedBy: 'Field Officer D. Marwein (Meghalaya PWD)',
    reportedByRole: 'State PWD Roads Engineer',
    reportedAt: 'Today · 06:15 IST',
    timestampMs: Date.now() - 1000 * 60 * 180,
    description:
      'Continuous downpour of 110mm triggered massive slope failure burying both carriageways under 3.5m of slush, shale fragments, and fallen pine timber. BRO Task Force 44 has mobilized 3 heavy hydraulic excavators.',
    lanesAffected: 'Both lanes blocked',
    estimatedClearanceTime: '4–6 hours (Expected 14:00 IST)',
    verifiedBy: 'SEOC Meghalaya / BRO Commander',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
  {
    id: 'inc-mn-01',
    title: 'Catastrophic Slope Subsidence at Lairouching Bend',
    type: 'Landslide',
    stateId: 'Manipur',
    districtId: 'mn-senapati',
    districtName: 'Senapati (Lairouching / Mao)',
    highwayNumber: 'NH-2',
    roadSegmentId: 'seg-nh2-2',
    locationName: 'NH-2 km 62 · Lairouching Hairpin',
    coords: [25.267, 94.017],
    severity: 'Critical',
    status: 'Verified',
    reportedBy: 'Inspector T. Haokip (Traffic Police)',
    reportedByRole: 'Manipur Highway Patrol In-Charge',
    reportedAt: 'Today · 05:40 IST',
    timestampMs: Date.now() - 1000 * 60 * 220,
    description:
      'Overnight cloudburst washed away 40 meters of downhill road embankment. Heavy commercial convoys queued up over 8 km. All freight directed to turn around at Kangpokpi.',
    lanesAffected: 'Both lanes blocked',
    estimatedClearanceTime: '8–12 hours (Emergency Bailey span under evaluation)',
    verifiedBy: 'State Disaster Management Authority (SDMA Manipur)',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
  {
    id: 'inc-sk-01',
    title: 'Severe Rockfall & Carriageway Fracture at 20th Mile',
    type: 'Rockfall',
    stateId: 'Sikkim',
    districtId: 'sk-east-sikkim',
    districtName: 'East Sikkim (Gangtok)',
    highwayNumber: 'NH-10',
    roadSegmentId: 'seg-nh10-2',
    locationName: 'NH-10 · 20th Mile Teesta Gorge',
    coords: [27.27, 88.6],
    severity: 'Critical',
    status: 'Verified',
    reportedBy: 'Project Swastik BRO Duty Officer',
    reportedByRole: 'Border Roads Organisation Engineer',
    reportedAt: 'Today · 07:10 IST',
    timestampMs: Date.now() - 1000 * 60 * 120,
    description:
      'Multi-ton granite boulders dislodged from 200m vertical cliff face following saturation. Surface asphalt shattered. Dozers actively blasting obstruction.',
    lanesAffected: 'Both lanes blocked',
    estimatedClearanceTime: '5 hours (Est. 13:30 IST)',
    verifiedBy: 'District Collector, East Sikkim',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
  {
    id: 'inc-ml-01',
    title: 'Active Slope Movement & Single-Lane Escort near Wahjajer',
    type: 'Landslide',
    stateId: 'Meghalaya',
    districtId: 'ml-west-jaintia-hills',
    districtName: 'West Jaintia Hills',
    highwayNumber: 'NH-6',
    roadSegmentId: 'seg-nh6-3',
    locationName: 'NH-6 · Wahjajer Ridge',
    coords: [25.512, 92.124],
    severity: 'High',
    status: 'Verified',
    reportedBy: 'Jowai Traffic Control Cell',
    reportedByRole: 'District Police Officer',
    reportedAt: 'Today · 07:45 IST',
    timestampMs: Date.now() - 1000 * 60 * 90,
    description:
      'Soil creep pushing mud onto outer lane. Police operating single-lane alternating convoy in 15-minute batches.',
    lanesAffected: 'Single lane open',
    estimatedClearanceTime: '2 hours',
    verifiedBy: 'DEOC Jowai',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
  {
    id: 'inc-as-02',
    title: 'Barak River Inundation & Culvert Overflow',
    type: 'Flood',
    stateId: 'Assam',
    districtId: 'as-cachar',
    districtName: 'Cachar (Silchar)',
    highwayNumber: 'NH-6',
    roadSegmentId: 'seg-nh6-5',
    locationName: 'Silchar Outer Bypass Approach',
    coords: [24.962, 92.594],
    severity: 'High',
    status: 'Verified',
    reportedBy: 'Cachar Water Resources Field Cell',
    reportedByRole: 'Hydrological Observer',
    reportedAt: 'Today · 06:50 IST',
    timestampMs: Date.now() - 1000 * 60 * 140,
    description:
      'Barak river water flowing 8–10 inches above road crown for 300 meters. Heavy trucks passing with caution; small cars halted.',
    lanesAffected: 'Single lane open',
    estimatedClearanceTime: 'Depends on river hydrograph recession (est. 4h)',
    verifiedBy: 'DDMA Cachar',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
  {
    id: 'inc-nl-01',
    title: 'Pagla Pahar Subsidence & Retaining Wall Deformation',
    type: 'Road Damage',
    stateId: 'Nagaland',
    districtId: 'nl-kohima',
    districtName: 'Kohima',
    highwayNumber: 'NH-29',
    roadSegmentId: 'seg-nh29-2',
    locationName: 'NH-29 km 28 · Chathe River Cutting',
    coords: [25.73, 93.96],
    severity: 'Moderate',
    status: 'Under Review',
    reportedBy: 'NHIDCL Project Unit Dimapur',
    reportedByRole: 'Infrastructure Monitoring Team',
    reportedAt: 'Today · 08:00 IST',
    timestampMs: Date.now() - 1000 * 60 * 45,
    description:
      'Crack length of 18 meters observed on valley-side paved shoulder. Heavy vehicles instructed to drive on mountain-side lane.',
    lanesAffected: 'Single lane open',
    estimatedClearanceTime: 'Controlled traffic operation active',
    verifiedBy: 'Nagaland PWD (NH)',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
  {
    id: 'inc-ar-01',
    title: 'Hillside Gravel Spillage near Chimpu Cutting',
    type: 'Obstruction',
    stateId: 'Arunachal Pradesh',
    districtId: 'ar-papum-pare',
    districtName: 'Papum Pare (Itanagar)',
    highwayNumber: 'NH-415',
    roadSegmentId: 'seg-nh415-1',
    locationName: 'NH-415 km 18 · Chimpu Bypass',
    coords: [27.034, 93.642],
    severity: 'Moderate',
    status: 'Verified',
    reportedBy: 'Capital Complex Traffic Unit',
    reportedByRole: 'Itanagar Traffic Cell',
    reportedAt: 'Today · 08:15 IST',
    timestampMs: Date.now() - 1000 * 60 * 30,
    description:
      'Wet weather loosening shale deposits. JCB on-site clearing inner lane.',
    lanesAffected: 'Single lane open',
    estimatedClearanceTime: '45 minutes',
    verifiedBy: 'Arunachal PWD Highway Cell',
    isOfflineReported: false,
    syncStatus: 'Synced',
  },
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-01',
    title: 'CRITICAL: NH-6 Sonapur Tunnel Corridor Blocked',
    category: 'Road Closure',
    stateId: 'Meghalaya',
    districtName: 'East Jaintia Hills',
    severity: 'Critical',
    timestamp: '08:20 IST',
    content:
      'Massive mudflow and debris block on NH-6 at Sonapur Tunnel approach. Silchar, Tripura and Mizoram-bound inter-state freight transit is halted.',
    recommendedAction:
      'Halt heavy vehicles at Khliehriat and Silchar holding yards. Emergency medical cargo should coordinate via SEOC Meghalaya.',
    roadSegmentId: 'seg-nh6-4',
    isRead: false,
    source: 'BRO 44 BRTF / Meghalaya SEOC',
  },
  {
    id: 'alt-02',
    title: 'CRITICAL: NH-2 Lairouching Debris Slide in Manipur',
    category: 'Road Closure',
    stateId: 'Manipur',
    districtName: 'Senapati',
    severity: 'Critical',
    timestamp: '08:00 IST',
    content:
      'NH-2 completely impassable between Senapati and Mao Gate following cloudburst slope failure. 40m carriageway affected.',
    recommendedAction:
      'Divert Imphal-bound traffic to NH-37 via Silchar/Jiribam corridor. Await SDMA clearance bulletin.',
    roadSegmentId: 'seg-nh2-2',
    isRead: false,
    source: 'SDMA Manipur / Highway Police',
  },
  {
    id: 'alt-03',
    title: 'RED ALERT: Heavy Orographic Rainfall in Southern Meghalaya & Sikkim',
    category: 'Heavy Rainfall',
    stateId: 'All states',
    severity: 'Critical',
    timestamp: '07:30 IST',
    content:
      'IMD issues Red Warning for East Khasi Hills, Jaintia Hills, and North Sikkim. 24h rainfall totals exceeded 100mm with saturated soil horizons.',
    recommendedAction:
      'Enforce night travel restrictions on ghat sections. Keep disaster response cranes and medical ambulances on standby.',
    isRead: false,
    source: 'India Meteorological Department (IMD Guwahati & Gangtok)',
  },
  {
    id: 'alt-04',
    title: 'LOGISTICS DELAY: Essential Medical Cargo MED-204 At Risk',
    category: 'Logistics Bottleneck',
    stateId: 'Meghalaya',
    districtName: 'East Khasi Hills',
    severity: 'High',
    timestamp: '08:35 IST',
    content:
      'Cold-chain insulin van VEH-NE-204 delayed by 1h 45m on NH-6 Mawryngkneng. Temperature safety buffer is 4 hours remaining.',
    recommendedAction:
      'Approve recommended AI Route via NH-106 Nongstoin connector to ensure delivery before cold-chain breach.',
    roadSegmentId: 'seg-nh6-3',
    isRead: false,
    source: 'UTTARPURV AI Logistics Sentinel',
  },
  {
    id: 'alt-05',
    title: 'FLOOD WATCH: Brahmaputra & Barak River Basin Levels Rising',
    category: 'Flood Watch',
    stateId: 'Assam',
    districtName: 'Cachar / Kamrup',
    severity: 'High',
    timestamp: '06:45 IST',
    content:
      'Barak river at Annapurna Ghat flowing 0.42m above danger level. Low-lying highway culverts on NH-6 approaches experiencing backflow.',
    recommendedAction:
      'Speed limit restricted to 20 km/h across flooded stretches. Heavy axle trucks to maintain 100m inter-vehicle distance.',
    roadSegmentId: 'seg-nh6-5',
    isRead: true,
    source: 'Central Water Commission (CWC Silchar)',
  },
  {
    id: 'alt-06',
    title: 'SIKKIM NH-10: Rockfall Hazard Zone Alert at 20th Mile',
    category: 'Landslide Risk',
    stateId: 'Sikkim',
    districtName: 'East Sikkim',
    severity: 'Critical',
    timestamp: '08:05 IST',
    content:
      'Teesta corridor cut off. BRO Project Swastik clearing shattered boulders. All tourist and commercial movement restricted at Rangpo.',
    recommendedAction:
      'Utilize Lava – Gorubathan detour for light motor vehicles only.',
    roadSegmentId: 'seg-nh10-2',
    isRead: true,
    source: 'Project Swastik / East Sikkim Administration',
  },
];

export const NER_SITUATION_NEWS: NerNewsItem[] = [
  {
    id: 'news-01',
    title: 'Monsoon Front Intensifies Across Meghalaya Escarpment & Barak Valley',
    summary:
      'Continuous south-westerly monsoon winds delivering torrential precipitation across East Khasi Hills, Jaintia Hills, and Cachar basin. Soil moisture saturation reached 98% in Southern Meghalaya.',
    stateId: 'Meghalaya',
    category: 'Rainfall',
    source: 'IMD Regional Meteorological Center Guwahati',
    timestamp: '25 mins ago',
    bulletins: [
      'Mawsynram & Cherrapunjee recorded 124mm rainfall in the last 24 hours.',
      'Sonapur tunnel slope stability sensor readings show critical shear displacement.',
      'BRO 44 Task Force deploying heavy dozers and tipper convoys.',
    ],
    affectedHighways: ['NH-6', 'NH-106', 'SH-5'],
    impactRating: 'High',
  },
  {
    id: 'news-02',
    title: 'Manipur Lifeline Restoration: Emergency Bailey Span Evaluated for NH-2',
    summary:
      'Following early morning debris slide at Lairouching, Highway Administration and BRO teams are on-site evaluating rapid Bailey bridge installation to bypass fractured road foundation.',
    stateId: 'Manipur',
    category: 'Road Closure',
    source: 'Manipur State Disaster Management Authority (SDMA)',
    timestamp: '1 hour ago',
    bulletins: [
      'NH-2 closed between Kangpokpi and Mao Gate.',
      'Essential supplies rerouted via NH-37 Jiribam-Silchar highway corridor.',
      'Police control rooms operational in Imphal, Senapati, and Kangpokpi.',
    ],
    affectedHighways: ['NH-2', 'NH-37'],
    impactRating: 'High',
  },
  {
    id: 'news-03',
    title: 'Sikkim Teesta Valley Alert: NH-10 Rock Blasting Underway at 20th Mile',
    summary:
      'Project Swastik engineers are executing controlled rock fragmenting on NH-10 after boulders dislodged onto both lanes. Single-lane emergency corridor targeted for 14:00 IST opening.',
    stateId: 'Sikkim',
    category: 'Landslide',
    source: 'Border Roads Organisation (Swastik Project)',
    timestamp: '1.5 hours ago',
    bulletins: [
      'Oxygen supply convoys prioritizing Rangpo staging depot.',
      'Light vehicles diverted through Rhenock – Pakyong hill road.',
      'District Administration advises travelers to check UTTARPURV AI portal before departure.',
    ],
    affectedHighways: ['NH-10', 'NH-510'],
    impactRating: 'High',
  },
  {
    id: 'news-04',
    title: 'Assam Brahmaputra Corridor: 4-Lane NH-27 Fully Open with High Transit Flow',
    summary:
      'Despite scattered valley showers, East-West corridor NH-27 (Guwahati – Nagaon – Jorhat) remains completely operational with average vehicle speeds of 58 km/h.',
    stateId: 'Assam',
    category: 'Logistics',
    source: 'NHAI Regional Office Guwahati',
    timestamp: '2 hours ago',
    bulletins: [
      'Automated tolling at Raha and Patgaon operating smoothly.',
      'Kaliabhomora Bridge at Tezpur monitored for wind gusts; heavy trucks moving normally.',
      'Inter-modal cargo hub at Amingaon clearing all inbound rail containers.',
    ],
    affectedHighways: ['NH-27', 'NH-37'],
    impactRating: 'Informational',
  },
  {
    id: 'news-05',
    title: 'Tripura NH-8 Spine Stable; Buffer Warehouses Re-stocking Ahead of Schedule',
    summary:
      'FCI food grain convoys and POL tankers from Assam border reaching Agartala buffer depots without interruption as dry weather prevails across western plains.',
    stateId: 'Tripura',
    category: 'Logistics',
    source: 'Food & Civil Supplies Dept, Govt of Tripura',
    timestamp: '3 hours ago',
    bulletins: [
      'Dharmanagar and Ambassa transit checkposts clear.',
      'No waterlogging or slope incidents reported on NH-8.',
    ],
    affectedHighways: ['NH-8'],
    impactRating: 'Informational',
  },
];
