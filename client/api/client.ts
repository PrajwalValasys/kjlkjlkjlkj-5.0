import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './config';

export interface ApiService {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  upload<T = any>(url: string, data: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

const service: ApiService = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  upload: (url, data, config) =>
    apiClient.post(url, data, {
      ...config,
      headers: {
        ...(config?.headers as any),
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export { apiClient };
export default service;
