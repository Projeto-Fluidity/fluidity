import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { resetMoodMock } from "./utils/debug/resetMoodMock";
import { resetReminderLogs } from "./utils/debug/resetReminderLogs";
import { registerSW }
  from "virtual:pwa-register";

/**
 * ============================================================
 * REGISTRO AUTOMÁTICO DO PWA
 * ============================================================
 */

registerSW({
  immediate: true,
});

/**
 * ============================================================
 * DEBUG GLOBAL (DEV ONLY)
 * ============================================================
 */

declare global {
  interface Window {
    testPush?: () => Promise<void>;
    resetMoodMock?: () => void;
    resetReminderLogs?: () => void;
  }
}

if (import.meta.env.DEV) {

  /**
   * RESETS
   */
  window.resetMoodMock = resetMoodMock;
  window.resetReminderLogs = resetReminderLogs;
}

/**
 * ============================================================
 * RENDER APP
 * ============================================================
 */

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
