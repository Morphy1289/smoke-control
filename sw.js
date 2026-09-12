const CACHE_NAME = 'smoke-control-v1';
const CORE_ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Оболочку приложения отдаём из кэша (быстрый старт), запросы к Supabase — всегда идут в сеть
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('supabase.co')) return;
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
