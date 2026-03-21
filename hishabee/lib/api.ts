import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hishabee_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenantId = localStorage.getItem('hishabee_tenant_id');
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hishabee_token');
        localStorage.removeItem('hishabee_user');
        localStorage.removeItem('hishabee_tenant_id');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
