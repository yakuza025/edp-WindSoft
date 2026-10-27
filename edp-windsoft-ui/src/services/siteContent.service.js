import { siteContentApi } from '@/api';

export async function getPublic()      { const r = await siteContentApi.getPublic(); return r || {}; }
export async function saveAdmin(body)  { const r = await siteContentApi.saveAdmin(body); return r || {}; }
