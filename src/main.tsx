import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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

/**
 * DEBUG (DEV ONLY)
 */
if (import.meta.env.DEV) {
  window.testPush = async () => {
    const subscription = await registerPush();
    console.log("SUBSCRIPTION:", subscription);
  };

  window.resetMoodMock = resetMoodMock;
  window.resetReminderLogs = resetReminderLogs;
}

/**
 * Ponto de entrada da aplicação React
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
