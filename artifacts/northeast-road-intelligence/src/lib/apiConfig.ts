/**
 * UttarPURV API Base URL Resolver
 * Resolves VITE_API_BASE_URL if configured for production deployment, or falls back to production backend endpoint.
 */
export const PRODUCTION_API_URL = 'https://northeast-road-intelligence12-api-s-rajivshin420-6640s-projects.vercel.app';

export function getApiBaseUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    const envUrl = import.meta.env.VITE_API_BASE_URL.trim();
    if (envUrl) {
      return envUrl.replace(/\/+$/, '');
    }
  }
  return PRODUCTION_API_URL;
}

