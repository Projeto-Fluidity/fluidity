/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";

/**
 * ============================================================
 * PUSH NOTIFICATION DATA
 * ============================================================
 *
 * Representa o payload recebido pelo Service Worker
 * através de uma Push Notification.
 *
 * Responsável por definir o contrato entre:
 *
 * Push Server
 *      ↓
 * Web Push
 *      ↓
 * Service Worker
 *
 * category:
 *
 * Identifica a categoria do lembrete e permite que
 * o Service Worker aplique comportamentos específicos
 * à notificação nativa.
 *
 * Categorias atualmente suportadas:
 *
 * - mood: lembretes relacionados ao registro de humor;
 * - hydration: lembretes relacionados à hidratação.
 *
 * A categoria é opcional para preservar compatibilidade
 * com notificações que não estejam associadas a um
 * lembrete específico.
 */
type PushNotificationData = {
  title: string;
  body: string;
  url: string;
  icon: string;
  category?: "mood" | "hydration";
};

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
  let data: PushNotificationData = {
    title: "Fluidity 💧",
    body: "Nova notificação",
    url: "/",
    icon: "/icons/192.png",
    category: "mood",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.error("ERRO AO LER PAYLOAD:", error);
  }

  /**
   * ============================================================
   * NOTIFICATION TAG
   * ============================================================
   *
   * Define uma identidade estável para a notificação
   * conforme a categoria do lembrete.
   *
   * A tag permite que o navegador agrupe ou substitua
   * notificações relacionadas ao mesmo contexto,
   * evitando acúmulo desnecessário de notificações
   * equivalentes.
   *
   * Categorias:
   *
   * - mood      → fluidity-mood
   * - hydration → fluidity-hydration
   */
  const tag =
    data.category === "hydration" ? "fluidity-hydration" : "fluidity-mood";

  /**
   * ============================================================
   * SHOW NOTIFICATION
   * ============================================================
   *
   * Exibe a notificação utilizando a Notification API
   * através do Service Worker.
   *
   * Além do conteúdo visual, a notificação mantém em `data`
   * informações necessárias para tratar futuras interações,
   * como:
   *
   * - destino de navegação;
   * - categoria do lembrete.
   */
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
      tag,
      data: {
        url: data.url,
        category: data.category,
      },
    }),
  );
});

/**
 * ============================================================
 * NOTIFICATION CLICK
 * ============================================================
 *
 * Responsável por tratar o clique principal em uma
 * notificação nativa do Fluidity.
 *
 * Fluxo:
 *
 * - fecha a notificação;
 * - recupera a URL associada ao lembrete;
 * - procura uma instância já aberta da aplicação;
 * - se encontrar, navega para o destino e traz a aplicação
 *   para o primeiro plano;
 * - caso contrário, abre uma nova janela.
 *
 * Esse comportamento evita criar instâncias desnecessárias
 * quando o Fluidity já estiver aberto.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clients) {
        const windowClient = client as WindowClient;

        await windowClient.navigate(url);

        return windowClient.focus();
      }

      return self.clients.openWindow(url);
    })(),
  );
});
