import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * ============================================================
 * VITE CONFIGURATION
 * ============================================================
 *
 * Configuração do Vite para aplicação React com suporte a PWA.
 *
 * Esta versão utiliza:
 * - injectManifest (Service Worker customizado)
 *
 * Isso permite:
 * - Implementar Push Notifications (Push API)
 * - Controlar manualmente eventos do Service Worker
 *   como "push" e "notificationclick"
 * - Definir estratégias de cache diretamente no sw.ts
 *
 * Observação:
 * - Não utilizamos runtimeCaching aqui, pois com injectManifest
 *   o controle de cache deve ser feito dentro do Service Worker.
 */
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      /**
       * Define que será usado um Service Worker customizado.
       */
      strategies: "injectManifest",

      /**
       * Diretório e nome do arquivo do Service Worker.
       * O arquivo deve existir em: src/sw.ts
       */
      srcDir: "src",
      filename: "sw.ts",

      /**
       * Atualização automática do Service Worker.
       */
      registerType: "autoUpdate",

      /**
       * Manifesto da aplicação PWA.
       */
      manifest: {
        name: "Fluidity",
        short_name: "Fluidity",
        description: "Registro e acompanhamento do humor diário",
        theme_color: "#16a34a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",

        icons: [
          {
            src: "/icons/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      /**
       * Configurações do Workbox.
       *
       * navigateFallback:
       * Garante que rotas da SPA funcionem corretamente,
       * redirecionando para index.html quando necessário.
       */
      workbox: {
        navigateFallback: "index.html",
      },

      /**
       * Configuração para ambiente de desenvolvimento.
       *
       * enabled: ativa o Service Worker no modo dev
       * type: module permite uso de ESModules no SW
       */
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
