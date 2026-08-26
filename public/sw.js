// App-shell caching for low-bandwidth access. API requests are never cached.
const CACHE_NAME = "hajcare-shell-v5";
const APP_SHELL = ["/", "/favicon.ico", "/manifest.webmanifest"];
const NETWORK_TIMEOUT_MS = 8000;

const fetchWithTimeout = (request) => Promise.race([
  fetch(request),
  new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout")), NETWORK_TIMEOUT_MS)),
]);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  const cacheResponse = (response) => {
    if (response.ok) {
      caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    }
    return response;
  };

  if (request.mode === "navigate") {
    // Always prefer the current HTML after a deployment. Serving an old index
    // with deleted Vite chunks causes a blank screen/dynamic-import failure.
    event.respondWith(fetchWithTimeout(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
      return response;
    }).catch(() => caches.match("/").then((cached) => cached || caches.match("/index.html"))));
    return;
  }

  // Network-first for hashed build assets prevents stale chunks after release;
  // cache remains a low-bandwidth/offline fallback.
  event.respondWith(fetchWithTimeout(request).then(cacheResponse).catch(() => caches.match(request)));
});

// Service Worker for Push Notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "HajCare AI", body: event.data.text() };
  }
  const options = {
    body: data.body,
    icon: data.icon || "/favicon.ico",
    badge: data.badge || "/favicon.ico",
    tag: data.tag,
    data: data.data,
    vibrate: [200, 100, 200],
    requireInteraction: data.data?.url ? true : false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const requestedUrl = event.notification.data?.url;
  let url = "/";
  try {
    const parsed = new URL(requestedUrl || "/", self.location.origin);
    if (parsed.origin === self.location.origin) url = `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch { /* Use the safe home route. */ }
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
