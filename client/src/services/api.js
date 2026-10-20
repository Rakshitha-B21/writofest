import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Health
export const checkHealth = () => api.get('/health');

// Registrations
export const submitRegistration = (data) => api.post('/registrations', data);
export const getRegistration = (registrationId) =>
  api.get(`/registrations/${registrationId}`);

// Admin Auth
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const adminLogout = () => api.post('/admin/logout');
export const getAdminMe = () => api.get('/admin/me');

// Admin Data
export const getAdminRegistrations = (params) =>
  api.get('/admin/registrations', { params });
export const exportRegistrations = (params) =>
  api.get('/admin/registrations/export', { params, responseType: 'blob' });

export default api;
