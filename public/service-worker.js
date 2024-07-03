// var cacheName = 'petstore-v1';
// var cacheFiles = [
//     './index.html',
//     './webstore.webmanifest',
 
// ];
 
// self.addEventListener('install', (e) => {
//     console.log('service-worker')
//     e.waitUntil(
//         caches.open(cacheName).then((cache) =>{
//             console.log('[Service Worker] Caching all the files');
//             return cache.addAll(cacheFiles)
//         })
//     );
// });
 
// self.addEventListener('fetch', function(e) {
//     e.respondWith(
//         caches.match(e.request).then(function(r) {
//             // Download the file if it is not in the cache
//             return r || fetch(e.request).then(function(response) {
//                 // Add the new file to cache
//                 return caches.open(cacheName).then(function(cache) {
//                     cache.put(e.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });

var cacheName = 'petstore-v1';
var cacheFiles = [];

self.addEventListener('install', (e) => {
    console.log('service-worker')
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("fetch", (event) => {
    var allowedUrls = [self.location.origin, "https://i.gyazo.com/"];
    if (!allowedUrls.some((url) => event.request.url.startsWith(url))) {
      return;
    }
  
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
  
        return caches.open(cacheName).then((cache) => {
          return fetch(event.request).then((response) => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  });self.addEventListener("fetch", (event) => {
  var allowedUrls = [self.location.origin];
  if (!allowedUrls.some((url) => event.request.url.startsWith(url))) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(cacheName).then((cache) => {
        return fetch(event.request).then((response) => {
          // Put a copy of the response in the runtime cache.
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });
    })
  );
});
