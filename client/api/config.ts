// API Configuration for VAIS Application
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, BUILD_ENV } from './baseUrl';
// Re-export base URL and build env for backwards compatibility
export { API_BASE_URL, BUILD_ENV };
import { API_ENDPOINTS as ENDPOINTS } from './endpoints';

// Re-export canonical endpoints from endpoints.ts so consumers can import from config
export const API_ENDPOINTS = ENDPOINTS;

// API Configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: parseInt((import.meta.env as any).VITE_API_TIMEOUT || '50000000'),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// Create axios instance
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('valasys_auth_token');
    if (token) {
      (config.headers as any) = config.headers || ({} as any);
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as RetryableRequest;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('valasys_refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const newToken = response.data.access;
          localStorage.setItem('valasys_auth_token', newToken);

          originalRequest.headers = (originalRequest.headers || ({} as any)) as any;
          (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('valasys_auth_token');
          localStorage.removeItem('valasys_refresh_token');
          // Notify pages that the session expired so they can react (toasts, cleanup)
          try {
            window.dispatchEvent(new CustomEvent('sessionExpired'));
          } catch (e) {
            // ignore if CustomEvent isn't supported for some reason
          }
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('valasys_auth_token');
        // Notify pages that the session expired so they can react (toasts, cleanup)
        try {
          window.dispatchEvent(new CustomEvent('sessionExpired'));
        } catch (e) {
          // ignore
        }
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// Helpful debug: surface failing request info to console for easier troubleshooting
apiClient.interceptors.response.use(undefined, (error) => {
  try {
    const cfg = error?.config || {};
    console.error('[apiClient] request failed', {
      url: cfg.url,
      method: cfg.method,
      status: error?.response?.status,
      responseData: error?.response?.data,
      message: error?.message,
    });
  } catch (e) {
    // swallow
  }
  return Promise.reject(error);
});

// API response types
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

// (endpoints are provided by ./endpoints and re-exported above)

// Utility functions
export const isProduction = (): boolean => BUILD_ENV === 2;
export const isStaging = (): boolean => BUILD_ENV === 1;
export const isDevelopment = (): boolean => BUILD_ENV === 0;

export default apiClient;
