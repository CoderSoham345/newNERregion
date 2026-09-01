/**
 * UttarPURV API Base URL Resolver
 * Resolves VITE_API_BASE_URL if configured for production deployment, or falls back to relative root for same-origin server.
 */
export function getApiBaseUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
  return '';
}
