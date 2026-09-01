import { type StateId } from './statesAndDistricts';

export type ReportCategory =
  | 'Broken Road'
  | 'Landslide'
  | 'Flood'
  | 'Road Blocked'
  | 'Traffic Problem'
  | 'Heavy Rain'
  | 'Bridge Problem'
  | 'Other';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'Action in Progress'
  | 'Resolved';

export interface TimelineEvent {
  status: ReportStatus;
  timestamp: string;
  actor: string;
  department?: string;
  note: string;
}

export interface CitizenReport {
  id: string; // e.g. "NER-000123"
  trackingNumber: string;
  userId?: string;
  userName: string;
  userPhone?: string;
  stateId: StateId;
  districtId: string;
  locationName: string;
  coords: [number, number]; // [lat, lng]
  category: ReportCategory;
  description: string;
  photoUrl?: string;
  voiceUrl?: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  status: ReportStatus;
  assignedDepartment?: string;
  assignedOfficial?: string;
  createdAt: string;
  createdTimestamp: number;
  updatedAt: string;
  resolvedAt?: string;
  isEscalated: boolean;
  escalationReason?: string;
  timeline: TimelineEvent[];
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type:
    | 'hospital'
    | 'police'
    | 'fire_station'
    | 'ambulance'
    | 'shelter'
    | 'fuel'
    | 'government_office'
    | 'relief_center'
    | 'bro_base';
  stateId: StateId;
  districtId: string;
  address: string;
  coords: [number, number];
  phone: string;
  status: string; // e.g. "24x7 Open", "Trauma Care Ready", "12 Boats Ready"
  capacityDetails?: string;
}

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'rep-001',
    trackingNumber: 'NER-000123',
    userName: 'Ratan Borah',
    userPhone: '+91 94350 XXXXX',
    stateId: 'Assam',
    districtId: 'as-dima-hasao',
    locationName: 'Jatinga Valley Km 42, NH-27',
    coords: [25.132, 92.981],
    category: 'Landslide',
    description: 'Fresh boulder collapse and mudflow blocking downhill lane towards Silchar. Approx 200m stretch affected.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60',
    severity: 'Critical',
    status: 'Assigned',
    assignedDepartment: 'Border Roads Organisation (BRO Task Force 44)',
    assignedOfficial: 'Capt. A. Sengupta (BRO)',
    createdAt: '2026-08-29T06:15:00Z',
    createdTimestamp: Date.now() - 6 * 3600 * 1000,
    updatedAt: '2026-08-29T07:30:00Z',
    isEscalated: true,
    escalationReason: 'Road blocked > 6 hours on vital national corridor NH-27 with over 40 stranded freight trucks.',
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-08-29 06:15 IST',
        actor: 'Citizen (Ratan Borah)',
        note: 'Report registered via UTTARPURV AI Citizen App with GPS coordinates.',
      },
      {
        status: 'Under Review',
        timestamp: '2026-08-29 06:40 IST',
        actor: 'Dima Hasao DEOC Desk',
        note: 'Field footage verified. Heavy earthmover requirement identified.',
      },
      {
        status: 'Assigned',
        timestamp: '2026-08-29 07:30 IST',
        actor: 'District Magistrate Office',
        department: 'Border Roads Organisation (BRO Task Force 44)',
        note: 'BRO Unit dispatched from Haflong base with 2 dozers and 4 tippers.',
      },
    ],
  },
  {
    id: 'rep-002',
    trackingNumber: 'NER-000124',
    userName: 'Lalramzauva',
    userPhone: '+91 98620 XXXXX',
    stateId: 'Mizoram',
    districtId: 'mz-aizawl',
    locationName: 'Sairang Ghat NH-54',
    coords: [23.805, 92.658],
    category: 'Bridge Problem',
    description: 'Minor abutment erosion noticed on Tlawng river approach bridge. Light vehicles passing slowly.',
    severity: 'Moderate',
    status: 'Under Review',
    assignedDepartment: 'Mizoram PWD Roads & Bridges',
    createdAt: '2026-08-29T07:45:00Z',
    createdTimestamp: Date.now() - 3 * 3600 * 1000,
    updatedAt: '2026-08-29T08:10:00Z',
    isEscalated: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-08-29 07:45 IST',
        actor: 'Citizen (Lalramzauva)',
        note: 'Report received with photos showing water scour near pillar base.',
      },
      {
        status: 'Under Review',
        timestamp: '2026-08-29 08:10 IST',
        actor: 'Aizawl District Emergency Cell',
        note: 'Structural safety team alerted for morning site inspection.',
      },
    ],
  },
  {
    id: 'rep-003',
    trackingNumber: 'NER-000125',
    userName: 'Tenzing Lepcha',
    userPhone: '+91 97330 XXXXX',
    stateId: 'Sikkim',
    districtId: 'sk-mangan',
    locationName: 'Chungthang Road Km 18',
    coords: [27.604, 88.647],
    category: 'Flood',
    description: 'Teesta tributary overflowed onto low bridge near bridge culvert. Water receded by 1 foot.',
    severity: 'High',
    status: 'Action in Progress',
    assignedDepartment: 'Sikkim SDMA & BRO Swastik Project',
    assignedOfficial: 'Er. P. Bhutia',
    createdAt: '2026-08-29T05:00:00Z',
    createdTimestamp: Date.now() - 8 * 3600 * 1000,
    updatedAt: '2026-08-29T08:30:00Z',
    isEscalated: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-08-29 05:00 IST',
        actor: 'Citizen (Tenzing Lepcha)',
        note: 'Initial waterlogging alert submitted.',
      },
      {
        status: 'Under Review',
        timestamp: '2026-08-29 05:25 IST',
        actor: 'Mangan DEOC Desk',
        note: 'Teesta river hydro-monitoring correlation confirmed.',
      },
      {
        status: 'Assigned',
        timestamp: '2026-08-29 06:10 IST',
        actor: 'Sikkim SSDMA Command',
        department: 'BRO Swastik Project',
        note: 'Culvert desilting team deployed.',
      },
      {
        status: 'Action in Progress',
        timestamp: '2026-08-29 08:30 IST',
        actor: 'BRO Project Swastik Site In-charge',
        note: 'Excavators actively clearing debris channel. Single-lane movement resumed.',
      },
    ],
  },
  {
    id: 'rep-004',
    trackingNumber: 'NER-000126',
    userName: 'Kalyan Das',
    userPhone: '+91 94360 XXXXX',
    stateId: 'Tripura',
    districtId: 'tr-north-tripura',
    locationName: 'Churaibari Border Gate NH-8',
    coords: [24.478, 92.245],
    category: 'Road Blocked',
    description: 'Fallen banyan tree removed by local fire unit. Highway completely clear now.',
    severity: 'Low',
    status: 'Resolved',
    assignedDepartment: 'Tripura Fire & Emergency Services',
    createdAt: '2026-08-28T18:00:00Z',
    createdTimestamp: Date.now() - 18 * 3600 * 1000,
    updatedAt: '2026-08-28T19:40:00Z',
    resolvedAt: '2026-08-28T19:40:00Z',
    isEscalated: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-08-28 18:00 IST',
        actor: 'Citizen (Kalyan Das)',
        note: 'Tree fall obstruction reported on border entry point.',
      },
      {
        status: 'Assigned',
        timestamp: '2026-08-28 18:15 IST',
        actor: 'Dharmanagar Control Room',
        department: 'Tripura Fire & Emergency Services',
        note: 'Fire crew with chainsaw dispatched.',
      },
      {
        status: 'Resolved',
        timestamp: '2026-08-28 19:40 IST',
        actor: 'Officer in Charge (Fire)',
        note: 'Tree cleared and logs shifted to shoulder. Normal traffic restored.',
      },
    ],
  },
];

