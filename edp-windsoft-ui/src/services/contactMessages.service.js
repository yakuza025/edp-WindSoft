import { contactMessagesApi } from '@/api';

export async function submit(payload) { return contactMessagesApi.submit(payload); }
export async function listAdmin()      { const r = await contactMessagesApi.listAdmin(); return r || []; }
export async function markRead(id, read) { return contactMessagesApi.markRead(id, read); }
export async function remove(id)       { await contactMessagesApi.remove(id); }
