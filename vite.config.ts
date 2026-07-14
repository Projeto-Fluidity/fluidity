import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * Configuração principal do Vite.
 *
 * Este arquivo centraliza toda a infraestrutura utilizada durante
 * o desenvolvimento da aplicação.
 *
 * Atualmente ele é responsável por configurar:
 *
 * - React
 * - Progressive Web App (PWA)
 * - Ambiente de testes (Vitest)
 *
 * O Vitest utiliza a mesma configuração do Vite, evitando duplicação
 * de configurações e garantindo que a aplicação e os testes compartilhem
 * o mesmo comportamento de resolução de módulos.
 */
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      strategies: "injectManifest",

      srcDir: "src",
      filename: "sw.ts",

      registerType: "autoUpdate",

      devOptions: {
        /**
         * Mantido desabilitado.
         *
         * As funcionalidades que dependem de Service Worker
         * (Push Notifications / Notification Bootstrap)
         * devem ser validadas utilizando:
         *
         * npm run build
         * npm run preview
         */
        enabled: false,
      },

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
        ],
      },
    }),
  ],

  /**
   * Configuração do ambiente de testes.
   *
   * O Vitest reutiliza a infraestrutura do Vite, permitindo que
   * aplicação e testes compartilhem a mesma resolução de módulos,
   * plugins e comportamento de build.
   *
   * Nesta primeira etapa da infraestrutura utilizaremos apenas
   * o ambiente Node, pois os testes serão direcionados para:
   *
   * - Utils
   * - Libs
   * - Services
   *
   * Nenhum desses módulos depende do DOM ou da renderização
   * de componentes React.
   *
   * Quando iniciarmos os testes de componentes React,
   * esta configuração poderá evoluir para utilizar jsdom,
   * caso realmente seja necessário.
   */
  test: {
    /**
     * Disponibiliza automaticamente funções como:
     *
     * describe()
     * it()
     * test()
     * expect()
     * beforeEach()
     * afterEach()
     *
     * Dessa forma não é necessário importá-las em cada arquivo
     * de teste, tornando a escrita mais simples e consistente.
     */
    globals: true,

    /**
     * Define o ambiente de execução dos testes.
     *
     * "node" é suficiente para testar funções puras,
     * regras de negócio e serviços que não dependem
     * do navegador.
     */
    environment: "node",
  },
});
