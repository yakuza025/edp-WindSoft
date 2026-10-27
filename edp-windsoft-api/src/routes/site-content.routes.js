import { Router } from 'express';
import { requireAdminKey } from '../middleware/auth.js';
import { get, run } from '../db-adapter.js';

const router = Router();

const FIELDS = [
  'about_title', 'about_body',
  'highlight_1_icon', 'highlight_1_title', 'highlight_1_text',
  'highlight_2_icon', 'highlight_2_title', 'highlight_2_text',
  'highlight_3_icon', 'highlight_3_title', 'highlight_3_text',
  'contact_headline', 'contact_description',
  'contact_email', 'contact_phone', 'contact_address', 'contact_hours',
  'contact_cta_label', 'contact_cta_href',
  'social_linkedin', 'social_twitter', 'social_facebook', 'social_github',
  'footer_text',
];

async function load() {
  let row = await get(`SELECT * FROM site_content WHERE id = 1`);
  if (!row) {
    await run(`INSERT INTO site_content (id, updated_at) VALUES (1, CURRENT_TIMESTAMP)`);
    row = await get(`SELECT * FROM site_content WHERE id = 1`);
  }
  return row;
}

router.get('/site-content', async (req, res, next) => {
  try { res.json(await load()); } catch (e) { next(e); }
});

router.put('/admin/site-content', requireAdminKey, async (req, res, next) => {
  try {
    const b = req.body || {};
    const setClauses = FIELDS.map((f) => `${f} = ?`).join(', ');
    const params = FIELDS.map((f) => (b[f] ?? null));
    await run(`UPDATE site_content SET ${setClauses}, updated_at=CURRENT_TIMESTAMP WHERE id = 1`, params);
    res.json(await get(`SELECT * FROM site_content WHERE id = 1`));
  } catch (e) { next(e); }
});

export default router;
