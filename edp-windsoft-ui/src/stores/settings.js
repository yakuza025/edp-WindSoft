import { defineStore } from 'pinia';
import * as settingsService from '@/services/settings.service';
import { DEFAULTS } from '@/config/app';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    data: {},
    loading: false,
  }),

  getters: {
    brandName:     (s) => s.data.brand_name     || 'WindSoft Solutions',
    brandSubtitle: (s) => s.data.brand_subtitle || 'Product Demo Showcase',
    autoplayMs:    (s) => Number(s.data.autoplay_ms) || DEFAULTS.AUTOPLAY_MS,
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.data = await settingsService.getPublic();
      } finally {
        this.loading = false;
      }
    },
  },
});
