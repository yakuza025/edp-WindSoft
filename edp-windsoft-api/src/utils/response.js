export function ok(res, data, meta = null, status = 200) {
  const body = { ok: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

export function fail(res, message, status = 400, code = null) {
  const body = { ok: false, error: { message } };
  if (code) body.error.code = code;
  return res.status(status).json(body);
}
