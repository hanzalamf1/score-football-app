import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { API_CONFIG } from '@/constants/Config';

// API yapılandırması
const API_BASE_URL = API_CONFIG.BASE_URL;
const API_TOKEN = API_CONFIG.AUTH_TOKEN;

// Axios instance oluşturma
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': API_TOKEN,
  },
});

// İstek interceptor'ı - her istekte token'ı ekler
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Auth-Token'] = API_TOKEN;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı - hata yönetimi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Kimlik doğrulama hatası - token geçersiz');
    } else if (error.response?.status === 403) {
      console.error('Erişim reddedildi');
    } else if (error.response?.status >= 500) {
      console.error('Sunucu hatası');
    }
    return Promise.reject(error);
  }
);

// Genel API fonksiyonları
export const apiService = {
  // GET isteği
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  },

  // POST isteği
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  },

  // PUT isteği
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  },

  // DELETE isteği
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url);
    return response.data;
  },
};

export default apiClient;
