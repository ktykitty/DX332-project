const CACHE_NAME = 'wellness-app-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png'
];

// ติดตั้ง Service Worker และแคชไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// ดึงไฟล์จากแคชเมื่อผู้ใช้ไม่ได้ต่ออินเทอร์เน็ต (Offline Mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // คืนค่าไฟล์จากแคชถ้ามี
        }
        return fetch(event.request); // หรือดึงจากเน็ตถ้าไม่มีในแคช
      })
  );
});

// อัปเดตแคชเมื่อมีการแก้ไขไฟล์
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
