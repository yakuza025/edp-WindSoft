import { defineStore } from 'pinia';
import * as systemsService from '@/services/systems.service';

export const useSystemsStore = defineStore('systems', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),

  getters: {
    count:  (s) => s.list.length,
    active: (s) => s.list.filter((x) => x.is_active),
  },

  actions: {
    async loadPublic() {
      this.loading = true;
      this.error = null;
      try {
        this.list = await systemsService.listPublic();
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async loadAdmin() {
      this.loading = true;
      this.error = null;
      try {
        this.list = await systemsService.listAdmin();
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      const row = await systemsService.create(payload);
      await this.loadAdmin();
      return row;
    },

    async update(id, payload) {
      const row = await systemsService.update(id, payload);
      await this.loadAdmin();
      return row;
    },

    async remove(id) {
      await systemsService.remove(id);
      await this.loadAdmin();
    },

    async reorder(ids) {
      this.list = await systemsService.reorder(ids);
    },
  },
});
