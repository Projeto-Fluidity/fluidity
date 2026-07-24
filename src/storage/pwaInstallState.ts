/**
 * ============================================================
 * PWA INSTALL STATE
 * ============================================================
 *
 * Responsável por consultar o estado atual do
 * Progressive Web App (PWA) utilizando as APIs
 * disponibilizadas pelo navegador.
 *
 * Diferente do armazenamento de preferências,
 * este módulo não realiza qualquer persistência.
 *
 * Responsabilidades:
 *
 * - identificar se a aplicação está sendo executada
 *   como um PWA instalado;
 * - encapsular as consultas às APIs do navegador;
 * - servir como fonte única de verdade sobre o
 *   estado atual da instalação.
 *
 * Não possui dependência de React.
 * Não possui dependência de UI.
 *
 * ============================================================
 */

/**
 * Verifica se a aplicação está sendo executada
 * como um Progressive Web App (PWA).
 *
 * Compatibilidade:
 *
 * - Chromium (display-mode)
 * - Safari iOS (navigator.standalone)
 */
export function isRunningAsPWA(): boolean {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}
