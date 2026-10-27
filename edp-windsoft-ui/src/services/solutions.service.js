import { solutionsApi } from '@/api';

export async function listPublic()  { const r = await solutionsApi.listPublic();  return r || []; }
export async function getBySlug(slug) { return solutionsApi.getBySlug(slug); }
export async function listAdmin()   { const r = await solutionsApi.listAdmin();   return r || []; }
export async function create(p)     { return solutionsApi.create(p); }
export async function update(id, p) { return solutionsApi.update(id, p); }
export async function remove(id)    { await solutionsApi.remove(id); }
export async function reorder(ids)  { const r = await solutionsApi.reorder(ids);  return r || []; }