export const EMERGENCY_FACILITIES: EmergencyFacility[] = [
  // Assam
  {
    id: 'fac-gmch',
    name: 'Gauhati Medical College & Hospital (GMCH)',
    type: 'hospital',
    stateId: 'Assam',
    districtId: 'as-kamrup-metro',
    address: 'Bhangagarh, Guwahati, Assam 781032',
    coords: [26.158, 91.774],
    phone: '+91 361 2529457 / 108',
    status: '24x7 Open (Apex Level 1 Trauma & 60 ICU Beds)',
  },
  {
    id: 'fac-smch',
    name: 'Silchar Medical College & Hospital (SMCH)',
    type: 'hospital',
    stateId: 'Assam',
    districtId: 'as-cachar',
    address: 'Ghungoor, Silchar, Assam 788014',
    coords: [24.786, 92.793],
    phone: '+91 3842 240014 / 108',
    status: '24x7 Open (Barak Valley Regional Hub)',
  },
  {
    id: 'fac-ndrf-rani',
    name: 'NDRF 1st Battalion Disaster Base',
    type: 'relief_center',
    stateId: 'Assam',
    districtId: 'as-kamrup-metro',
    address: 'Patgaon, Rani Gate, Guwahati 781017',
    coords: [26.113, 91.603],
    phone: '1078 / +91 361 2840284',
    status: '12 Quick-Response Teams on 15-min Standby (Rescue Boats Ready)',
  },
  {
    id: 'fac-dispur-pol',
    name: 'Dispur Police Station & Control Desk',
    type: 'police',
    stateId: 'Assam',
    districtId: 'as-kamrup-metro',
    address: 'GS Road, Dispur, Guwahati 781006',
    coords: [26.142, 91.789],
    phone: '112 / +91 361 2261510',
    status: '24x7 Police Patrol & Highway Quick Response',
  },
  {
    id: 'fac-fuel-khanapara',
    name: 'IOCL Khanapara Highway Fuel & EV Hub',
    type: 'fuel',
    stateId: 'Assam',
    districtId: 'as-kamrup-metro',
    address: 'GS Road, Khanapara Border, Guwahati 781022',
    coords: [26.118, 91.821],
    phone: '+91 361 2360144',
    status: '24x7 Diesel, Petrol, Oxygen Cylinders & Rest Stop',
  },

  // Meghalaya
  {
    id: 'fac-neigrihms',
    name: 'NEIGRIHMS Super Speciality Regional Hospital',
    type: 'hospital',
    stateId: 'Meghalaya',
    districtId: 'ml-east-khasi-hills',
    address: 'Mawdiangdiang, Shillong, Meghalaya 793018',
    coords: [25.602, 91.936],
    phone: '+91 364 2538025 / 108',
    status: '24x7 Open (Regional Apex Trauma Facility & Heli-pad)',
  },
  {
    id: 'fac-bro-sonapur',
    name: 'BRO 44 BRTF Highway Rescue Staging Base',
    type: 'bro_base',
    stateId: 'Meghalaya',
    districtId: 'ml-east-jaintia-hills',
    address: 'NH-6 Sonapur Tunnel Milestone 114, Meghalaya',
    coords: [25.18, 92.36],
    phone: '1033 / +91 3655 230100',
    status: '4 Heavy Bulldozers, 6 Tippers Deployed on NH-6',
  },
  {
    id: 'fac-shillong-pol',
    name: 'Sadar Police Station & Police Control Room',
    type: 'police',
    stateId: 'Meghalaya',
    districtId: 'ml-east-khasi-hills',
    address: 'Police Bazar, Shillong 793001',
    coords: [25.579, 91.882],
    phone: '112 / +91 364 2222214',
    status: '24x7 Hill Patrol & Traffic Operations',
  },
  {
    id: 'fac-fire-shillong',
    name: 'Meghalaya Fire & Emergency Headquarters',
    type: 'fire_station',
    stateId: 'Meghalaya',
    districtId: 'ml-east-khasi-hills',
    address: 'Barik Point, Shillong 793001',
    coords: [25.568, 91.88],
    phone: '101 / +91 364 2224444',
    status: '24x7 Heavy Rescue Tenders & High-Altitude Foam Vehicles',
  },

  // Arunachal Pradesh
  {
    id: 'fac-trihms',
    name: 'TRIHMS State Medical College & Hospital',
    type: 'hospital',
    stateId: 'Arunachal Pradesh',
    districtId: 'ar-papum-pare',
    address: 'Naharlagun, Papum Pare 791110',
    coords: [27.106, 93.693],
    phone: '+91 360 2244244 / 108',
    status: '24x7 Open (Arunachal Apex Trauma Unit)',
  },
  {
    id: 'fac-ar-seoc',
    name: 'Arunachal SDMA Disaster Response Control',
    type: 'government_office',
    stateId: 'Arunachal Pradesh',
    districtId: 'ar-papum-pare',
    address: 'Civil Secretariat, Itanagar 791111',
    coords: [27.097, 93.615],
    phone: '1070 / +91 360 2212222',
    status: '24x7 Landslide & Flash-Flood Emergency Desk',
  },

  // Manipur
  {
    id: 'fac-rims',
    name: 'Regional Institute of Medical Sciences (RIMS)',
    type: 'hospital',
    stateId: 'Manipur',
    districtId: 'mn-imphal-west',
    address: 'Lamphelpat, Imphal, Manipur 795004',
    coords: [24.821, 93.918],
    phone: '+91 385 2414625 / 108',
    status: '24x7 Open (Multi-speciality Trauma & Blood Bank)',
  },
  {
    id: 'fac-imphal-pol',
    name: 'Imphal West Police Headquarters',
    type: 'police',
    stateId: 'Manipur',
    districtId: 'mn-imphal-west',
    address: 'Babupara, Imphal 795001',
    coords: [24.802, 93.937],
    phone: '112 / +91 385 2450000',
    status: '24x7 Highway Security Convoy Escort Base',
  },

  // Mizoram
  {
    id: 'fac-zmc',
    name: 'Zoram Medical College (ZMC) & Hospital',
    type: 'hospital',
    stateId: 'Mizoram',
    districtId: 'mz-aizawl',
    address: 'Falkawn, Aizawl, Mizoram 796005',
    coords: [23.637, 92.709],
    phone: '+91 389 2372002 / 108',
    status: '24x7 Open (State Apex Referral Hospital)',
  },
  {
    id: 'fac-aizawl-deoc',
    name: 'Aizawl District Emergency Operations Center',
    type: 'government_office',
    stateId: 'Mizoram',
    districtId: 'mz-aizawl',
    address: 'DC Office Complex, Aizawl 796001',
    coords: [23.727, 92.717],
    phone: '1077 / +91 389 2322318',
    status: '24x7 Rapid Earthmover Coordination Base',
  },

  // Nagaland
  {
    id: 'fac-nhak',
    name: 'Naga Hospital Authority Kohima (NHAK)',
    type: 'hospital',
    stateId: 'Nagaland',
    districtId: 'nl-kohima',
    address: 'Hospital Colony, Kohima, Nagaland 797001',
    coords: [25.67, 94.108],
    phone: '+91 370 2222916 / 108',
    status: '24x7 Open (Trauma & Emergency Casualty)',
  },
  {
    id: 'fac-kohima-pol',
    name: 'Kohima District Police Control Room',
    type: 'police',
    stateId: 'Nagaland',
    districtId: 'nl-kohima',
    address: 'PR Hill, Kohima 797001',
    coords: [25.662, 94.102],
    phone: '112 / +91 370 2244279',
    status: '24x7 Road Safety & Traffic Management',
  },

  // Tripura
  {
    id: 'fac-gbp-agartala',
    name: 'AGMC & GBP Hospital Agartala',
    type: 'hospital',
    stateId: 'Tripura',
    districtId: 'tr-west-tripura',
    address: 'Kunjaban, Agartala, Tripura 799006',
    coords: [23.856, 91.291],
    phone: '+91 381 2356701 / 108',
    status: '24x7 Level 1 Trauma Facility & Burn Unit',
  },
  {
    id: 'fac-tr-seoc',
    name: 'Tripura Disaster Control Room',
    type: 'government_office',
    stateId: 'Tripura',
    districtId: 'tr-west-tripura',
    address: 'Capital Complex, Agartala 799010',
    coords: [23.831, 91.286],
    phone: '1070 / +91 381 2415385',
    status: '24x7 Cyclone, Flood & Highway Disaster Monitoring',
  },

  // Sikkim
  {
    id: 'fac-stnm',
    name: 'STNM Multispeciality Hospital Gangtok',
    type: 'hospital',
    stateId: 'Sikkim',
    districtId: 'sk-east-sikkim',
    address: 'Sochagang, Sichey, Gangtok 737101',
    coords: [27.324, 88.614],
    phone: '+91 3592 201172 / 108',
    status: '24x7 Open (Apex Hospital with High-Altitude Medicine Unit)',
  },
  {
    id: 'fac-sk-ssdma',
    name: 'Sikkim State Disaster Management Authority',
    type: 'government_office',
    stateId: 'Sikkim',
    districtId: 'sk-east-sikkim',
    address: 'Tashiling Secretariat, Gangtok 737103',
    coords: [27.332, 88.613],
    phone: '1070 / 1077 / +91 3592 201075',
    status: '24x7 Glacial Lake & NH-10 Teesta Corridor Early Warning',
  },
];
