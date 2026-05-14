/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

console.log("SW MINIMO CARREGADO");

self.addEventListener("install", () => {
  console.log("SW INSTALADO");

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("SW ATIVADO");

  event.waitUntil(
    self.clients.claim()
  );
});
