import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

// Assuming json-server is running on localhost:3001 as defined in package.json
const baseURL = 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
