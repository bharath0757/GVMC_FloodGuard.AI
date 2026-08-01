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
    alternative_shelters: Array<Record<string, unknown>>;
    reasoning: string[];
    total_shelters_evaluated: number;
    shelters_in_range: number;
    risk_context: Record<string, unknown>;
}
export interface SafeRoute {
    start_ward: string;
    primary_route: {
        path: string[];
        segments: Array<Record<string, unknown>>;
        destination_ward: string;
        total_distance_km: number;
        estimated_time_min: number;
        route_status: string;
        waypoints: Array<{
            ward_id: string;
            lat: number;
            lng: number;
        }>;
    };
    alternative_route: Record<string, unknown> | null;
    routing_algorithm: string;
}
export declare const useAIDashboardSummary: () => import("@tanstack/react-query").UseQueryResult<NoInfer<DashboardSummary>, Error>;
export declare const useAIHighRiskZones: () => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useAIWardPredictions: () => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useAIPredictRisk: () => import("@tanstack/react-query").UseMutationResult<RiskPrediction, Error, {
    ward_number: number;
    rainfall_mm_hr: number;
    water_level_cm: number;
}, unknown>;
export declare const useAIRecommendShelter: () => import("@tanstack/react-query").UseMutationResult<ShelterRecommendation, Error, {
    user_lat: number;
    user_lng: number;
    risk_score: number;
    ward_risk_category: string;
}, unknown>;
export declare const useAISafeRoute: () => import("@tanstack/react-query").UseMutationResult<SafeRoute, Error, {
    start_ward: string;
    high_risk_wards: string[];
    flooded_wards: string[];
}, unknown>;
//# sourceMappingURL=use-ai-queries.d.ts.map