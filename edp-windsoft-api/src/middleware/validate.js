import { fail } from '../utils/response.js';

export function validateSystemBody(req, res, next) {
  const { slug, name, host } = req.body || {};
  if (!slug || !name || !host) {
    return fail(res, 'slug, name, and host are required', 400, 'VALIDATION');
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return fail(res, 'slug must be lowercase letters, digits, or dashes', 400, 'VALIDATION');
  }
  next();
}

export function validateReorderBody(req, res, next) {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return fail(res, 'ids must be a non-empty array of numbers', 400, 'VALIDATION');
  }
  next();
}
