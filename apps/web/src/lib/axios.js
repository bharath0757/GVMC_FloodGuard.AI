import axios from 'axios';
import { STORAGE_KEYS } from './constants';
import { env } from './env';
export const apiClient = axios.create({
    baseURL: env.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
apiClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export const api = {
    get: (url, config) => apiClient.get(url, config),
    post: (url, data, config) => apiClient.post(url, data, config),
    put: (url, data, config) => apiClient.put(url, data, config),
    patch: (url, data, config) => apiClient.patch(url, data, config),
    delete: (url, config) => apiClient.delete(url, config),
};
//# sourceMappingURL=axios.js.map