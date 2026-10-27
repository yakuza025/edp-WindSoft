import { faqApi } from '@/api';

export async function listPublic()  { const r = await faqApi.listPublic();  return r || []; }
export async function listAdmin()   { const r = await faqApi.listAdmin();   return r || []; }
export async function create(p)     { return faqApi.create(p); }
export async function update(id, p) { return faqApi.update(id, p); }
export async function remove(id)    { await faqApi.remove(id); }
export async function reorder(ids)  { return faqApi.reorder(ids); }
