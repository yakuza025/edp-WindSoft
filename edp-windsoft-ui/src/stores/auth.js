import { defineStore } from 'pinia';
import { systemsApi } from '@/api';
import { STORAGE_KEYS } from '@/config/app';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminKey: localStorage.getItem(STORAGE_KEYS.ADMIN_KEY) || '',
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.adminKey),
  },

  actions: {
    async login(key) {
      const trimmed = key.trim();
      if (!trimmed) throw new Error('Admin key required');

      const prev = this.adminKey;
      this.adminKey = trimmed;
      try {
        await systemsApi.listAdmin();
        localStorage.setItem(STORAGE_KEYS.ADMIN_KEY, trimmed);
        return true;
      } catch (e) {
        this.adminKey = prev;
        if (!prev) localStorage.removeItem(STORAGE_KEYS.ADMIN_KEY);
        throw e;
      }
    },

    logout() {
      this.adminKey = '';
      localStorage.removeItem(STORAGE_KEYS.ADMIN_KEY);
    },

    clear() {
      this.logout();
    },
  },
});
