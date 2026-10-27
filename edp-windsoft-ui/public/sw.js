/* WindSoft showcase — minimal service worker
   - Static assets: cache-first (fast repeat loads)
   - API calls: network-first (always fresh data)
   - Everything else: network with cache fallback
*/
const VERSION = 'v1';
const STATIC_CACHE = `windsoft-static-${VERSION}`;
const RUNTIME_CACHE = `windsoft-runtime-${VERSION}`;

const PRECACHE = [
  '/',
  '/manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Never cache API responses — always live data
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(req).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Same-origin GET only
  if (req.method === 'GET' && url.origin === self.location.origin) {
    // Static assets (hashed) → cache-first
    if (/\.(js|css|woff2?|png|svg|webp|avif|ico)$/.test(url.pathname)) {
      e.respondWith(
        caches.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            return res;
          });
        })
      );
      return;
    }

    // HTML navigation → network-first, cache fallback
    if (req.mode === 'navigate') {
      e.respondWith(
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
            return res;
          })
          .catch(() => caches.match('/').then((r) => r || caches.match(req)))
      );
    }
  }
});
