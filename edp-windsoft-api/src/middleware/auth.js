// ── Admin key middleware ──
// Validates X-Admin-Key header against ADMIN_KEY env var.
// If ADMIN_KEY is not set (dev mode), requests pass through.
export function requireAdminKey(req, res, next) {
  const expected = process.env.ADMIN_KEY;

  // No key configured → dev mode, allow through
  if (!expected) return next();

  const provided =
    req.headers['x-admin-key'] ||
    req.headers['X-Admin-Key'] ||
    req.headers['x-admin-api-key'];

  if (!provided || provided !== expected) {
    return res.status(401).json({
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Admin key required or invalid',
      },
    });
  }
  next();
}
