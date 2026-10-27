import { Router } from 'express';
import { requireAdminKey } from '../middleware/auth.js';
import { all, get, run } from '../db-adapter.js';

const router = Router();

// ── PUBLIC ─────────────────────────────────────────────────────
router.get('/faq', async (req, res, next) => {
  try {
    const rows = await all(
      `SELECT * FROM faq_items WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ── ADMIN ──────────────────────────────────────────────────────
router.get('/admin/faq', requireAdminKey, async (req, res, next) => {
  try {
    const rows = await all(`SELECT * FROM faq_items ORDER BY sort_order ASC, id ASC`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/admin/faq', requireAdminKey, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.question || !b.answer) {
      return res.status(400).json({ error: { message: 'question and answer required' } });
    }
    const r = await run(
      `INSERT INTO faq_items (question, answer, sort_order, is_active) VALUES (?, ?, ?, ?)`,
      [b.question.trim(), b.answer.trim(), Number(b.sort_order ?? 0), b.is_active ? 1 : 0]
    );
    res.status(201).json(await get(`SELECT * FROM faq_items WHERE id = ?`, [r.lastID]));
  } catch (e) { next(e); }
});

router.put('/admin/faq/:id', requireAdminKey, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await get(`SELECT * FROM faq_items WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ error: { message: 'Not found' } });
    const b = req.body || {};
    await run(
      `UPDATE faq_items SET question=?, answer=?, sort_order=?, is_active=? WHERE id=?`,
      [
        b.question?.trim() ?? existing.question,
        b.answer?.trim() ?? existing.answer,
        Number(b.sort_order ?? existing.sort_order),
        b.is_active != null ? (b.is_active ? 1 : 0) : existing.is_active,
        id,
      ]
    );
    res.json(await get(`SELECT * FROM faq_items WHERE id = ?`, [id]));
  } catch (e) { next(e); }
});

router.delete('/admin/faq/:id', requireAdminKey, async (req, res, next) => {
  try {
    await run(`DELETE FROM faq_items WHERE id = ?`, [Number(req.params.id)]);
    res.status(204).end();
  } catch (e) { next(e); }
});

router.post('/admin/faq/reorder', requireAdminKey, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    for (let i = 0; i < ids.length; i++) {
      await run(`UPDATE faq_items SET sort_order=? WHERE id=?`, [i, Number(ids[i])]);
    }
    res.json(await all(`SELECT * FROM faq_items ORDER BY sort_order ASC, id ASC`));
  } catch (e) { next(e); }
});

export default router;
