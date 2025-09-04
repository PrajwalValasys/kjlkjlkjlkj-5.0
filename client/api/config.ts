// API Configuration for VAIS Application
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Environment configuration
const getEnvVar = (key: string, fallback: string = ''): string => {
  const env: any = import.meta.env as any;
  // Support both VITE_* and REACT_APP_* style keys
  if (env[key] != null && env[key] !== '') return env[key] as string;
  // If the key starts with REACT_APP_, also try VITE_ equivalent
  if (key.startsWith('REACT_APP_')) {
    const viteKey = key.replace(/^REACT_APP_/, 'VITE_');
    if (env[viteKey] != null && env[viteKey] !== '') return env[viteKey] as string;
  }
  return fallback;
};

// Environment mapping
const BUILD_ENV = parseInt(getEnvVar('REACT_APP_BUILD_ENV', getEnvVar('VITE_BUILD_ENV', '0')));

const baseUrls = {
  0: getEnvVar('REACT_APP_LOCAL_BACKEND_URL', getEnvVar('VITE_LOCAL_BACKEND_URL', 'https://api.valasys.ai')),
  1: getEnvVar('REACT_APP_STAGING_BACKEND_URL', getEnvVar('VITE_STAGING_BACKEND_URL', 'https://api.valasys.ai')),
  2: getEnvVar('REACT_APP_PROD_BACKEND_URL', getEnvVar('VITE_PROD_BACKEND_URL', 'https://api.valasys.ai')),
};

// Prefer an explicit VITE_API_BASE_URL if provided
const stripTrailingSlash = (u: string) => (u ? u.replace(/\/+$/u, '') : u);
export const API_BASE_URL = stripTrailingSlash(
  getEnvVar('VITE_API_BASE_URL', '') || (baseUrls[BUILD_ENV as keyof typeof baseUrls] || baseUrls[0]),
);

// API Configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: parseInt(getEnvVar('REACT_APP_API_TIMEOUT', getEnvVar('VITE_API_TIMEOUT', '300000'))),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
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
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('valasys_auth_token');
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

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login/',
    REGISTER: '/register',
    LOGOUT: '/logout/',
    REFRESH_TOKEN: '/token/refresh/',
    VERIFY_EMAIL: '/verify_email/',
    VERIFY_EMAIL_OTP: '/validate-email-otp/',
    VERIFY_PHONE_OTP: '/validate-phone-otp/',
    PASSWORD_RESET_OTP_SENDER: '/password-reset-otp-sender/',
    RESET_PASSWORD: '/password-reset',
    FORGOT_PASSWORD_VERIFY_OTP: '/password-reset/',
    CHANGE_PASSWORD: '/change_password',
    RESEND_OTP_EMAIL: '/resend-otp-email/',
    RESEND_OTP_PHONE: '/resend-otp-phone/',
    LINKEDIN_LOGIN: '/user-accounts/linkedin/',
  },
  USER: {
    DETAILS: '/get_profile',
    UPDATE: '/update_profile/',
    STATUS: '/get_user_status',
  },
};

// Utility functions
export const isProduction = (): boolean => BUILD_ENV === 2;
export const isStaging = (): boolean => BUILD_ENV === 1;
export const isDevelopment = (): boolean => BUILD_ENV === 0;

export default apiClient;
