import { settingsApi } from '@/api';

export async function getPublic() {
  const r = await settingsApi.getPublic();
  return r.data || {};
}

export async function saveAdmin(payload) {
  const r = await settingsApi.saveAdmin(payload);
  return r.data || {};
}
