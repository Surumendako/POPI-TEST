
const CACHE_NAME = 'popi-cache-v1';
const urlsToCache = [
'/TEST-POPI/THE-POPI-TEST/index.html',
'/TEST-POPI/THE-POPI-TEST/index.css',
'/TEST-POPI/THE-POPI-TEST/index.js',

'/TEST-POPI/THE-POPI-TEST/test-ch.html',
'/TEST-POPI/THE-POPI-TEST/test-ch.css',
'/TEST-POPI/THE-POPI-TEST/test-ch.js',

'/TEST-POPI/THE-POPI-TEST/test-que.html',
'/TEST-POPI/THE-POPI-TEST/test-que.css',
'/TEST-POPI/THE-POPI-TEST/test-que.js',

'/TEST-POPI/THE-POPI-TEST/test-quemo.js',

'/TEST-POPI/THE-POPI-TEST/pic/stop.png',
'/TEST-POPI/THE-POPI-TEST/pic/retry.png',
'/TEST-POPI/THE-POPI-TEST/pic/start.png',
'/TEST-POPI/THE-POPI-TEST/pic/quemo-check.png',
'/TEST-POPI/THE-POPI-TEST/pic/back.png',
'/TEST-POPI/THE-POPI-TEST/pic/next.png',

'/TEST-POPI/THE-POPI-TEST/pic/buu.png',
'/TEST-POPI/THE-POPI-TEST/pic/poo.png',
'/TEST-POPI/THE-POPI-TEST/pic/TEST-rogo.png',

'/TEST-POPI/THE-POPI-TEST/pic/icon/TEST.png',

'/TEST-POPI/THE-POPI-TEST/pic/key/a.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/b.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/c.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/d.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/e.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/f.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/g.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/h.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/i.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/j.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/k.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/l.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/m.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/n.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/o.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/p.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/q.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/r.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/s.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/t.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/u.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/v.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/w.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/x.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/y.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/z.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/-.png',

'/TEST-POPI/THE-POPI-TEST/pic/key/delete.png',
'/TEST-POPI/THE-POPI-TEST/pic/key/ansewer.png'
];

self.addEventListener('install', event => {
  console.log('[SW] インストール中…');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] アクティブ化');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/TEST/THE-POPI-TEST/index.html');
        }
      })
  );
});
