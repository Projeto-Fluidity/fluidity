import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Bell, Vibrate, Volume2 } from "lucide-react";

import {
  loadNotificationSettings,
  enableNotifications,
  disableNotifications,
} from "../services/notificationSettingsService";

import { getSWReady } from "../services/swService";

import { useAuth } from "./useAuth";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

/**
 * Representa uma configuração exibida na seção
 * "Geral" da tela de Configurações.
 *
 * Cada item possui:
 *
 * - identificação única;
 * - informações de apresentação;
 * - estado atual do toggle.
 *
 * O componente visual apenas renderiza esses dados.
 */

export type GeneralSetting = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
};

/**
 * ============================================================
 * INITIAL STATE
 * ============================================================
 *
 * Fonte inicial das configurações apresentadas
 * ao usuário.
 *
 * Os valores poderão ser sincronizados posteriormente
 * com:
 *
 * - reminder_settings;
 * - Push Subscription.
 */
const INITIAL_SETTINGS: GeneralSetting[] = [
  {
    id: "notifications",
    label: "Notificações",
    description: "Receber alertas",
    icon: <Bell size={16} />,
    enabled: false,
  },
  {
    id: "sound",
    label: "Som",
    description: "Tocar som nos alertas",
    icon: <Volume2 size={16} />,
    enabled: true,
  },
  {
    id: "vibration",
    label: "Vibrar ao notificar",
    description: "Receber alertas",
    icon: <Vibrate size={16} />,
    enabled: true,
  },
];

/**
 * ============================================================
 * HOOK
 * ============================================================
 *
 * Responsável por encapsular toda a regra de negócio
 * da tela de Configurações.
 *
 * Esta primeira versão apenas move a lógica existente
 * da página para um hook compartilhado, sem alterar
 * comportamento.
 *
 * Futuramente este hook será responsável por:
 *
 * - centralizar notificações;
 * - sincronizar Push Subscription;
 * - encapsular regras globais;
 * - reduzir responsabilidades da página.
 */
export function useNotificationSettings() {
  /**
   * ==========================================================
   * STATE
   * ==========================================================
   */

  const [generalSettings, setGeneralSettings] = useState(INITIAL_SETTINGS);

  const [isLoading, setIsLoading] = useState(true);

  /**
   * ==========================================================
   * AUTH
   * ==========================================================
   *
   * Recupera o usuário autenticado.
   *
   * As regras de negócio permanecem encapsuladas no
   * notificationSettingsService. O hook utiliza apenas
   * o identificador do usuário para solicitar operações
   * ao serviço.
   */
  const { user } = useAuth();

  /**
   * ==========================================================
   * UPDATE SETTING
   * ==========================================================
   *
   * Atualiza o estado de uma configuração local da interface.
   *
   * Essa função centraliza a atualização dos toggles para
   * evitar duplicação de código e manter uma única forma
   * de alterar o estado da tela.
   */
  function updateSetting(id: string, enabled: boolean) {
    setGeneralSettings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled,
            }
          : item,
      ),
    );
  }

  /**
   * ==========================================================
   * LOAD SETTINGS
   * ==========================================================
   *
   * Carrega as configurações globais de notificações do
   * usuário autenticado.
   */
  async function loadSettings() {

    if (!user) {
      return;
    }

    const settings = await loadNotificationSettings(user.id);

    updateSetting("notifications", settings.enabled);
  }

  /**
   * ==========================================================
   * SYNC PUSH STATE
   * ==========================================================
   *
   * Consulta o estado real da Push Subscription
   * existente no navegador.
   *
   * Atualmente esta sincronização mantém exatamente
   * o comportamento já existente na aplicação.
   */
  async function syncPushState() {
    try {
      const registration = await getSWReady();

      const subscription = await registration.pushManager.getSubscription();

      /**
       * Apenas auditoria.
       *
       * O estado visual do toggle é controlado
       * exclusivamente pelas configurações
       * persistidas em reminder_settings.
       */
      if (!subscription) {
        console.warn("Push Subscription inexistente.");
      }
    } catch (error) {
      console.error("Erro ao sincronizar Push Subscription:", error);
    }
  }

  /**
   * ==========================================================
   * TOGGLE GENERAL SETTINGS
   * ==========================================================
   *
   * Responsável por tratar alterações realizadas
   * pelo usuário nos toggles da tela.
   *
   * O toggle global de notificações delega toda
   * a regra de negócio ao
   * notificationSettingsService.
   *
   * Os demais toggles permanecem locais até que
   * possuam persistência própria.
   */
  async function handleToggleGeneral(id: string) {
    if (id === "notifications") {
      const currentSetting = generalSettings.find((item) => item.id === id);

      const enabled = currentSetting?.enabled ?? false;

      if (!user) {
        return;
      }

      try {
        if (enabled) {
          await disableNotifications(user.id);
        } else {
          await enableNotifications(user.id);
        }

        updateSetting(id, !enabled);
      } catch (error) {
        console.error("Erro ao alterar estado das notificações:", error);
      }

      return;
    }

    /**
     * ========================================================
     * LOCAL SETTINGS
     * ========================================================
     */

    const currentSetting = generalSettings.find((item) => item.id === id);

    updateSetting(id, !(currentSetting?.enabled ?? false));
  }

useEffect(() => {
  const initialize = async () => {
    try {
      setIsLoading(true);

      await loadSettings();

      await syncPushState();
    } finally {
      setIsLoading(false);
    }
  };

  void initialize();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  return {
    generalSettings,
    handleToggleGeneral,
    isLoading,
  };
}
