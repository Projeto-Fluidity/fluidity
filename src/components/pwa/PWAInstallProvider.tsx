import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  PWAInstallContext,
  type PWAInstallContextValue,
} from "./PWAInstallContext";

/**
 * ============================================================
 * BEFORE INSTALL PROMPT EVENT
 * ============================================================
 *
 * Tipo que representa o evento disparado pelo navegador
 * quando a aplicação atende aos requisitos para instalação.
 *
 * Esse evento permite:
 *
 * - impedir a exibição automática do prompt;
 * - armazenar o evento para uso posterior;
 * - solicitar a instalação quando desejarmos;
 * - descobrir a decisão do usuário.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
};

/**
 * ============================================================
 * PROPS
 * ============================================================
 */
type PWAInstallProviderProps = {
  children: ReactNode;
};

/**
 * ============================================================
 * PWA INSTALL PROVIDER
 * ============================================================
 *
 * Responsável por centralizar toda a integração com a API
 * de instalação de Progressive Web Apps (PWA).
 *
 * Este Provider é a única parte da aplicação que conhece
 * o evento beforeinstallprompt.
 *
 * Responsabilidades:
 *
 * - registrar o evento beforeinstallprompt;
 * - armazenar o evento recebido do navegador;
 * - informar quando a instalação está disponível;
 * - expor uma função para iniciar a instalação.
 *
 * Não é responsabilidade deste Provider:
 *
 * - decidir quando o convite deve aparecer;
 * - consultar localStorage;
 * - verificar se o aplicativo já está instalado;
 * - renderizar qualquer interface.
 *
 * Essas decisões permanecem em outras camadas da aplicação,
 * respeitando a separação de responsabilidades.
 */
export function PWAInstallProvider({ children }: PWAInstallProviderProps) {

  /**
   * ==========================================================
   * INSTALL EVENT
   * ==========================================================
   *
   * Armazena temporariamente o evento fornecido pelo navegador.
   *
   * Esse evento será utilizado posteriormente quando o usuário
   * clicar em "Adicionar à tela inicial".
   */
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  /**
   * ==========================================================
   * CAN INSTALL
   * ==========================================================
   *
   * Indica se existe um evento de instalação disponível.
   *
   * Quando verdadeiro, significa que o navegador permite
   * solicitar a instalação do aplicativo.
   */
  const [canInstall, setCanInstall] = useState(false);

  /**
   * ==========================================================
   * BEFORE INSTALL PROMPT
   * ==========================================================
   *
   * Registra o listener global responsável por interceptar
   * o evento beforeinstallprompt.
   *
   * O preventDefault() impede que o navegador exiba o
   * convite automaticamente, permitindo que a aplicação
   * escolha o melhor momento para apresentá-lo.
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
   * Solicita ao navegador a exibição do prompt nativo
   * de instalação.
   *
   * Após a decisão do usuário:
   *
   * - limpa o evento armazenado;
   * - remove a disponibilidade da instalação;
   * - retorna o resultado da escolha.
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
   * CONTEXT VALUE
   * ==========================================================
   *
   * Memoriza o valor disponibilizado pelo Context.
   *
   * Essa otimização evita renderizações desnecessárias
   * dos componentes consumidores.
   */
  const value = useMemo<PWAInstallContextValue>(
    () => ({
      canInstall,
      install,
    }),
    [canInstall, install],
  );

  /**
   * ==========================================================
   * PROVIDER
   * ==========================================================
   */
  return (
    <PWAInstallContext.Provider value={value}>
      {children}
    </PWAInstallContext.Provider>
  );
}
