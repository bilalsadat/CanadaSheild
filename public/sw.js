/* KinShield service worker — offline shell + safe caching.
 * - Never caches /api (always live).
 * - Navigations: network-first, fall back to cached shell when offline.
 * - Same-origin static GETs: stale-while-revalidate.
 */
const CACHE = "kinshield-v1";
const SHELL = ["/", "/features", "/map", "/offline"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (map tiles) pass through
  if (url.pathname.startsWith("/api")) return; // never cache the engine

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => { cachePut(request, res.clone()); return res; })
        .catch(() => caches.match(request).then((c) => c || caches.match("/") || caches.match("/offline"))),
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => { cachePut(request, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});

function cachePut(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") return;
  caches.open(CACHE).then((c) => c.put(request, response)).catch(() => {});
}
