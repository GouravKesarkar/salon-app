// sw.js — simple static cache-first service worker
const CACHE = 'gentle-v1';
const ASSETS = [
  '/', '/index.html', '/manifest.json'
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', ev => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if(req.method !== 'GET') return;
  ev.respondWith(caches.match(req).then(r => r || fetch(req).then(fres => {
    return caches.open(CACHE).then(c => { c.put(req, fres.clone()); return fres; });
  })).catch(()=>caches.match('/index.html')));
});
