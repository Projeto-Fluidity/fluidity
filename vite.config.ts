import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      strategies: "injectManifest",

      srcDir: "src",
      filename: "sw.ts",

      devOptions: {
        enabled: true,
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
});
