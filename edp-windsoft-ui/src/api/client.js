import axios from 'axios';
import { API_URL } from '@/config/app';
import { useAuthStore } from '@/stores/auth';

export const http = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

http.interceptors.request.use((cfg) => {
  const auth = useAuthStore();
  if (auth.adminKey) cfg.headers['X-Admin-Key'] = auth.adminKey;
  return cfg;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    err.message =
      err.response?.data?.error?.message ||
      err.message ||
      'Request failed';
    err.status = err.response?.status;
    err.code = err.response?.data?.error?.code;
    return Promise.reject(err);
  },
);

export const unwrap = (p) => p.then((r) => r.data);
