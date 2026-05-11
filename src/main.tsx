import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App.tsx";

import { resetMoodMock } from "./utils/debug/resetMoodMock";
import { resetReminderLogs } from "./utils/debug/resetReminderLogs";

import { registerPush } from "./services/pushService";

console.log(
  "ENV PUBLIC KEY:",
  import.meta.env.VITE_VAPID_PUBLIC_KEY
);

/**
 * ============================================================
 * REGISTRO DO SERVICE WORKER (PWA)
 * ============================================================
 */

  // if ("serviceWorker" in navigator) {
  //   window.addEventListener("load", async () => {
  //     try {
  //       const registration =
  //       await navigator.serviceWorker.register(
  //         "/sw.js",
  //         {
  //           type: "module",
  //         }
  //       );

  //       console.log("SW REGISTRADO:", registration);
  //     } catch (error) {
  //       console.error("ERRO AO REGISTRAR SW:", error);
  //     }
  //   });
  // }

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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration =
        await navigator.serviceWorker.register(
          "/dev-sw.js?dev-sw",
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

if (import.meta.env.DEV) {
  /**
   * TESTAR PUSH MANUALMENTE
   */
  window.testPush = async () => {
    const subscription = await registerPush();

    console.log("SUBSCRIPTION:");
    console.log(subscription);
  };

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
