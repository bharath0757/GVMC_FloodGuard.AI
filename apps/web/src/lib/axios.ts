import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from './constants';
import { env } from './env';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => apiClient.delete<T>(url, config),
};
