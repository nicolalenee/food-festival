const APP_PREFIX = 'FoodFest-';
const VERSION ="version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// define which files we'd like to cache
const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  // "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js"
];

// install the service worker and add files to the precache
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// activate then service worker and clear out any old data from the cache and tell the service worker how to manage caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    // returns all cache names as keyList array
    caches.keys().then(function (keyList) {
      // capture the caches that have the correct app prefix in array
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })

      cacheKeeplist.push(CACHE_NAME);

      // returns a promise that resolves once all old versions of the cache have been deleted
      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          // if this key isn't found in the cache list, delete it from the cache
          console.log('deleting cache: ' + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }))
    })
  )
})

// intercept fetch requests by telling the browser how to retrieve information from the cache

// listen for the fetch event
self.addEventListener('fetch', function(e) {
  // console.log the url of the requested resource
  console.log('fetch request : ' + e.request.url)
  // define how we will respond to the request
  e.respondWith(
    // check to see if the request/resource is stored in the cache or not
    caches.match(e.request).then(function (request) {
      // if the resource is stored in the cache, return it
      if (request) {
        console.log('responding with cache : ' + e.request.url)
        return request;
        // if the resource is not in the cache, allow the resource to be retrieved from teh online network as usual
      } else {
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }
    })
  )
})