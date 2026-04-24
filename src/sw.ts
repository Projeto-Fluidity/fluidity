/// <reference lib="webworker" />

/**
 * Cast explícito para evitar conflito com DOM typings
 */
const sw = self as unknown as ServiceWorkerGlobalScope;

/**
 * ============================================================
 * PUSH EVENT
 * ============================================================
 */
sw.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  const data = event.data.json();

  const title = data.title || "Fluidity";

  const options: NotificationOptions = {
    body: data.body,
    icon: "/icons/192.png",
    badge: "/icons/192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    sw.registration.showNotification(title, options)
  );
});

/**
 * ============================================================
 * CLICK NA NOTIFICAÇÃO
 * ============================================================
 */
sw.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    sw.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            return client.focus();
          }
        }

        return sw.clients.openWindow(urlToOpen);
      })
  );
});