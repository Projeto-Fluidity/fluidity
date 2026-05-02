/**
 * ============================================================
 * SERVICE WORKER (PWA + PUSH)
 * ============================================================
 *
 * Responsável por:
 * - Receber notificações push
 * - Exibir notificações ao usuário
 * - Gerenciar interação (click) com notificações
 *
 * Observação:
 * A variável __WB_MANIFEST é injetada automaticamente
 * pelo Workbox durante o build (injectManifest).
 */

/**
 * WORKBOX MANIFEST (OBRIGATÓRIO)
 */
self.__WB_MANIFEST;

/**
 * PUSH EVENT
 */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const title = data.title || "Fluidity";

  const options = {
    body: data.body,
    icon: "/icons/192.png",
    badge: "/icons/192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * NOTIFICATION CLICK
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
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

        return self.clients.openWindow(urlToOpen);
      })
  );
});
