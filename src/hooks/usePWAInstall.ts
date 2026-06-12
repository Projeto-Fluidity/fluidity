import {
  useCallback,
  useEffect,
  useState,
} from "react";

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
type BeforeInstallPromptEvent =
  Event & {
    prompt: () => Promise<void>;

    userChoice: Promise<{
      outcome:
        | "accepted"
        | "dismissed";
    }>;
  };

/**
 * ============================================================
 * HOOK: USE PWA INSTALL
 * ============================================================
 *
 * Responsável por centralizar toda a lógica
 * relacionada à instalação do PWA.
 *
 * Objetivos:
 *
 * - detectar quando o aplicativo pode ser instalado;
 * - armazenar o evento beforeinstallprompt;
 * - expor método para disparar instalação;
 * - evitar que componentes manipulem eventos
 *   nativos diretamente.
 *
 * Fluxo:
 *
 * Navegador
 *      ↓
 * beforeinstallprompt
 *      ↓
 * usePWAInstall
 *      ↓
 * canInstall = true
 *      ↓
 * Componente visual
 *      ↓
 * install()
 *      ↓
 * Prompt nativo
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
  const [
    installEvent,
    setInstallEvent,
  ] = useState<BeforeInstallPromptEvent | null>(
    null
  );

  /**
   * ==========================================================
   * CAN INSTALL
   * ==========================================================
   *
   * Indica se o navegador permite
   * exibir o convite de instalação.
   */
  const [canInstall, setCanInstall] =
    useState(false);

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
    function handleBeforeInstallPrompt(
      event: Event
    ) {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );

      setCanInstall(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
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
  const install = useCallback(
    async () => {
      if (!installEvent) {
        return;
      }

      await installEvent.prompt();

      await installEvent.userChoice;

      setCanInstall(false);

      setInstallEvent(null);
    },
    [installEvent]
  );

  /**
   * ==========================================================
   * PUBLIC API
   * ==========================================================
   */
  return {
    canInstall,
    install,
  };
}
