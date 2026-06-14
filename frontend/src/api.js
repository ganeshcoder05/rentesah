import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('rentease_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rentease_token');
      localStorage.removeItem('rentease_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
