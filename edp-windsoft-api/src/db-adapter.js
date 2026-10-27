// ═══════════════════════════════════════════════════════════════════
// db-adapter — self-loads .env, then creates a mysql2 pool.
// Guarantees all() always returns an ARRAY (fixes .map() 500s).
// ═══════════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ENV_PATH   = resolve(__dirname, '..', '.env');

// ── 1. Self-load .env (works under PM2 without --env) ─────────────
try {
  const content = readFileSync(ENV_PATH, 'utf8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
  console.log(`[db-adapter] loaded .env from ${ENV_PATH}`);
} catch (e) {
  console.warn(`[db-adapter] could not read ${ENV_PATH}: ${e.message}`);
}

// ── 2. Connect ────────────────────────────────────────────────────
const { default: mysql } = await import('mysql2/promise');

const DB_HOST     = process.env.DB_HOST     || '192.168.13.81';
const DB_PORT     = process.env.DB_PORT     || '3306';
const DB_USER     = process.env.DB_USER     || 'adm1n';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME     = process.env.DB_NAME     || 'edp_windsoft';

console.log(`[db-adapter] target: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

pool.query('SELECT 1 AS ok').then(
  () => console.log(`[db-adapter] ✓ connected to ${DB_NAME}`),
  (e) => console.error(`[db-adapter] ✗ connection failed: ${e.code || e.message}`),
);

// ── 3. Public API — all() ALWAYS returns an array ─────────────────
export async function all(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return Array.isArray(rows) ? rows : [];
}

export async function get(sql, params = []) {
  const rows = await all(sql, params);
  return rows[0] ?? null;
}

export async function run(sql, params = []) {
  const [result] = await pool.query(sql, params);
  return {
    changes: result.affectedRows ?? 0,
    lastID: result.insertId ?? null,
  };
}

export { pool as rawPool };
