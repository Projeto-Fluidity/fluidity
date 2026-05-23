import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App.tsx";

import { resetMoodMock } from "./utils/debug/resetMoodMock";
import { resetReminderLogs } from "./utils/debug/resetReminderLogs";

/**
 * ============================================================
 * REGISTRO DO SERVICE WORKER (PWA)
 * ============================================================
 */

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration =
          await navigator.serviceWorker.register(
            "/sw.js",
            {
              type: "module",
            }
          );

        console.log("SW REGISTRADO:", registration);

      } catch (error) {
        console.error("ERRO AO REGISTRAR SW:", error);
      }
    });
  }

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
