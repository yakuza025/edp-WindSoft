import { Router } from 'express';
import { requireAdminKey } from '../middleware/auth.js';
import { all, get, run } from '../db-adapter.js';

const router = Router();

// ── PUBLIC: form submission ──
router.post('/contact-messages', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (b.website) return res.status(201).json({ ok: true }); // honeypot

    const name    = String(b.name    || '').trim();
    const email   = String(b.email   || '').trim();
    const message = String(b.message || '').trim();

    if (!name || name.length > 120)
      return res.status(400).json({ error: { message: 'Name required (max 120)' } });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: { message: 'Valid email required' } });
    if (!message || message.length < 10 || message.length > 5000)
      return res.status(400).json({ error: { message: 'Message 10–5000 chars required' } });

    await run(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`,
      [name, email, String(b.phone || '').trim() || null, String(b.subject || '').trim() || null, message]
    );
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

// ── ADMIN ──
router.get('/admin/contact-messages', requireAdminKey, async (req, res, next) => {
  try {
    const rows = await all(`SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC LIMIT 500`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.patch('/admin/contact-messages/:id', requireAdminKey, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const isRead = req.body?.is_read ? 1 : 0;
    await run(`UPDATE contact_messages SET is_read = ? WHERE id = ?`, [isRead, id]);
    res.json(await get(`SELECT * FROM contact_messages WHERE id = ?`, [id]));
  } catch (e) { next(e); }
});

router.delete('/admin/contact-messages/:id', requireAdminKey, async (req, res, next) => {
  try {
    await run(`DELETE FROM contact_messages WHERE id = ?`, [Number(req.params.id)]);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
