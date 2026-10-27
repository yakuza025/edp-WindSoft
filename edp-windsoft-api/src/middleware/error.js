import { fail } from '../utils/response.js';

export function notFound(req, res) {
  return fail(res, `Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND');
}

export function errorHandler(err, req, res, _next) {
  console.error('[error]', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  const status = err.status || err.statusCode || 500;
  return fail(res, err.message || 'Internal server error', status, err.code || 'INTERNAL');
}
