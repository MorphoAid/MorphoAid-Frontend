import axios from 'axios';
import router from '@/router';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login using router or fallback to window.location
      if (router) {
        router.push('/login');
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default http;
