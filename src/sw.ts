/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

/**
 * ============================================================
 * INSTALL
 * ============================================================
 */
self.addEventListener("install", () => {
  console.log("SW INSTALADO");

  self.skipWaiting();
});

/**
 * ============================================================
 * ACTIVATE
 * ============================================================
 */
self.addEventListener("activate", (event) => {
  console.log("SW ATIVADO");

  event.waitUntil(
    self.clients.claim()
  );
});

/**
 * ============================================================
 * PUSH EVENT
 * ============================================================
 */
self.addEventListener("push", (event: PushEvent) => {
  console.log("PUSH RECEBIDO");

  let data = {
    title: "Fluidity",
    body: "Push fallback",
  };

  if (event.data) {
    try {
      data = event.data.json();

      console.log("DATA PUSH:", data);
    } catch (error) {
      console.log("ERRO AO LER PAYLOAD:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title,
      {
        body: data.body,
        icon: "/icons/192.png",
        badge: "/icons/192.png",
        requireInteraction: true,
        vibrate: [200, 100, 200],
      }as NotificationOptions & {
      vibrate: number[];
      }
    )
  );
});

/**
 * ============================================================
 * NOTIFICATION CLICK
 * ============================================================
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow("/")
  );
});
