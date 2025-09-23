const CACHE_NAME = 'ecotech-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/navbar.css',
  '/script.js',
  '/frontend/favicon_io/android-chrome-192x192.png',
  '/frontend/favicon_io/android-chrome-512x512.png',
  '/frontend/primary/primary.html',
  '/frontend/primary/primary.css',
  '/frontend/primary/primary.js',
  '/frontend/middle/middle.html',
  '/frontend/middle/middle.css',
  '/frontend/middle/middle.js',
  '/frontend/secondary/secondary.html',
  '/frontend/secondary/secondary.css',
  '/frontend/secondary/secondary.js',
  '/frontend/high/high.html',
  '/frontend/high/high.css',
  '/frontend/high/high.js',
  '/frontend/uni/uni.html',
  '/frontend/uni/uni.css',
  '/frontend/uni/uni.js',
  '/frontend/NGO/index.html',
  '/frontend/NGO/style.css',
  '/frontend/NGO/script.js',
  '/frontend/teacher_hub/index.html',
  '/frontend/teacher_hub/style.css',
  '/frontend/teacher_hub/script.js',
  '/frontend/friends/index.html',
  '/frontend/friends/style.css',
  '/frontend/friends/script.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
