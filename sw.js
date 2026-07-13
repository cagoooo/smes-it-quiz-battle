const BUILD_VERSION = '2026.07.13-7';
const CACHE_NAME = `smes-it-quiz-battle-${BUILD_VERSION}`;
const PRECACHE = [
  './',
  './index.html',
  `./style.css?v=${BUILD_VERSION}`,
  `./game.js?v=${BUILD_VERSION}`,
  `./sw-register.js?v=${BUILD_VERSION}`,
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', event => {
  // 保留 waiting 狀態，讓學生可在一回合結束後自行選擇更新。
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(PRECACHE.map(url => cache.add(url)))));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('smes-it-quiz-battle-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const cacheCopy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, cacheCopy)).catch(() => {}));
      }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html'))));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && response.type === 'basic') {
      const cacheCopy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, cacheCopy)).catch(() => {}));
    }
    return response;
  })));
});
