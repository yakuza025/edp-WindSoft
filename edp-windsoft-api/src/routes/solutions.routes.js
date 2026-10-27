import { Router } from 'express';
import { requireAdminKey } from '../middleware/auth.js';
import { all, get, run } from '../db-adapter.js';

const router = Router();

function shape(row) {
  if (!row) return null;
  let features = [];
  try { features = JSON.parse(row.features || '[]'); } catch {}
  if (!Array.isArray(features)) features = [];
  return { ...row, features, is_active: !!row.is_active };
}

// ── PUBLIC ──
router.get('/solutions', async (req, res, next) => {
  try {
    const rows = await all(
      `SELECT * FROM solutions WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    res.json(rows.map(shape));
  } catch (e) { next(e); }
});


// GET /solutions/:slug  (public, for detail pages)
router.get('/solutions/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug || '').trim();
    if (!slug) return res.status(400).json({ error: { message: 'slug required' } });
    const row = await get(
      `SELECT * FROM solutions WHERE slug = ? AND is_active = 1 LIMIT 1`,
      [slug]
    );
    if (!row) return res.status(404).json({ error: { message: 'Solution not found' } });
    res.json(shape(row));
  } catch (e) { next(e); }
});

// ── ADMIN ──
router.get('/admin/solutions', requireAdminKey, async (req, res, next) => {
  try {
    const rows = await all(`SELECT * FROM solutions ORDER BY sort_order ASC, id ASC`);
    res.json(rows.map(shape));
  } catch (e) { next(e); }
});

router.post('/admin/solutions', requireAdminKey, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.slug || !b.title) return res.status(400).json({ error: { message: 'slug and title required' } });
    const features = JSON.stringify(Array.isArray(b.features) ? b.features : []);
    const r = await run(
      `INSERT INTO solutions (slug, title, subtitle, description, icon, color, category, features, cta_label, cta_href, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.slug.trim(), b.title.trim(), b.subtitle || null, b.description || null,
       b.icon || '🚀', b.color || '#4f46e5', b.category || null, features,
       b.cta_label || 'Learn more', b.cta_href || null,
       Number(b.sort_order ?? 0), b.is_active ? 1 : 0]
    );
    const row = await get(`SELECT * FROM solutions WHERE id = ?`, [r.lastID]);
    res.status(201).json(shape(row));
  } catch (e) { next(e); }
});

router.put('/admin/solutions/:id', requireAdminKey, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await get(`SELECT * FROM solutions WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ error: { message: 'Not found' } });
    const b = req.body || {};
    const features = Array.isArray(b.features) ? JSON.stringify(b.features) : existing.features;
    await run(
      `UPDATE solutions SET slug=?, title=?, subtitle=?, description=?, icon=?, color=?, category=?, features=?, cta_label=?, cta_href=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [b.slug?.trim() ?? existing.slug, b.title?.trim() ?? existing.title,
       b.subtitle ?? existing.subtitle, b.description ?? existing.description,
       b.icon ?? existing.icon, b.color ?? existing.color, b.category ?? existing.category,
       features, b.cta_label ?? existing.cta_label, b.cta_href ?? existing.cta_href,
       Number(b.sort_order ?? existing.sort_order),
       b.is_active != null ? (b.is_active ? 1 : 0) : existing.is_active, id]
    );
    const row = await get(`SELECT * FROM solutions WHERE id = ?`, [id]);
    res.json(shape(row));
  } catch (e) { next(e); }
});

router.delete('/admin/solutions/:id', requireAdminKey, async (req, res, next) => {
  try {
    await run(`DELETE FROM solutions WHERE id = ?`, [Number(req.params.id)]);
    res.status(204).end();
  } catch (e) { next(e); }
});

router.post('/admin/solutions/reorder', requireAdminKey, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    for (let i = 0; i < ids.length; i++) {
      await run(`UPDATE solutions SET sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`, [i, Number(ids[i])]);
    }
    const rows = await all(`SELECT * FROM solutions ORDER BY sort_order ASC, id ASC`);
    res.json(rows.map(shape));
  } catch (e) { next(e); }
});

export default router;
