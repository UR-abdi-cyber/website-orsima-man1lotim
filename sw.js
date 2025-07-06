const CACHE_NAME = 'orsima-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/syle.css',
  '/script.js',
  '/img/logoorsima.png',
  '/img/kepala madrasah.png',
  '/img/Waka (1).png',
  '/img/pembina.png',
  '/img/ketua orsima.png',
  '/img/wakil orsima.png',
  '/img/sekretaris1.png',
  '/img/sekretaris 2.png',
  '/img/bendahara 1.png',
  '/img/bendahara 2.png',
  '/img/co keagamaan.png',
  '/img/co it dan kreativitas siswa.png',
  '/img/co Organisasi dan kepemimpinan.png',
  '/img/co olahraga.png',
  '/img/co bela negara.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Ada update terbaru dari ORSIMA!',
    icon: '/img/logoorsima.png',
    badge: '/img/logoorsima.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('ORSIMA MAN 1 Lombok Timur', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});