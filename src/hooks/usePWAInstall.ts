import { useContext } from "react";

import { PWAInstallContext } from "../components/pwa/PWAInstallContext";

import { canShowInstallPrompt } from "../utils/pwaInstallPromptPolicy";

import { isRunningAsPWA } from "../storage/pwaInstallState";

/**
 * ============================================================
 * HOOK: USE PWA INSTALL
 * ============================================================
 *
 * Responsável por compor as regras de negócio relacionadas
 * ao fluxo de instalação do Progressive Web App.
 *
 * Este Hook não possui integração direta com APIs do navegador.
 *
 * Suas responsabilidades são:
 *
 * - consumir o estado disponibilizado pelo PWAInstallProvider;
 * - aplicar a política de exibição do convite;
 * - verificar se a aplicação já está instalada;
 * - disponibilizar uma API simplificada para a interface.
 */
export function usePWAInstall() {
  /**
   * ==========================================================
   * CONTEXT
   * ==========================================================
   *
   * Recupera o estado global disponibilizado pelo
   * PWAInstallProvider.
   */
  const context = useContext(PWAInstallContext);

  if (!context) {
    throw new Error(
      "usePWAInstall deve ser utilizado dentro de um PWAInstallProvider.",
    );
  }

  /**
   * ==========================================================
   * INSTALL PROMPT POLICY
   * ==========================================================
   *
   * O convite somente poderá ser exibido quando:
   *
   * - o navegador permitir instalação;
   * - a aplicação ainda não estiver instalada;
   * - a política de exibição permitir.
   */
  const shouldShowInstallPrompt =
    context.canInstall && !isRunningAsPWA() && canShowInstallPrompt();

  /**
   * ==========================================================
   * PUBLIC API
   * ==========================================================
   */

  return {
    canInstall: context.canInstall,
    shouldShowInstallPrompt,
    install: context.install,
  };
}
