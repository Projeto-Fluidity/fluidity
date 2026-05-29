/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

/**
 * ============================================================
 * WORKBOX PRECACHE
 * ============================================================
 */

precacheAndRoute(self.__WB_MANIFEST);

/**
 * ============================================================
 * INSTALL
 * ============================================================
 */

self.addEventListener("install", () => {

  self.skipWaiting();
});

/**
 * ============================================================
 * ACTIVATE
 * ============================================================
 */

self.addEventListener("activate", (event) => {

  event.waitUntil(self.clients.claim());
});

/**
 * ============================================================
 * PUSH
 * ============================================================
 */

self.addEventListener("push", (event) => {

  let data = {
    title: "Fluidity 💧",
    body: "Nova notificação",
    url: "/",
    icon: "/icons/192.png",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.error("ERRO AO LER PAYLOAD:", error);
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
      data: {
        url: data.url,
      },
    })
  );
});

/**
 * ============================================================
 * CLICK
 * ============================================================
 */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.openWindow(url)
  );
});
