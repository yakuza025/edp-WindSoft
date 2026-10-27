import { query, transaction } from '../config/db.js';

export async function listActive() {
  return query('SELECT * FROM systems WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
}

export async function listAll() {
  return query('SELECT * FROM systems ORDER BY sort_order ASC, id ASC');
}

export async function findBySlug(slug) {
  const rows = await query('SELECT * FROM systems WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] || null;
}

export async function findById(id) {
  const rows = await query('SELECT * FROM systems WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function nextSortOrder() {
  const [row] = await query('SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM systems');
  return Number(row.n);
}

export async function create(payload) {
  const order = payload.sort_order ?? (await nextSortOrder());
  const result = await query(
    `INSERT INTO systems (slug, name, tagline, host, path, color, icon, features, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.slug,
      payload.name,
      payload.tagline || '',
      payload.host,
      payload.path || '/',
      payload.color || '#3b82f6',
      payload.icon || '🚀',
      JSON.stringify(payload.features || []),
      order,
      payload.is_active ? 1 : 0,
    ]
  );
  return findById(result.insertId);
}

export async function update(id, existing, payload) {
  const merged = {
    slug:       payload.slug       ?? existing.slug,
    name:       payload.name       ?? existing.name,
    tagline:    payload.tagline    ?? existing.tagline,
    host:       payload.host       ?? existing.host,
    path:       payload.path       ?? existing.path,
    color:      payload.color      ?? existing.color,
    icon:       payload.icon       ?? existing.icon,
    features:   payload.features   ?? JSON.parse(existing.features || '[]'),
    sort_order: payload.sort_order ?? existing.sort_order,
    is_active:  payload.is_active  ?? existing.is_active,
  };

  await query(
    `UPDATE systems SET
      slug = ?, name = ?, tagline = ?, host = ?, path = ?, color = ?, icon = ?,
      features = ?, sort_order = ?, is_active = ?
     WHERE id = ?`,
    [
      merged.slug,
      merged.name,
      merged.tagline,
      merged.host,
      merged.path,
      merged.color,
      merged.icon,
      JSON.stringify(merged.features),
      merged.sort_order,
      merged.is_active ? 1 : 0,
      id,
    ]
  );
  return findById(id);
}

export async function remove(id) {
  const result = await query('DELETE FROM systems WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function reorder(ids) {
  await transaction(async (conn) => {
    for (let i = 0; i < ids.length; i++) {
      await conn.execute('UPDATE systems SET sort_order = ? WHERE id = ?', [i, ids[i]]);
    }
  });
  return listAll();
}
