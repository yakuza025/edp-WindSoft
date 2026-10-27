import { Router } from 'express';
import { all } from '../db-adapter.js';

const router = Router();

const SITE_URL = process.env.SITE_URL || 'https://windsoft.example';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// GET /sitemap.xml  — dynamic, includes live solution slugs
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const solutions = await all(
      `SELECT slug, updated_at FROM solutions WHERE is_active = 1 ORDER BY sort_order ASC`
    );

    const now = new Date().toISOString().slice(0, 10);

    const urls = [
      { loc: `${SITE_URL}/`, lastmod: now, priority: '1.0', changefreq: 'weekly' },
      ...solutions.map((s) => ({
        loc: `${SITE_URL}/solutions/${esc(s.slug)}`,
        lastmod: s.updated_at
          ? String(s.updated_at).slice(0, 10)
          : now,
        priority: '0.8',
        changefreq: 'monthly',
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  } catch (e) { next(e); }
});

export default router;
