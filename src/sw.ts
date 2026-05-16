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
 * START
 * ============================================================
 */

console.log("SW CUSTOM INICIADO");

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

  event.waitUntil(self.clients.claim());
});

/**
 * ============================================================
 * PUSH
 * ============================================================
 */

self.addEventListener("push", (event) => {
  console.log("PUSH RECEBIDO");

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

  console.log("PAYLOAD:", data);

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
