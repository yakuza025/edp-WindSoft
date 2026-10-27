import { defineStore } from 'pinia';
import * as svc from '@/services/siteContent.service';

export const useSiteContentStore = defineStore('siteContent', {
  state: () => ({ data: {}, loading: false, error: null }),
  actions: {
    async load() {
      this.loading = true; this.error = null;
      try { this.data = await svc.getPublic(); }
      catch (e) { this.error = e.message; throw e; }
      finally { this.loading = false; }
    },
    async save(payload) {
      this.data = await svc.saveAdmin(payload);
      return this.data;
    },
  },
});
