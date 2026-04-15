import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const apiInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    "Allow-Control-Allow-Origin": "*",
  },
});

// Request interceptor — inject Bearer token from Redux store on every request
apiInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — dispatch logout and redirect to login on 401 Unauthorized
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
