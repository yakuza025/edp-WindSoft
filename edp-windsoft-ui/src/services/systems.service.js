import { systemsApi } from '@/api';

export async function listPublic() {
  const r = await systemsApi.listPublic();
  return r.data || [];
}

export async function listAdmin() {
  const r = await systemsApi.listAdmin();
  return r.data || [];
}

export async function create(payload) {
  const r = await systemsApi.create(payload);
  return r.data;
}

export async function update(id, payload) {
  const r = await systemsApi.update(id, payload);
  return r.data;
}

export async function remove(id) {
  await systemsApi.remove(id);
}

export async function reorder(ids) {
  const r = await systemsApi.reorder(ids);
  return r.data || [];
}
