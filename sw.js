import { precacheAndRoute } from "workbox-precaching";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

const CACHE_NAME = "my-cache-v1";
const URLS_TO_CACHE = [
  "/src/assets/error.svg",
  // Add other assets to cache
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Check if the request is cached
      if (response) {
        return response;
      }
      // Fetch from the network and cache if necessary
      return fetch(event.request).catch(() => {
        // Fallback to cached fallback image when offline
        if (event.request.url.endsWith(".svg")) {
          // Adjust as needed
          return caches.match("/src/assets/error.svg");
        }
      });
    })
  );
});
// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);
