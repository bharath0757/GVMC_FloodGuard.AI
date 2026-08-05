export interface NotificationItem {
  id: string;
  notification_type:
    | 'high_risk_prediction'
    | 'verified_report'
    | 'shelter_capacity_warning'
    | 'critical_emergency';
  title: string;
  message: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  is_read: boolean;
  created_at: string;
  meta_data?: Record<string, unknown>;
}
export interface AssistantResponse {
  query: string;
  intent: string;
  target_ward_number: number;
  target_ward_name: string;
  response_text: string;
  cards: Array<{
    type: string;
    title: string;
    data: Record<string, unknown>;
  }>;
  suggested_actions: Array<{
    label: string;
    query: string;
  }>;
}
export interface AssistantSuggestion {
  label: string;
  query: string;
}
export interface DetailedReport {
  id: string;
  user_id: string;
  reporter_name: string;
  ward_name: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Verified' | 'Rejected' | 'Resolved';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  resolution_status: 'Unresolved' | 'In Progress' | 'Resolved';
  water_depth_cm: number;
  lat: number;
  lng: number;
  image_url?: string;
  ai_labels?: string[];
  ai_confidence: number;
  ai_analysis?: {
    category: string;
    estimated_severity: string;
    confidence: number;
    suggested_priority: string;
    detected_labels: string[];
  };
  internal_notes?: string;
  verified_by?: string;
  verified_at?: string;
  upvotes: number;
  created_at: string;
}
export declare const useNotifications: () => import('@tanstack/react-query').UseQueryResult<
  NoInfer<{
    total_notifications: number;
    unread_count: number;
    notifications: NotificationItem[];
  }>,
  Error
>;
export declare const useAssistantSuggestions: () => import('@tanstack/react-query').UseQueryResult<
  NoInfer<{
    suggestions: AssistantSuggestion[];
  }>,
  Error
>;
export declare const useAssistantQuery: () => import('@tanstack/react-query').UseMutationResult<
  AssistantResponse,
  Error,
  {
    query: string;
    lat?: number;
    lng?: number;
  },
  unknown
>;
export declare const useMyReports: () => import('@tanstack/react-query').UseQueryResult<
  NoInfer<DetailedReport[]>,
  Error
>;
export declare const useVerifyReport: () => import('@tanstack/react-query').UseMutationResult<
  DetailedReport,
  Error,
  {
    report_id: string;
    status: 'Verified' | 'Rejected';
    priority?: string;
    internal_notes?: string;
  },
  unknown
>;
export declare const useResolveReport: () => import('@tanstack/react-query').UseMutationResult<
  DetailedReport,
  Error,
  {
    report_id: string;
    resolution_status: 'In Progress' | 'Resolved';
    internal_notes?: string;
  },
  unknown
>;
//# sourceMappingURL=use-citizen-queries.d.ts.map
