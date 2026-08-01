import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface RiskPrediction {
  prediction_id: string;
  ward_number: number;
  risk_score: number;
  risk_category: 'Critical' | 'High' | 'Medium' | 'Low' | 'Very Low';
  alert_color: 'Red' | 'Orange' | 'Yellow' | 'Green';
  confidence: number;
  model_used: string;
  features_used: Record<string, number>;
  explanations: Array<{
    feature: string;
    value: number;
    contribution: number;
    direction: 'increases_risk' | 'reduces_risk';
    importance_rank: number;
  }>;
  recommendations: string[];
  inference_time_ms: number;
  timestamp: string;
}

export interface DashboardSummary {
  overall_alert_level: 'Red' | 'Orange' | 'Yellow' | 'Green';
  total_wards_monitored: number;
  critical_wards: number;
  high_risk_wards: number;
  medium_risk_wards: number;
  safe_wards: number;
  average_risk_score: number;
  top_risk_ward: WardPrediction;
  alert_distribution: Record<string, number>;
  ward_predictions: WardPrediction[];
  model_status: string;
  last_updated: string;
}

export interface WardPrediction {
  ward_number: number;
  ward_name: string;
  risk_score: number;
  risk_category: string;
  alert_color: string;
  confidence: number;
  rainfall_mm_hr: number;
  water_level_cm: number;
  model_used: string;
  timestamp: string;
  top_factor: string;
}

export interface ShelterRecommendation {
  primary_shelter: {
    id: string;
    name: string;
    ward: string;
    lat: number;
    lng: number;
    capacity: number;
    current_occupancy: number;
    available_capacity: number;
    distance_km: number;
    estimated_travel_min: number;
    has_medical: boolean;
    has_food: boolean;
    is_accessible: boolean;
    recommendation_score: number;
    occupancy_pct: number;
  };
  alternative_shelters: any[];
  reasoning: string[];
  total_shelters_evaluated: number;
  shelters_in_range: number;
  risk_context: any;
}

export interface SafeRoute {
  start_ward: string;
  primary_route: {
    path: string[];
    segments: any[];
    destination_ward: string;
    total_distance_km: number;
    estimated_time_min: number;
    route_status: string;
    waypoints: Array<{ ward_id: string; lat: number; lng: number }>;
  };
  alternative_route: any;
  routing_algorithm: string;
}

// ─────────────────────────────────────────────
// AI API Hooks
// ─────────────────────────────────────────────

