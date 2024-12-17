const CACHE_NAME = 'Cricket-cache-v1';
const urlsToCache = [
    '/myPWA/frontend/',
    '/myPWA/frontend/homepage.html',
    '/myPWA/frontend/index.html',
    '/myPWA/frontend/batting.html',
    '/myPWA/frontend/bowling.html',
    '/myPWA/frontend/sessionsStats.html',
    '/myPWA/frontend/style.css',
    '/myPWA/frontend/script.js',
    '/myPWA/frontend/logo.png',
    '/myPWA/Icons/logo1.png',
    '/myPWA/Icons/logo2.png',
    '/myPWA/Icons/desktop.png',
    '/myPWA/Icons/phone.png',
];
// Install the service worker
// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});




// Fetch requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return the cached response if found, otherwise fetch from network
            return response || fetch(event.request).catch(() => caches.match('/myPWA/frontend/homepage.html'));
        })
    );
});


// Activate the service worker


// Activate event
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});