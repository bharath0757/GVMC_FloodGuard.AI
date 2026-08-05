export interface WardData {
  id: string;
  name: string;
  number: number;
  riskScore: number;
  riskCategory: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Critical';
  population: number;
  elevationMeters: number;
  waterLevelCm: number;
  rainfallMmHr: number;
  activeAlertsCount: number;
}
export interface ShelterData {
  id: string;
  name: string;
  wardName: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  contactPhone: string;
  isAccessible: boolean;
  amenities: string[];
  status: 'Open' | 'Near Capacity' | 'Full' | 'Standby';
  lat: number;
  lng: number;
}
export interface CrowdReportData {
  id: string;
  reporterName: string;
  wardName: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Verified' | 'Resolved' | 'Rejected';
  waterDepthEst: string;
  imageUrl?: string;
  aiLabels: string[];
  aiConfidence: number;
  upvotes: number;
}
export interface AlertData {
  id: string;
  title: string;
  severity: 'Information' | 'Warning' | 'Severe' | 'Critical';
  affectedWards: string[];
  issuedAt: string;
  message: string;
  issuedBy: string;
  active: boolean;
}
export interface RainfallDataPoint {
  time: string;
  actualRainfall: number | null;
  predictedRainfall: number;
  waterLevel: number;
}
export declare const MOCK_CITY_OVERVIEW: {
  cityName: string;
  state: string;
  totalPopulation: number;
  overallRiskScore: number;
  riskCategory: 'High Risk';
  monsoonStatus: string;
  lastUpdated: string;
  activeSheltersCount: number;
  totalSheltersCount: number;
  shelterCapacityTotal: number;
  shelterOccupancyTotal: number;
  pendingReportsCount: number;
  activeCriticalAlertsCount: number;
};
export declare const MOCK_WEATHER: {
  temperatureC: number;
  humidityPercent: number;
  rainfallMmHr: number;
  rainfallCumulative24h: number;
  windSpeedKmH: number;
  windDirection: string;
  pressureHpa: number;
  tideLevelMeters: number;
  seaLevelTrend: string;
  forecast6h: string;
};
export declare const MOCK_WARDS: WardData[];
export declare const MOCK_SHELTERS: ShelterData[];
export declare const MOCK_CROWD_REPORTS: CrowdReportData[];
export declare const MOCK_ALERTS: AlertData[];
export declare const MOCK_RAINFALL_SERIES: RainfallDataPoint[];
export declare const MOCK_RISK_DISTRIBUTION: {
  category: string;
  count: number;
  percentage: number;
  color: string;
}[];
export declare const MOCK_ACTIVITY_FEED: {
  id: string;
  timestamp: string;
  type: string;
  text: string;
  severity: string;
}[];
//# sourceMappingURL=mockData.d.ts.map
