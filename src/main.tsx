import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import "./index.css";
import App from "./App.tsx";

import { resetMoodMock } from "./utils/debug/resetMoodMock";
import { resetReminderLogs } from "./utils/debug/resetReminderLogs";
import { registerPush } from "./services/pushService";

declare global {
  interface Window {
    testPush?: () => Promise<void>;
    resetMoodMock?: () => void;
    resetReminderLogs?: () => void;
  }
}

if (import.meta.env.DEV) {
  window.testPush = async () => {
    const subscription = await registerPush();
    console.log("SUBSCRIPTION:", subscription);
  };

  window.resetMoodMock = resetMoodMock;
  window.resetReminderLogs = resetReminderLogs;
}

/**
 * ============================================================
 * DEBUG (APENAS EM DESENVOLVIMENTO)
 * ============================================================
 */
if (import.meta.env.DEV) {
  
  /**
   * Teste manual de push notification via console:
   * window.testPush()
   */
    window.testPush = async () => {
    const subscription = await registerPush();
    console.log("SUBSCRIPTION:", subscription);
  };
  /**
   * Funções auxiliares de debug
   */
  window.resetMoodMock = resetMoodMock;
  window.resetReminderLogs = resetReminderLogs;
}

/**
 * ============================================================
 * SERVICE WORKER (PWA)
 * ============================================================
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
 * ============================================================
 * INICIALIZAÇÃO REACT
 * ============================================================
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
