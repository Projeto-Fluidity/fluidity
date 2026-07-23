import { useCallback, useEffect, useState } from "react";

import { canShowInstallPrompt } from "../utils/pwaInstallPromptPolicy";
import { isRunningAsPWA } from "../storage/pwaInstallState";

/**
 * ============================================================
 * BEFORE INSTALL PROMPT EVENT
 * ============================================================
 *
 * Evento disponibilizado pelos navegadores
 * compatíveis com instalação de PWAs.
 *
 * Permite:
 *
 * - interceptar o prompt nativo;
 * - controlar quando exibi-lo;
 * - capturar a escolha do usuário.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
};

/**
 * ============================================================
 * HOOK: USE PWA INSTALL
 * ============================================================
 *
 * Responsável por centralizar a lógica relacionada
 * ao estado de instalação do Progressive Web App (PWA).
 *
 * Atualmente este Hook:
 *
 * - consulta o estado da instalação;
 * - aplica a política de exibição;
 * - expõe uma API simplificada para a interface.
 *
 * A captura do evento beforeinstallprompt
 * poderá ser centralizada em um Provider
 * em uma evolução futura da arquitetura.
 */
export function usePWAInstall() {
  /**
   * ==========================================================
   * INSTALL EVENT
   * ==========================================================
   *
   * Armazena o evento interceptado
   * pelo beforeinstallprompt.
   */
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  /**
   * ==========================================================
   * CAN INSTALL
   * ==========================================================
   *
   * Indica se o navegador permite
   * exibir o convite de instalação.
   */
  const [canInstall, setCanInstall] = useState(false);

  const shouldShowInstallPrompt =
    canInstall &&
    !isRunningAsPWA() &&
    canShowInstallPrompt();

  /**
   * ==========================================================
   * BEFORE INSTALL PROMPT
   * ==========================================================
   *
   * Intercepta o evento nativo
   * disparado pelo navegador.
   *
   * Importante:
   *
   * Utilizamos preventDefault()
   * para controlar quando o prompt
   * será exibido ao usuário.
   */
  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {

      const installPromptEvent = event as BeforeInstallPromptEvent;

      installPromptEvent.preventDefault();

      setInstallEvent(installPromptEvent);

      setCanInstall(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  /**
   * ==========================================================
   * INSTALL
   * ==========================================================
   *
   * Exibe o prompt nativo
   * de instalação do PWA.
   *
   * Após a escolha do usuário:
   *
   * - limpa o evento armazenado;
   * - impede novas exibições;
   * - aguarda decisão do navegador.
   */
  const install = useCallback(async (): Promise<
    "accepted" | "dismissed" | null
  > => {
    if (!installEvent) {
      return null;
    }

    await installEvent.prompt();

    const { outcome } = await installEvent.userChoice;

    setCanInstall(false);

    setInstallEvent(null);

    return outcome;
  }, [installEvent]);

  /**
   * ==========================================================
   * PUBLIC API
   * ==========================================================
   */
  return {
    canInstall,
    shouldShowInstallPrompt,
    install,
  };
}
