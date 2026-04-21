import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import "./index.css";
import App from "./App.tsx";

import { resetMoodMock } from "./utils/debug/resetMoodMock";
import { resetReminderLogs } from "./utils/debug/resetReminderLogs";

/**
 * Registra o Service Worker (PWA)
 *
 * - Responsável por tornar o app instalável
 * - Gerencia cache e funcionamento offline (parcial)
 * - Usa autoUpdate (configurado no vite.config)
 */
registerSW({
  onNeedRefresh() {
    console.log("Nova versão disponível");
  },
  onOfflineReady() {
    console.log("App pronto para uso offline");
  },
});

/**
 * Exposição de funções de debug no ambiente de desenvolvimento
 *
 * Permite executar no console do navegador:
 * - window.resetMoodMock()
 * - window.resetReminderLogs()
 *
 * NÃO é executado em produção
 */
if (import.meta.env.DEV) {
  window.resetMoodMock = resetMoodMock;
  window.resetReminderLogs = resetReminderLogs;
}

/**
 * Inicialização da aplicação React
 *
 * - StrictMode: ajuda a identificar problemas no desenvolvimento
 * - BrowserRouter: habilita navegação entre páginas
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
