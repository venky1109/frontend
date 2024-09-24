/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */



self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Perform install steps (e.g., caching resources)
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    // Perform activate steps (e.g., cleaning up old caches)
  });
  
  self.addEventListener('fetch', (event) => {
    // console.log('Fetching:', event.request.url);
    // Handle fetch events (e.g., serving cached content)
  });
  