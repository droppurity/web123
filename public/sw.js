
self.addEventListener('push', function (event) {
    const data = event.data.json();
    const title = data.title || 'New Lead';
    const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: {
            url: data.url
        }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
