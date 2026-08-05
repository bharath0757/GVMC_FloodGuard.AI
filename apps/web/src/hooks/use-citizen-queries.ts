import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

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
  cards: Array<{ type: string; title: string; data: Record<string, unknown> }>;
  suggested_actions: Array<{ label: string; query: string }>;
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

// Fallback seed notifications
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    notification_type: 'high_risk_prediction',
    title: '🚨 Critical Flood Risk Warning: Ward 14 (Gajuwaka)',
    message:
      'XGBoost model predicts 88.2 risk score with 68.2mm/h rainfall. Immediate evacuation advisory active.',
    severity: 'Critical',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'n2',
    notification_type: 'verified_report',
    title: '✅ Citizen Flood Report Verified',
    message:
      'Municipal authority verified flood report at Gajuwaka Main Road. Assigned priority P0.',
    severity: 'High',
    is_read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'n3',
    notification_type: 'shelter_capacity_warning',
    title: '⚠️ Shelter Capacity Warning',
    message:
      'Gajuwaka Sports Stadium reached 79% occupancy. Secondary shelter AU Complex opened.',
    severity: 'Medium',
    is_read: true,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

export const useNotifications = () =>
  useQuery<{
    total_notifications: number;
    unread_count: number;
    notifications: NotificationItem[];
  }>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/notifications');
        return res.data;
      } catch {
        return {
          total_notifications: MOCK_NOTIFICATIONS.length,
          unread_count: MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length,
          notifications: MOCK_NOTIFICATIONS,
        };
      }
    },
    refetchInterval: 30_000,
  });

export const useAssistantSuggestions = () =>
  useQuery<{ suggestions: AssistantSuggestion[] }>({
    queryKey: ['assistant', 'suggestions'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/assistant/suggestions');
        return res.data;
      } catch {
        return {
          suggestions: [
            {
              label: 'Is Gajuwaka safe?',
              query: 'Is Gajuwaka safe right now?',
            },
            {
              label: 'What is Ward 14 flood risk?',
              query: 'What is Ward 14 flood risk score?',
            },
            {
              label: 'Nearest shelter with medical team',
              query:
                'Which shelter should I use with medical aid near MVP Colony?',
            },
            {
              label: 'Which roads should I avoid?',
              query: 'Which roads should I avoid in Ward 14?',
            },
            {
              label: 'Emergency precautions',
              query: 'What precautions should I take during Stage 3 cyclone?',
            },
          ],
        };
      }
    },
    staleTime: 300_000,
  });

export const useAssistantQuery = () =>
  useMutation<
    AssistantResponse,
    Error,
    { query: string; lat?: number; lng?: number }
  >({
    mutationFn: async ({ query, lat, lng }) => {
      const res = await apiClient.post('/assistant/query', {
        query,
        user_lat: lat ?? 17.6868,
        user_lng: lng ?? 83.2185,
      });
      return res.data;
    },
  });

export const useMyReports = () =>
  useQuery<DetailedReport[]>({
    queryKey: ['reports', 'my'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/my');
        return res.data;
      } catch {
        return [];
      }
    },
    refetchInterval: 15_000,
  });

export const useVerifyReport = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DetailedReport,
    Error,
    {
      report_id: string;
      status: 'Verified' | 'Rejected';
      priority?: string;
      internal_notes?: string;
    }
  >({
    mutationFn: async ({ report_id, status, priority, internal_notes }) => {
      const res = await apiClient.patch(`/reports/${report_id}/verify`, {
        status,
        priority: priority || 'P1',
        internal_notes,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useResolveReport = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DetailedReport,
    Error,
    {
      report_id: string;
      resolution_status: 'In Progress' | 'Resolved';
      internal_notes?: string;
    }
  >({
    mutationFn: async ({ report_id, resolution_status, internal_notes }) => {
      const res = await apiClient.patch(`/reports/${report_id}/resolve`, {
        resolution_status,
        internal_notes,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
