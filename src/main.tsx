import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { resetMoodMock } from "./utils/debug/resetMoodMock";
import { resetReminderLogs } from "./utils/debug/resetReminderLogs";

if (import.meta.env.DEV) {
  window.resetMoodMock = resetMoodMock;
  window.resetReminderLogs = resetReminderLogs;
}

/**
 * Ponto de entrada da aplicação React.
 *
 * Responsável por inicializar o React
 * e renderizar o componente principal
 * dentro do elemento HTML com id "root".
 *
 * O BrowserRouter envolve a aplicação para
 * habilitar o sistema de roteamento entre páginas.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
