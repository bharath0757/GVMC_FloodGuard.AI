export interface ClientEnv {
  VITE_API_URL: string;
  VITE_MAPBOX_TOKEN: string;
  VITE_APP_NAME: string;
}

export type NodeEnv = 'development' | 'production' | 'test';
