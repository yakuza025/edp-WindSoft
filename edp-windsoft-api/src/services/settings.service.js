import { query, transaction } from '../config/db.js';

export async function getAll() {
  const rows = await query('SELECT `key`, value FROM settings');
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function saveMany(settings) {
  await transaction(async (conn) => {
    for (const [k, v] of Object.entries(settings)) {
      await conn.execute(
        'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [k, String(v)]
      );
    }
  });
  return getAll();
}
