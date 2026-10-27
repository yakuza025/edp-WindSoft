import * as systems from '../services/systems.service.js';
import { ok, fail } from '../utils/response.js';
import { hydrateSystem, hydrateSystems } from '../utils/hydrate.js';

/* ── Public ─────────────────────────────────────────────── */
export async function listPublic(req, res, next) {
  try {
    const rows = await systems.listActive();
    return ok(res, hydrateSystems(rows), { total: rows.length });
  } catch (e) { next(e); }
}

export async function showPublic(req, res, next) {
  try {
    const row = await systems.findBySlug(req.params.slug);
    if (!row || !row.is_active) return fail(res, 'System not found', 404);
    return ok(res, hydrateSystem(row));
  } catch (e) { next(e); }
}

/* ── Admin ──────────────────────────────────────────────── */
export async function listAdmin(req, res, next) {
  try {
    const rows = await systems.listAll();
    return ok(res, hydrateSystems(rows), { total: rows.length });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const row = await systems.create(req.body || {});
    return ok(res, hydrateSystem(row), null, 201);
  } catch (e) {
    if (/Duplicate entry/i.test(e.message)) {
      return fail(res, `slug "${req.body?.slug}" already exists`, 409, 'DUPLICATE');
    }
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const existing = await systems.findById(req.params.id);
    if (!existing) return fail(res, 'System not found', 404);

    const row = await systems.update(req.params.id, existing, req.body || {});
    return ok(res, hydrateSystem(row));
  } catch (e) {
    if (/Duplicate entry/i.test(e.message)) {
      return fail(res, 'slug already in use', 409, 'DUPLICATE');
    }
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await systems.remove(req.params.id);
    if (!deleted) return fail(res, 'System not found', 404);
    return ok(res, { deleted: true });
  } catch (e) { next(e); }
}

export async function reorder(req, res, next) {
  try {
    const rows = await systems.reorder(req.body.ids);
    return ok(res, hydrateSystems(rows));
  } catch (e) { next(e); }
}