// Mock data for offline fallback
const MOCK_DASHBOARD: DashboardSummary = {
  overall_alert_level: 'Red',
  total_wards_monitored: 15,
  critical_wards: 3,
  high_risk_wards: 5,
  medium_risk_wards: 4,
  safe_wards: 3,
  average_risk_score: 61.4,
  top_risk_ward: {
    ward_number: 14, ward_name: 'Gajuwaka', risk_score: 88.2,
    risk_category: 'Critical', alert_color: 'Red', confidence: 0.94,
    rainfall_mm_hr: 68.2, water_level_cm: 142.0, model_used: 'XGBoost-v2.1',
    timestamp: new Date().toISOString(), top_factor: 'rainfall_mm_hr',
  },
  alert_distribution: { Red: 3, Orange: 5, Yellow: 4, Green: 3 },
  ward_predictions: [
    { ward_number: 14, ward_name: 'Gajuwaka', risk_score: 88.2, risk_category: 'Critical', alert_color: 'Red', confidence: 0.94, rainfall_mm_hr: 68.2, water_level_cm: 142.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'rainfall_mm_hr' },
    { ward_number: 12, ward_name: 'Pendurthi', risk_score: 82.7, risk_category: 'Critical', alert_color: 'Red', confidence: 0.91, rainfall_mm_hr: 71.3, water_level_cm: 158.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'water_level_cm' },
    { ward_number: 1,  ward_name: 'Old Town',  risk_score: 79.1, risk_category: 'Critical', alert_color: 'Red', confidence: 0.89, rainfall_mm_hr: 64.9, water_level_cm: 135.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'drainage_score' },
    { ward_number: 22, ward_name: 'Sheela Nagar', risk_score: 71.6, risk_category: 'High', alert_color: 'Orange', confidence: 0.87, rainfall_mm_hr: 61.5, water_level_cm: 121.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'rainfall_mm_hr' },
    { ward_number: 19, ward_name: 'Gopalapatnam', risk_score: 68.4, risk_category: 'High', alert_color: 'Orange', confidence: 0.85, rainfall_mm_hr: 57.6, water_level_cm: 112.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'water_level_cm' },
    { ward_number: 20, ward_name: 'Kommadi', risk_score: 65.2, risk_category: 'High', alert_color: 'Orange', confidence: 0.83, rainfall_mm_hr: 59.1, water_level_cm: 118.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'rainfall_mm_hr' },
    { ward_number: 8,  ward_name: 'One Town', risk_score: 62.8, risk_category: 'High', alert_color: 'Orange', confidence: 0.82, rainfall_mm_hr: 54.8, water_level_cm: 98.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'distance_to_river_km' },
    { ward_number: 6,  ward_name: 'Kancharapalem', risk_score: 60.1, risk_category: 'High', alert_color: 'Orange', confidence: 0.81, rainfall_mm_hr: 49.7, water_level_cm: 94.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'drainage_score' },
    { ward_number: 3,  ward_name: 'Maharanipeta', risk_score: 48.3, risk_category: 'Medium', alert_color: 'Yellow', confidence: 0.79, rainfall_mm_hr: 42.1, water_level_cm: 72.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'rainfall_mm_hr' },
    { ward_number: 5,  ward_name: 'Dwaraka Nagar', risk_score: 44.7, risk_category: 'Medium', alert_color: 'Yellow', confidence: 0.78, rainfall_mm_hr: 45.3, water_level_cm: 83.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'drainage_score' },
    { ward_number: 9,  ward_name: 'Akkayyapalem', risk_score: 39.2, risk_category: 'Medium', alert_color: 'Yellow', confidence: 0.77, rainfall_mm_hr: 37.6, water_level_cm: 61.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'elevation_m' },
    { ward_number: 11, ward_name: 'Seethammadhara', risk_score: 30.5, risk_category: 'Low', alert_color: 'Green', confidence: 0.88, rainfall_mm_hr: 38.4, water_level_cm: 55.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'elevation_m' },
    { ward_number: 2,  ward_name: 'MVP Colony', risk_score: 22.1, risk_category: 'Low', alert_color: 'Green', confidence: 0.91, rainfall_mm_hr: 33.8, water_level_cm: 46.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'elevation_m' },
    { ward_number: 16, ward_name: 'Muralinagar', risk_score: 18.4, risk_category: 'Very Low', alert_color: 'Green', confidence: 0.93, rainfall_mm_hr: 29.2, water_level_cm: 38.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'elevation_m' },
    { ward_number: 15, ward_name: 'Madhurawada', risk_score: 14.7, risk_category: 'Very Low', alert_color: 'Green', confidence: 0.95, rainfall_mm_hr: 28.4, water_level_cm: 34.0, model_used: 'XGBoost-v2.1', timestamp: new Date().toISOString(), top_factor: 'elevation_m' },
  ],
  model_status: 'XGBoost + Analytical Ensemble Active',
  last_updated: new Date().toISOString(),
};

export const useAIDashboardSummary = () =>
  useQuery<DashboardSummary>({
    queryKey: ['ai', 'dashboard-summary'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/ai/dashboard-summary');
        return res.data;
      } catch {
        return MOCK_DASHBOARD;
      }
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

export const useAIHighRiskZones = () =>
  useQuery({
    queryKey: ['ai', 'high-risk-zones'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/ai/high-risk-zones');
        return res.data;
      } catch {
        return { high_risk_count: 8, zones: MOCK_DASHBOARD.ward_predictions.filter(w => w.risk_score >= 60) };
      }
    },
    refetchInterval: 60_000,
  });

export const useAIWardPredictions = () =>
  useQuery({
    queryKey: ['ai', 'ward-predictions'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/ai/ward-predictions');
        return res.data;
      } catch {
        return { total_wards: 15, predictions: MOCK_DASHBOARD.ward_predictions };
      }
    },
    refetchInterval: 60_000,
  });

export const useAIPredictRisk = () =>
  useMutation<RiskPrediction, Error, {
    ward_number: number;
    rainfall_mm_hr: number;
    water_level_cm: number;
  }>({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/ai/predict-risk', payload);
      return res.data;
    },
  });

export const useAIRecommendShelter = () =>
  useMutation<ShelterRecommendation, Error, {
    user_lat: number;
    user_lng: number;
    risk_score: number;
    ward_risk_category: string;
  }>({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/ai/recommend-shelter', payload);
      return res.data;
    },
  });

export const useAISafeRoute = () =>
  useMutation<SafeRoute, Error, {
    start_ward: string;
    high_risk_wards: string[];
    flooded_wards: string[];
  }>({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/ai/safe-route', payload);
      return res.data;
    },
  });
