/* PitchWatch service worker. Bump CACHE_VERSION when you release a new build. */
const CACHE_VERSION = 'pitchwatch-v1.2.0-agent-phase4';
const APP_SHELL = [
  './','./index.html','./manifest.webmanifest','./pitchwatch-icon.svg','./icons/icon-192.png','./icons/icon-512.png',
  './llms.txt','./llms-full.txt','./agent-guide.md','./agent-actions.json',
  './docs/getting-started.html','./docs/templates.html','./docs/agent-actions.html','./docs/template-format.md','./docs/action-policy.md','./docs/privacy-agent-policy.md'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone(); caches.open(CACHE_VERSION).then(cache => cache.put(req, copy)); return res;
  }).catch(() => cached)));
});
