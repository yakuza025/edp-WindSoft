import * as settings from '../services/settings.service.js';
import { ok } from '../utils/response.js';

export async function getPublic(req, res, next) {
  try {
    return ok(res, await settings.getAll());
  } catch (e) { next(e); }
}

export async function saveAdmin(req, res, next) {
  try {
    const saved = await settings.saveMany(req.body || {});
    return ok(res, saved);
  } catch (e) { next(e); }
}
