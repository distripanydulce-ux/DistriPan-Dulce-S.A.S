// DistriPan & Dulce · permite abrir la app sin señal
// Siempre intenta traer la versión nueva; si no hay internet, usa la guardada.
const CACHE = 'distripan-v1';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])).catch(() => {}));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET') return;
  // Datos en vivo (Supabase, Cámaras de Comercio): nunca se guardan aquí
  if (u.hostname.endsWith('supabase.co') || u.hostname.endsWith('datos.gov.co')) return;
  e.respondWith(
    fetch(req).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return r;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
