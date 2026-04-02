// CKP\u30b7\u30df\u30e5\u30ec\u30fc\u30bf\u30fc Service Worker
var CACHE_NAME = 'ckp-simulator-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// \u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u6642\u306b\u5168\u30a2\u30bb\u30c3\u30c8\u3092\u30ad\u30e3\u30c3\u30b7\u30e5
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// \u53e4\u3044\u30ad\u30e3\u30c3\u30b7\u30e5\u3092\u524a\u9664
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// \u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30a1\u30fc\u30b9\u30c8\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30d5\u30a9\u30fc\u30eb\u30d0\u30c3\u30af
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function() {
      // \u30aa\u30d5\u30e9\u30a4\u30f3\u6642\u306b\u30ad\u30e3\u30c3\u30b7\u30e5\u306b\u3082\u306a\u3044\u5834\u5408
      return caches.match('./index.html');
    })
  );
});
