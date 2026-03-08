import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Ponto de entrada da aplicação React.
 *
 * Responsável por inicializar o React
 * e renderizar o componente principal
 * dentro do elemento HTML com id "root".
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
