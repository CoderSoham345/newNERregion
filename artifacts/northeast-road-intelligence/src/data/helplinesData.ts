import type { StateId } from './statesAndDistricts';

export interface HelplineItem {
  id: string;
  name: string;
  category:
    | 'State Emergency (SEOC)'
    | 'District Emergency (DEOC)'
    | 'Police Control Room'
    | 'Ambulance & Medical (108/102)'
    | 'Fire & Rescue (101)'
    | 'Disaster Response (NDRF/SDRF)'
    | 'Highway Helpline (NHAI 1033)'
    | 'Border Roads Organisation (BRO)'
    | 'Traffic & Transit Helpline';
  stateId: StateId;
  districtId?: string;
  districtName?: string;
  phoneNumber: string;
  alternateNumber?: string;
  tollFreeNumber?: string;
  email?: string;
  location: string;
  description: string;
  is24x7: boolean;
  priorityOrder: number;
}

export const OFFICIAL_HELPLINES: HelplineItem[] = [
  // ================= NATIONAL / REGIONAL HELPLINES =================
  {
    id: 'hl-nhai-1033',
    name: 'NHAI National Highway Emergency Response Helpline',
    category: 'Highway Helpline (NHAI 1033)',
    stateId: 'Assam',
    phoneNumber: '1033',
    tollFreeNumber: '1033',
    location: 'National / All North East Highways',
    description: 'Toll-free 24x7 centralized highway accident, breakdown, and emergency crane dispatch service across all National Highways.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-ndrf-1st-bn',
    name: '1st Battalion NDRF Patgaon Control Room',
    category: 'Disaster Response (NDRF/SDRF)',
    stateId: 'Assam',
    phoneNumber: '+91 361 2849005',
    alternateNumber: '+91 94359 62222',
    location: 'Patgaon, Guwahati (Regional HQ for North East)',
    description: 'Specialized disaster response battalion equipped with flood rescue boats, high-altitude mountain search, and canine teams.',
    is24x7: true,
    priorityOrder: 2,
  },

  // ================= ASSAM =================
  {
    id: 'hl-as-seoc',
    name: 'Assam State Disaster Management Authority (ASDMA / SEOC)',
    category: 'State Emergency (SEOC)',
    stateId: 'Assam',
    phoneNumber: '1070',
    alternateNumber: '1079',
    tollFreeNumber: '1070 / 1079',
    email: 'sdma-assam@gov.in',
    location: 'Dispur Secretariat, Guwahati, Assam',
    description: 'Apex state emergency coordinating desk with direct integration to Central Water Commission and IMD radars.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-as-police',
    name: 'Assam Police Central Control Room (DGP HQ)',
    category: 'Police Control Room',
    stateId: 'Assam',
    phoneNumber: '112',
    alternateNumber: '+91 361 2450573',
    tollFreeNumber: '112 / 100',
    location: 'Ulubari, Guwahati, Assam',
    description: 'Unified Emergency Response Support System (ERSS 112) for all 35 Assam districts.',
    is24x7: true,
    priorityOrder: 2,
  },
  {
    id: 'hl-as-108',
    name: 'Mrityunjoy 108 Emergency Medical & Ambulance Service',
    category: 'Ambulance & Medical (108/102)',
    stateId: 'Assam',
    phoneNumber: '108',
    tollFreeNumber: '108',
    location: 'Statewide Fleet Operations Center',
    description: 'GPS-enabled critical care ambulance service covering all National Highways and district networks in Assam.',
    is24x7: true,
    priorityOrder: 3,
  },
  {
    id: 'hl-as-cachar-deoc',
    name: 'Cachar District Emergency Operation Center (DEOC Silchar)',
    category: 'District Emergency (DEOC)',
    stateId: 'Assam',
    districtId: 'as-cachar',
    districtName: 'Cachar (Silchar)',
    phoneNumber: '1077',
    alternateNumber: '+91 3842 245865',
    location: 'DC Office Compound, Silchar, Assam 788001',
    description: 'Barak Valley flood management and inter-state logistics monitoring control desk.',
    is24x7: true,
    priorityOrder: 4,
  },

  // ================= MEGHALAYA =================
  {
    id: 'hl-ml-seoc',
    name: 'Meghalaya State Disaster Management Authority (SEOC Shillong)',
    category: 'State Emergency (SEOC)',
    stateId: 'Meghalaya',
    phoneNumber: '1070',
    alternateNumber: '+91 364 2502098',
    tollFreeNumber: '1070',
    email: 'sdma-meg@gov.in',
    location: 'Secretariat Hills, Shillong, Meghalaya 793001',
    description: '24x7 state disaster operations center monitoring NH-6 landslide corridors and rainfall gauges.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-ml-bro',
    name: 'Border Roads Organisation (BRO) Project Dantak / Setuk Desk',
    category: 'Border Roads Organisation (BRO)',
    stateId: 'Meghalaya',
    phoneNumber: '+91 364 2534500',
    alternateNumber: '1033',
    location: 'HQ 44 Border Roads Task Force, East Jaintia Hills',
    description: 'Rapid clearance and heavy equipment mobilization unit for Sonapur Tunnel and NH-6 ghat sections.',
    is24x7: true,
    priorityOrder: 2,
  },
  {
    id: 'hl-ml-108',
    name: 'Meghalaya 108 Emergency Response Ambulance Service',
    category: 'Ambulance & Medical (108/102)',
    stateId: 'Meghalaya',
    phoneNumber: '108',
    tollFreeNumber: '108',
    location: 'GVK EMRI Shillong State Hub',
    description: 'High-altitude 4x4 mountain ambulances stationed at critical pass junctions across East Khasi Hills and Jaintia Hills.',
    is24x7: true,
    priorityOrder: 3,
  },
  {
    id: 'hl-ml-ejh-deoc',
    name: 'East Jaintia Hills DEOC (Khliehriat Control Room)',
    category: 'District Emergency (DEOC)',
    stateId: 'Meghalaya',
    districtId: 'ml-east-jaintia-hills',
    districtName: 'East Jaintia Hills',
    phoneNumber: '1077',
    alternateNumber: '+91 3655 230100',
    location: 'DC Office Complex, Khliehriat, Meghalaya 793200',
    description: 'Dedicated field desk coordinating Sonapur tunnel landslide traffic diversions and heavy vehicle holding areas.',
    is24x7: true,
    priorityOrder: 4,
  },

  // ================= ARUNACHAL PRADESH =================
  {
    id: 'hl-ar-seoc',
    name: 'Arunachal Pradesh State Emergency Operation Center (SEOC Itanagar)',
    category: 'State Emergency (SEOC)',
    stateId: 'Arunachal Pradesh',
    phoneNumber: '1070',
    alternateNumber: '+91 360 2212223',
    tollFreeNumber: '1070',
    location: 'Civil Secretariat, Itanagar, Arunachal Pradesh',
    description: 'Statewide mountain pass monitoring, cloudburst response, and helicopter medical evacuation liaison.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-ar-bro-vartak',
    name: 'BRO Project Vartak Control Center (West Kameng / Tawang)',
    category: 'Border Roads Organisation (BRO)',
    stateId: 'Arunachal Pradesh',
    phoneNumber: '+91 3782 222108',
    location: 'Vartak Complex, Bomdila / Tezpur',
    description: 'Responsible for Sela Pass, Sela Tunnel, Balipara-Charduar-Tawang (BCT) strategic defense highway clearance.',
    is24x7: true,
    priorityOrder: 2,
  },
  {
    id: 'hl-ar-108',
    name: 'Arunachal Emergency Ambulance Service (108 / 102)',
    category: 'Ambulance & Medical (108/102)',
    stateId: 'Arunachal Pradesh',
    phoneNumber: '108',
    tollFreeNumber: '108',
    location: 'Itanagar State Medical Dispatch Hub',
    description: 'Frontier medical emergency response fleet.',
    is24x7: true,
    priorityOrder: 3,
  },

  // ================= MANIPUR =================
  {
    id: 'hl-mn-seoc',
    name: 'Manipur State Disaster Management Authority (SEOC Imphal)',
    category: 'State Emergency (SEOC)',
    stateId: 'Manipur',
    phoneNumber: '1070',
    alternateNumber: '+91 385 2450005',
    tollFreeNumber: '1070',
    location: 'Babupara Secretariat, Imphal, Manipur 795001',
    description: 'Coordinates national highway security escorts and landslide clearing operations on NH-2 and NH-37.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-mn-traffic',
    name: 'Manipur Highway Patrol & Traffic Control Room',
    category: 'Traffic & Transit Helpline',
    stateId: 'Manipur',
    phoneNumber: '+91 385 2450100',
    alternateNumber: '112',
    location: 'Police Headquarters, Imphal',
    description: 'Real-time convoy status and clearance updates for NH-2 (Kohima route) and NH-37 (Jiribam route).',
    is24x7: true,
    priorityOrder: 2,
  },
  {
    id: 'hl-mn-108',
    name: 'Manipur 108 Critical Care Ambulance Control',
    category: 'Ambulance & Medical (108/102)',
    stateId: 'Manipur',
    phoneNumber: '108',
    tollFreeNumber: '108',
    location: 'Lamphelpat, Imphal',
    description: 'Emergency trauma transport service with RIMS and JNIMS hospital linkage.',
    is24x7: true,
    priorityOrder: 3,
  },

  // ================= MIZORAM =================
  {
    id: 'hl-mz-seoc',
    name: 'Mizoram Disaster Management & Rehabilitation (SEOC Aizawl)',
    category: 'State Emergency (SEOC)',
    stateId: 'Mizoram',
    phoneNumber: '1070',
    alternateNumber: '+91 389 2322307',
    tollFreeNumber: '1070',
    location: 'Mizoram Secretariat, MINECO, Khatla, Aizawl',
    description: 'Manages NH-306 fuel and food grain supply corridor continuity into Aizawl.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-mz-police',
    name: 'Mizoram Police Control Room (ERSS 112)',
    category: 'Police Control Room',
    stateId: 'Mizoram',
    phoneNumber: '112',
    alternateNumber: '+91 389 2334112',
    tollFreeNumber: '112',
    location: 'Aizawl Police HQ',
    description: 'Unified emergency response dispatch.',
    is24x7: true,
    priorityOrder: 2,
  },

  // ================= NAGALAND =================
  {
    id: 'hl-nl-seoc',
    name: 'Nagaland State Disaster Management Authority (NSDMA / SEOC)',
    category: 'State Emergency (SEOC)',
    stateId: 'Nagaland',
    phoneNumber: '1070',
    alternateNumber: '+91 370 2291122',
    tollFreeNumber: '1070',
    location: 'Civil Secretariat, Kohima, Nagaland 797004',
    description: 'NSDMA 24x7 operations room monitoring Pagla Pahar and NH-29 corridor.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-nl-traffic',
    name: 'Dimapur – Kohima Highway Traffic Control Desk',
    category: 'Traffic & Transit Helpline',
    stateId: 'Nagaland',
    phoneNumber: '+91 3862 225333',
    location: 'Chümoukedima Gate Checkpost',
    description: 'Manages freight truck convoy movement on NH-29.',
    is24x7: true,
    priorityOrder: 2,
  },

  // ================= TRIPURA =================
  {
    id: 'hl-tr-seoc',
    name: 'Tripura State Emergency Operation Center (SEOC Agartala)',
    category: 'State Emergency (SEOC)',
    stateId: 'Tripura',
    phoneNumber: '1070',
    alternateNumber: '+91 381 2416045',
    tollFreeNumber: '1070',
    location: 'Capital Complex, Agartala, Tripura 799010',
    description: 'Oversees inter-state logistics security on NH-8.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-tr-108',
    name: 'Tripura 108 Emergency Response Service',
    category: 'Ambulance & Medical (108/102)',
    stateId: 'Tripura',
    phoneNumber: '108',
    tollFreeNumber: '108',
    location: 'Agartala Central Ambulance Desk',
    description: '24x7 state-wide ambulance service.',
    is24x7: true,
    priorityOrder: 2,
  },

  // ================= SIKKIM =================
  {
    id: 'hl-sk-seoc',
    name: 'Sikkim State Disaster Management Authority (SSDMA / SEOC)',
    category: 'State Emergency (SEOC)',
    stateId: 'Sikkim',
    phoneNumber: '1070',
    alternateNumber: '+91 3592 201075',
    tollFreeNumber: '1070',
    location: 'Tashiling Secretariat, Gangtok, Sikkim 737101',
    description: 'Teesta valley hazard watch and mountain road emergency operations center.',
    is24x7: true,
    priorityOrder: 1,
  },
  {
    id: 'hl-sk-bro-swastik',
    name: 'BRO Project Swastik Control Room (NH-10 & North Sikkim)',
    category: 'Border Roads Organisation (BRO)',
    stateId: 'Sikkim',
    phoneNumber: '+91 3592 202203',
    alternateNumber: '1033',
    location: 'Swastik HQ, Gangtok, Sikkim',
    description: 'Heavy equipment rock-blasting, bridge restoration, and landslide clearing on NH-10 and NH-510.',
    is24x7: true,
    priorityOrder: 2,
  },
  {
    id: 'hl-sk-108',
    name: 'Sikkim 108 Emergency Medical Response Service',
    category: 'Ambulance & Medical (108/102)',
    stateId: 'Sikkim',
    phoneNumber: '108',
    tollFreeNumber: '108',
    location: 'Gangtok STNM Apex Dispatch Center',
    description: 'Mountain-specialized medical transport.',
    is24x7: true,
    priorityOrder: 3,
  },
];

export const HELPLINE_CATEGORIES = [
  'State Emergency (SEOC)',
  'District Emergency (DEOC)',
  'Police Control Room',
  'Ambulance & Medical (108/102)',
  'Fire & Rescue (101)',
  'Disaster Response (NDRF/SDRF)',
  'Highway Helpline (NHAI 1033)',
  'Border Roads Organisation (BRO)',
  'Traffic & Transit Helpline',
] as const;
