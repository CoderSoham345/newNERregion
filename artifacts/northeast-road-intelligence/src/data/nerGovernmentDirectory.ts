import type { StateId } from './statesAndDistricts';

export interface StateOfficialDirectory {
  stateId: StateId;
  stateName: string;
  capital: string;
  portalUrl: string;
  portalName: string;
  emblemAlt: string;
  seocContact: {
    name: string;
    tollFree: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    lastVerified: string;
  };
  policeContact: {
    name: string;
    emergencyNumber: string;
    controlRoom: string;
    website: string;
    address: string;
    lastVerified: string;
  };
  medicalContact: {
    serviceName: string;
    ambulanceNumber: string;
    directLine: string;
    website: string;
    lastVerified: string;
  };
  fireContact: {
    serviceName: string;
    emergencyNumber: string;
    controlRoom: string;
    website: string;
    lastVerified: string;
  };
  pwdRoadAuthority: {
    departmentName: string;
    website: string;
    helpline?: string;
    description: string;
    lastVerified: string;
  };
  broProjectDesk?: {
    projectName: string;
    headquarters: string;
    highwayHelpline: string;
    lastVerified: string;
  };
  additionalPortals: Array<{
    name: string;
    category: string;
    url: string;
    domain: string;
  }>;
}

export const NER_GOVERNMENT_DIRECTORY: Record<StateId, StateOfficialDirectory> = {
  Assam: {
    stateId: 'Assam',
    stateName: 'Assam',
    capital: 'Dispur / Guwahati',
    portalUrl: 'https://assam.gov.in',
    portalName: 'Government of Assam Official Portal',
    emblemAlt: 'Government of Assam',
    seocContact: {
      name: 'Assam State Disaster Management Authority (ASDMA)',
      tollFree: '1070 / 1079',
      phone: '+91 361 2237221',
      email: 'sdma-assam@gov.in',
      website: 'https://sdma.assam.gov.in',
      address: 'Assam Secretariat Complex, Dispur, Guwahati 781006',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Assam Police State Headquarters',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 361 2450573',
      website: 'https://assampolice.gov.in',
      address: 'Assam Police Headquarters, Ulubari, Guwahati 781007',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Mrityunjoy 108 Emergency Medical Response Service',
      ambulanceNumber: '108',
      directLine: '+91 361 2849000',
      website: 'https://nhm.assam.gov.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Assam Fire & Emergency Services',
      emergencyNumber: '101',
      controlRoom: '+91 361 2540222',
      website: 'https://fireandemergencyservices.assam.gov.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Assam Public Works Roads Department (PWRD)',
      website: 'https://pwdroads.assam.gov.in',
      helpline: '1033',
      description: 'Nodal authority for state highways, major district roads, and Brahmaputra river crossing connectivity.',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'Border Roads Organisation (BRO) Eastern HQ',
      headquarters: 'Patgaon / Guwahati Base',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'National Health Mission Assam', category: 'Health & Trauma', url: 'https://nhm.assam.gov.in', domain: 'nhm.assam.gov.in' },
      { name: 'Transport Department Assam', category: 'Transport & VAHAN', url: 'https://transport.assam.gov.in', domain: 'transport.assam.gov.in' },
      { name: 'Water Resources Department (CWC Floods)', category: 'Flood Monitoring', url: 'https://waterresources.assam.gov.in', domain: 'waterresources.assam.gov.in' },
    ],
  },

  'Arunachal Pradesh': {
    stateId: 'Arunachal Pradesh',
    stateName: 'Arunachal Pradesh',
    capital: 'Itanagar',
    portalUrl: 'https://arunachalpradesh.gov.in',
    portalName: 'Government of Arunachal Pradesh',
    emblemAlt: 'Government of Arunachal Pradesh',
    seocContact: {
      name: 'Arunachal Pradesh State Disaster Management Authority (APSDMA)',
      tollFree: '1070',
      phone: '+91 360 2212223',
      email: 'secydm-arn@nic.in',
      website: 'https://disastermanagement.arunachal.gov.in',
      address: 'Civil Secretariat, Itanagar, Arunachal Pradesh 791111',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Arunachal Pradesh Police Central Control Room',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 360 2212233',
      website: 'https://arunpol.nic.in',
      address: 'PHQ Ganga, Itanagar 791113',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Arunachal Emergency Medical Ambulance Service (108 / 102)',
      ambulanceNumber: '108',
      directLine: '+91 360 2244222',
      website: 'https://nrhmarunachal.gov.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Arunachal Fire & Emergency Services',
      emergencyNumber: '101',
      controlRoom: '+91 360 2212101',
      website: 'https://arunpol.nic.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Arunachal Pradesh Public Works Department (PWD)',
      website: 'https://pwdarunachal.nic.in',
      helpline: '1033',
      description: 'Maintains trans-Arunachal highway corridors and high-altitude frontier passes.',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'BRO Project Vartak / Arunank / Brahmank',
      headquarters: 'West Kameng / Tawang & Papum Pare',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'Directorate of Health Services Arunachal', category: 'Health & Medical', url: 'https://health.arunachal.gov.in', domain: 'health.arunachal.gov.in' },
      { name: 'Arunachal Department of Transport', category: 'Transport', url: 'https://transport.arunachal.gov.in', domain: 'transport.arunachal.gov.in' },
    ],
  },

  Meghalaya: {
    stateId: 'Meghalaya',
    stateName: 'Meghalaya',
    capital: 'Shillong',
    portalUrl: 'https://meghalaya.gov.in',
    portalName: 'Government of Meghalaya',
    emblemAlt: 'Government of Meghalaya',
    seocContact: {
      name: 'Meghalaya State Disaster Management Authority (MSDMA / SEOC)',
      tollFree: '1070',
      phone: '+91 364 2502098',
      email: 'sdma-meg@gov.in',
      website: 'https://msdma.gov.in',
      address: 'Revenue & Disaster Management Dept, Secretariat Hills, Shillong 793001',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Meghalaya Police Headquarters Control Room',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 364 2222214',
      website: 'https://megpolice.gov.in',
      address: 'Secretariat Hills, Shillong, Meghalaya 793001',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Meghalaya 108 Emergency Ambulance Service (GVK EMRI)',
      ambulanceNumber: '108',
      directLine: '+91 364 2591108',
      website: 'https://nhmmeghalaya.nic.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Meghalaya Fire & Emergency Services',
      emergencyNumber: '101',
      controlRoom: '+91 364 2222201',
      website: 'https://megpolice.gov.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Meghalaya Public Works Department (PWD Roads)',
      website: 'https://megpwd.gov.in',
      helpline: '1033',
      description: 'Critical monitoring for NH-6 landslide stretches, Sonapur Tunnel, and Cherrapunji-Shella road networks.',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'BRO Project Setuk (HQ 44 Border Roads Task Force)',
      headquarters: 'East Jaintia Hills / Shillong Sector',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'National Health Mission Meghalaya', category: 'Health Services', url: 'https://nhmmeghalaya.nic.in', domain: 'nhmmeghalaya.nic.in' },
      { name: 'Meghalaya State Transport Corporation', category: 'Logistics & Transit', url: 'https://megtransport.gov.in', domain: 'megtransport.gov.in' },
    ],
  },

  Manipur: {
    stateId: 'Manipur',
    stateName: 'Manipur',
    capital: 'Imphal',
    portalUrl: 'https://manipur.gov.in',
    portalName: 'Government of Manipur Official Portal',
    emblemAlt: 'Government of Manipur',
    seocContact: {
      name: 'Manipur State Disaster Management Authority (SEOC Imphal)',
      tollFree: '1070',
      phone: '+91 385 2450005',
      email: 'sdma-manipur@gov.in',
      website: 'https://manipur.gov.in',
      address: 'Old Secretariat, Babupara, Imphal, Manipur 795001',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Manipur Police Central Control Room',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 385 2450100',
      website: 'https://manipurpolice.gov.in',
      address: 'Police Headquarters, Babupara, Imphal 795001',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Manipur 108 Emergency Ambulance Dispatch Center',
      ambulanceNumber: '108',
      directLine: '+91 385 2414444',
      website: 'https://nrhmmanipur.org',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Manipur Fire Service Department',
      emergencyNumber: '101',
      controlRoom: '+91 385 2450101',
      website: 'https://manipur.gov.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Manipur Public Works Department (PWD)',
      website: 'https://pwdmanipur.gov.in',
      helpline: '1033',
      description: 'Manages critical lifelines NH-2 (Imphal-Dimapur) and NH-37 (Imphal-Jiribam).',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'Border Roads Organisation Project Sevak (Manipur Liaison)',
      headquarters: 'Imphal & Jiribam Highway Task Force',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'Directorate of Health Services Manipur', category: 'Medical & Hospitals', url: 'https://manipurhealthdirectorate.mn.gov.in', domain: 'manipurhealthdirectorate.mn.gov.in' },
      { name: 'Transport Department Manipur', category: 'Cargo & Road Transport', url: 'https://manipur.gov.in', domain: 'manipur.gov.in' },
    ],
  },

  Mizoram: {
    stateId: 'Mizoram',
    stateName: 'Mizoram',
    capital: 'Aizawl',
    portalUrl: 'https://mizoram.gov.in',
    portalName: 'Government of Mizoram Portal',
    emblemAlt: 'Government of Mizoram',
    seocContact: {
      name: 'Disaster Management & Rehabilitation Department Mizoram',
      tollFree: '1070',
      phone: '+91 389 2322307',
      email: 'dmr-mizoram@gov.in',
      website: 'https://dmr.mizoram.gov.in',
      address: 'Mizoram Secretariat, MINECO, Khatla, Aizawl 796001',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Mizoram Police Headquarters (ERSS 112)',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 389 2334112',
      website: 'https://police.mizoram.gov.in',
      address: 'Police Headquarters, Khatla, Aizawl 796001',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Mizoram Emergency Medical Ambulance (108 / 102)',
      ambulanceNumber: '108',
      directLine: '+91 389 2320108',
      website: 'https://health.mizoram.gov.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Mizoram Fire & Emergency Services',
      emergencyNumber: '101',
      controlRoom: '+91 389 2322101',
      website: 'https://police.mizoram.gov.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Mizoram Public Works Department (PWD)',
      website: 'https://pwd.mizoram.gov.in',
      helpline: '1033',
      description: 'Highway maintenance for NH-306 (Silchar-Aizawl lifeline) and Kaladan multi-modal transit corridor.',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'Border Roads Organisation Project Pushpak',
      headquarters: 'Zemabawk, Aizawl, Mizoram',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'Health & Family Welfare Mizoram', category: 'Health Services', url: 'https://health.mizoram.gov.in', domain: 'health.mizoram.gov.in' },
      { name: 'Transport Department Mizoram', category: 'Transport Fleet', url: 'https://transport.mizoram.gov.in', domain: 'transport.mizoram.gov.in' },
    ],
  },

  Nagaland: {
    stateId: 'Nagaland',
    stateName: 'Nagaland',
    capital: 'Kohima',
    portalUrl: 'https://nagaland.gov.in',
    portalName: 'Government of Nagaland Official Portal',
    emblemAlt: 'Government of Nagaland',
    seocContact: {
      name: 'Nagaland State Disaster Management Authority (NSDMA / SEOC)',
      tollFree: '1070',
      phone: '+91 370 2291122',
      email: 'nsdma.nagaland@gmail.com',
      website: 'https://nsdma.nagaland.gov.in',
      address: 'Civil Secretariat, Kohima, Nagaland 797004',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Nagaland Police Central Control Room',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 370 2244279',
      website: 'https://police.nagaland.gov.in',
      address: 'Police Headquarters (PHQ), Kohima 797001',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Nagaland 108 Emergency Medical Response Service',
      ambulanceNumber: '108',
      directLine: '+91 370 2270108',
      website: 'https://nhmnagaland.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Nagaland Fire & Emergency Services',
      emergencyNumber: '101',
      controlRoom: '+91 370 2222101',
      website: 'https://fireandemergencyservices.nagaland.gov.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Nagaland Public Works Department (Roads & Bridges)',
      website: 'https://pwd.nagaland.gov.in',
      helpline: '1033',
      description: 'Maintains NH-29 Pagla Pahar critical rockfall stretch and inter-district mountain roads.',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'Border Roads Organisation Project Sewak',
      headquarters: 'Dimapur / Kohima Sector',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'Health & Family Welfare Nagaland', category: 'Public Health', url: 'https://health.nagaland.gov.in', domain: 'health.nagaland.gov.in' },
      { name: 'Motor Vehicles Department Nagaland', category: 'Logistics & Traffic', url: 'https://transport.nagaland.gov.in', domain: 'transport.nagaland.gov.in' },
    ],
  },

  Tripura: {
    stateId: 'Tripura',
    stateName: 'Tripura',
    capital: 'Agartala',
    portalUrl: 'https://tripura.gov.in',
    portalName: 'Government of Tripura Official Portal',
    emblemAlt: 'Government of Tripura',
    seocContact: {
      name: 'Tripura State Disaster Management Authority (SEOC Agartala)',
      tollFree: '1070',
      phone: '+91 381 2416045',
      email: 'revenue-tr@nic.in',
      website: 'https://revenue.tripura.gov.in',
      address: 'Revenue Department, Secretariat Complex, Agartala 799010',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Tripura Police Control Room (ERSS 112)',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 381 2324000',
      website: 'https://tripurapolice.gov.in',
      address: 'Police Headquarters, Fire Brigade Chowmuhani, Agartala 799001',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Tripura 108 Emergency Ambulance Fleet (GVK EMRI)',
      ambulanceNumber: '108',
      directLine: '+91 381 2380108',
      website: 'https://health.tripura.gov.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Tripura Fire & Emergency Services Department',
      emergencyNumber: '101',
      controlRoom: '+91 381 2323333',
      website: 'https://tripurapolice.gov.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Tripura Public Works Department (Roads & Buildings)',
      website: 'https://pwd.tripura.gov.in',
      helpline: '1033',
      description: 'Ensures uninterrupted heavy commodity transport along NH-8 (Churaibari gateway corridor).',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'NHIDCL & BRO Tripura Engineering Cell',
      headquarters: 'Agartala Corridor Desk',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'Health & Family Welfare Tripura', category: 'Hospital Resources', url: 'https://health.tripura.gov.in', domain: 'health.tripura.gov.in' },
      { name: 'Transport Department Tripura', category: 'Inter-State Transit', url: 'https://transport.tripura.gov.in', domain: 'transport.tripura.gov.in' },
    ],
  },

  Sikkim: {
    stateId: 'Sikkim',
    stateName: 'Sikkim',
    capital: 'Gangtok',
    portalUrl: 'https://sikkim.gov.in',
    portalName: 'Government of Sikkim Portal',
    emblemAlt: 'Government of Sikkim',
    seocContact: {
      name: 'Sikkim State Disaster Management Authority (SSDMA / SEOC)',
      tollFree: '1070',
      phone: '+91 3592 201075',
      email: 'ssdma-sk@nic.in',
      website: 'https://ssdma.nic.in',
      address: 'Tashiling Secretariat, Gangtok, East Sikkim 737101',
      lastVerified: 'August 2026',
    },
    policeContact: {
      name: 'Sikkim Police Control Room (ERSS 112)',
      emergencyNumber: '112 / 100',
      controlRoom: '+91 3592 202022',
      website: 'https://sikkimpolice.nic.in',
      address: 'Police Headquarters, Gangtok, Sikkim 737101',
      lastVerified: 'August 2026',
    },
    medicalContact: {
      serviceName: 'Sikkim 108 Emergency Medical Response (STNM Hospital Linkage)',
      ambulanceNumber: '108',
      directLine: '+91 3592 202944',
      website: 'https://hfw.sikkim.gov.in',
      lastVerified: 'August 2026',
    },
    fireContact: {
      serviceName: 'Sikkim Fire & Emergency Services',
      emergencyNumber: '101',
      controlRoom: '+91 3592 202101',
      website: 'https://sikkimpolice.nic.in',
      lastVerified: 'August 2026',
    },
    pwdRoadAuthority: {
      departmentName: 'Roads and Bridges Department Government of Sikkim',
      website: 'https://sikkimroads.gov.in',
      helpline: '1033',
      description: 'Oversees Teesta River valley landslide stabilization, NH-10 connectivity, and North Sikkim high-altitude access roads.',
      lastVerified: 'August 2026',
    },
    broProjectDesk: {
      projectName: 'Border Roads Organisation Project Swastik',
      headquarters: 'Swastik Complex, Gangtok, Sikkim',
      highwayHelpline: '1033',
      lastVerified: 'August 2026',
    },
    additionalPortals: [
      { name: 'Health & Family Welfare Sikkim', category: 'Medical Facilities', url: 'https://hfw.sikkim.gov.in', domain: 'hfw.sikkim.gov.in' },
      { name: 'Sikkim Nationalised Transport (SNT)', category: 'Public Logistics', url: 'https://snt.sikkim.gov.in', domain: 'snt.sikkim.gov.in' },
    ],
  },
};
