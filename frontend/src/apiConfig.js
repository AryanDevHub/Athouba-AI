// Centralized API & Media URL configuration
// Dynamically supports Localhost, Mobile on LAN, and HTTPS Port Forwarding (ngrok, tunnels, etc.)
export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${clean}`;
}

export function getMediaUrl(mediaPath) {
  if (!mediaPath) return '';
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) return mediaPath;
  const clean = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  return `${API_BASE}${clean}`;
}
