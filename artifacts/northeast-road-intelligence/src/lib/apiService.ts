/**
 * Northeast Road Intelligence (NER-SMART) API Client
 * Seamlessly interfaces with the Express / Vercel Serverless Backend and Supabase PostgreSQL
 */

export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }
  // Default to the dedicated Vercel production API or local relative path
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return ''; // Relative path on same domain, or use deployed API
  }
  return 'https://northeast-road-intelligence156-api.vercel.app';
})();

function getEndpoint(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }
  // If base url already ends with /api and path starts with /api, avoid duplication
  if (API_BASE_URL.endsWith('/api') && normalizedPath.startsWith('/api')) {
    return `${API_BASE_URL}${normalizedPath.substring(4)}`;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

async function safeFetch<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = getEndpoint(path);
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network request failed' };
  }
}

// Health Check
export async function checkApiHealth(): Promise<{ status: string }> {
  try {
    const url = getEndpoint('/api/healthz');
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
    return { status: 'degraded' };
  } catch {
    return { status: 'offline' };
  }
}

// States
export async function fetchStates() {
  return safeFetch<any[]>('/api/states');
}

// Districts
export async function fetchDistricts(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/districts${query}`);
}

// Highways & Segments
export async function fetchHighways(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/highways${query}`);
}

export async function fetchRoadSegments(stateId?: string, districtId?: string) {
  const params = new URLSearchParams();
  if (stateId && stateId !== 'All states') params.append('stateId', stateId);
  if (districtId && districtId !== 'all') params.append('districtId', districtId);
  const q = params.toString() ? `?${params.toString()}` : '';
  return safeFetch<any[]>(`/api/road-segments${q}`);
}

// Incidents
export async function fetchIncidents(stateId?: string, districtId?: string) {
  const params = new URLSearchParams();
  if (stateId && stateId !== 'All states') params.append('stateId', stateId);
  if (districtId && districtId !== 'all') params.append('districtId', districtId);
  const q = params.toString() ? `?${params.toString()}` : '';
  return safeFetch<any[]>(`/api/incidents${q}`);
}

export async function createIncident(incidentData: any) {
  return safeFetch<any>('/api/incidents', {
    method: 'POST',
    body: JSON.stringify(incidentData),
  });
}

// Alerts & Hazards
export async function fetchAlerts(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/alerts${query}`);
}

export async function fetchFloodAlerts(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/flood-alerts${query}`);
}

export async function fetchLandslideAlerts(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/landslide-alerts${query}`);
}

export async function fetchActiveHazards(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/active-hazards${query}`);
}

// News
export async function fetchNews() {
  return safeFetch<any[]>('/api/news');
}

// Helplines
export async function fetchHelplines(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/helplines${query}`);
}

// Cargo & Convoys
export async function fetchCargo(destinationState?: string) {
  const query = destinationState && destinationState !== 'All states' ? `?destinationState=${encodeURIComponent(destinationState)}` : '';
  return safeFetch<any[]>(`/api/cargo-readiness${query}`);
}

export async function fetchVehicles(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/vehicles${query}`);
}

// Infrastructure
export async function fetchInfrastructure(stateId?: string) {
  const query = stateId && stateId !== 'All states' ? `?stateId=${encodeURIComponent(stateId)}` : '';
  return safeFetch<any[]>(`/api/infrastructure${query}`);
}
