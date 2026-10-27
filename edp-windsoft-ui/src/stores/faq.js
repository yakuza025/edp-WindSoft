import { defineStore } from 'pinia';
import * as svc from '@/services/faq.service';

export const useFaqStore = defineStore('faq', {
  state: () => ({ list: [], loading: false, error: null }),
  getters: { count: (s) => s.list.length },
  actions: {
    async loadPublic() {
      this.loading = true; this.error = null;
      try { this.list = await svc.listPublic(); }
      catch (e) { this.error = e.message; throw e; }
      finally { this.loading = false; }
    },
    async loadAdmin() {
      this.loading = true; this.error = null;
      try { this.list = await svc.listAdmin(); }
      catch (e) { this.error = e.message; throw e; }
      finally { this.loading = false; }
    },
    async create(p)      { const r = await svc.create(p);    await this.loadAdmin(); return r; },
    async update(id, p)  { const r = await svc.update(id, p); await this.loadAdmin(); return r; },
    async remove(id)     { await svc.remove(id);              await this.loadAdmin(); },
    async reorder(ids)   { this.list = await svc.reorder(ids); },
  },
});
