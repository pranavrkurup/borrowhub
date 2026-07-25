import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Automatically add token to requests
api.interceptors.request.use(
  (config) => {
    // Check localStorage for user/token
    const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = localStorage.getItem('token') || storedUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
