import axios from 'axios';

const API_BASE = '/api';

// Storage key constants — must match AuthContext
const STORAGE_PREFIX = 'hishabee';
const STORAGE_KEYS = {
  token: `${STORAGE_PREFIX}_token`,
  user: `${STORAGE_PREFIX}_user`,
  tenantId: `${STORAGE_PREFIX}_tenant_id`,
  tenantConfig: `${STORAGE_PREFIX}_tenant_config`,
} as const;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenantId = localStorage.getItem(STORAGE_KEYS.tenantId);
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
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.user);
        localStorage.removeItem(STORAGE_KEYS.tenantId);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
