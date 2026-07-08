import { useEffect, useState } from "react";

import { Bell, Vibrate, Volume2 } from "lucide-react";

import {
  createOrGetSubscription,
  unsubscribePush,
} from "../services/pushService";

import {
  getSettings,
  saveSettings,
} from "../services/settingsService";

import { getSWReady } from "../services/swService";

import type { ReactNode } from "react";

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

  const [generalSettings, setGeneralSettings] =
    useState(INITIAL_SETTINGS);

  /**
   * ==========================================================
   * LOAD SETTINGS
   * ==========================================================
   *
   * Busca as configurações persistidas no banco
   * para sincronizar o estado inicial da interface.
   */
  async function loadSettings() {
    const settings = await getSettings();

    if (!settings) {
      return;
    }

    setGeneralSettings((prev) =>
      prev.map((item) =>
        item.id === "notifications"
          ? {
              ...item,
              enabled: settings.enabled,
            }
          : item,
      ),
    );
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
   *
   * Em uma futura evolução arquitetural essa regra
   * poderá ser revista para evitar duplicidade entre:
   *
   * - reminder_settings.enabled
   * - Push Subscription
   */
  async function syncPushState() {
    try {
      const registration = await getSWReady();

      const subscription =
        await registration.pushManager.getSubscription();

      const hasSubscription = !!subscription;

      setGeneralSettings((prev) =>
        prev.map((item) =>
          item.id === "notifications"
            ? {
                ...item,
                enabled: hasSubscription,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Erro ao sincronizar Push Subscription:",
        error,
      );
    }
  }

  /**
   * ==========================================================
   * TOGGLE SETTINGS
   * ==========================================================
   *
   * Responsável por tratar alterações realizadas
   * pelo usuário nos toggles da tela.
   *
   * Nesta etapa apenas reproduzimos exatamente
   * o comportamento já existente.
   */
  async function handleToggleGeneral(id: string) {
    if (id === "notifications") {
      const current =
        generalSettings.find((item) => item.id === id);

      const enabled = current?.enabled ?? false;

      const currentSettings = await getSettings();

      try {
        if (enabled) {
          await unsubscribePush();

          await saveSettings({
            start_hour: currentSettings?.start_hour ?? 8,
            end_hour: currentSettings?.end_hour ?? 22,
            frequency_minutes:
              currentSettings?.frequency_minutes ?? 60,
            max_per_day:
              currentSettings?.max_per_day ?? 10,
            enabled: false,
          });

          setGeneralSettings((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    enabled: false,
                  }
                : item,
            ),
          );

          return;
        }

        await createOrGetSubscription();

        await saveSettings({
          start_hour: currentSettings?.start_hour ?? 8,
          end_hour: currentSettings?.end_hour ?? 22,
          frequency_minutes:
            currentSettings?.frequency_minutes ?? 60,
          max_per_day:
            currentSettings?.max_per_day ?? 10,
          enabled: true,
        });

        setGeneralSettings((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  enabled: true,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error(
          "Erro ao alterar estado das notificações:",
          error,
        );
      }

      return;
    }

    /**
     * Demais configurações locais.
     */
    setGeneralSettings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  }

  /**
   * ==========================================================
   * EFFECTS
   * ==========================================================
   *
   * Inicializa o hook carregando:
   *
   * 1. Configurações persistidas.
   * 2. Estado atual da Push Subscription.
   */
  useEffect(() => {
    const initialize = async () => {
      await loadSettings();

      await syncPushState();
    };

    void initialize();
  }, []);

  /**
   * ==========================================================
   * PUBLIC API
   * ==========================================================
   */

  return {
    generalSettings,
    handleToggleGeneral,
  };
}
