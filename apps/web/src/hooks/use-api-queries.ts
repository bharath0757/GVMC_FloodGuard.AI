import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  MOCK_SHELTERS,
  MOCK_CROWD_REPORTS,
  MOCK_ALERTS,
  MOCK_WEATHER,
  MOCK_WARDS,
  ShelterData,
  CrowdReportData,
  AlertData,
  WardData,
} from '@/data/mockData';

export function useShelters() {
  return useQuery({
    queryKey: ['shelters'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/shelters');
        return res.data as ShelterData[];
      } catch {
        return MOCK_SHELTERS;
      }
    },
    initialData: MOCK_SHELTERS,
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports');
        return res.data as CrowdReportData[];
      } catch {
        return MOCK_CROWD_REPORTS;
      }
    },
    initialData: MOCK_CROWD_REPORTS,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/alerts');
        return res.data as AlertData[];
      } catch {
        return MOCK_ALERTS;
      }
    },
    initialData: MOCK_ALERTS,
  });
}

export function useWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/weather/latest');
        return res.data;
      } catch {
        return MOCK_WEATHER;
      }
    },
    initialData: MOCK_WEATHER,
  });
}

export function useRiskZones() {
  return useQuery({
    queryKey: ['risk-zones'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/risk-zones');
        return res.data as WardData[];
      } catch {
        return MOCK_WARDS;
      }
    },
    initialData: MOCK_WARDS,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newReport: {
      ward_name: string;
      title: string;
      description: string;
      severity: string;
      water_depth_cm: number;
      lat: number;
      lng: number;
    }) => {
      const res = await apiClient.post('/reports', newReport);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
