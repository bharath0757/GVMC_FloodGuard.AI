export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || '',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'FloodGuard AI',
} as const;
