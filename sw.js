const CACHE_NAME = 'tas-spb-v1';
const ASSETS = [
    './',
    './index.html',
    './login.html',
    './manifest.json',
    './logo.png',
    './favicon.png',
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ติดตั้ง Service Worker และเก็บไฟล์ลง Cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ทำงานเมื่อมีการเรียกไฟล์ (Fetch)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
