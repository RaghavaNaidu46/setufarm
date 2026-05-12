import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.113:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 404) {
      await SecureStore.deleteItemAsync('auth_token');
    }

    return Promise.reject(error);
  }
);

export const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/400';
  if (path.startsWith('http') || path.startsWith('data:')) return path;


  const baseUrl = API_BASE_URL.replace('/api/v1', '').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};


export default apiClient;

