import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronLeft,
  Vibrate,
  Volume2,
} from "lucide-react";

import Toggle from "../components/ui/Toggle";

import ReminderNavigationCard
  from "../components/reminders/ReminderNavigationCard";

import {
  createOrGetSubscription,
  unsubscribePush,
} from "../services/pushService";

import { getSWReady }
  from "../services/swService";
/**
 * ============================================================
 * TYPES
 * ============================================================
 */

type GeneralSetting = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
};

/**
 * ============================================================
 * SETTINGS PAGE
 * ============================================================
 */

export default function Settings() {

  const navigate = useNavigate();

  /**
   * ==========================================================
   * STATE
   * ==========================================================
   */

  const [generalToggles, setGeneralToggles] =
    useState<GeneralSetting[]>([
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
        label: "Vibração",
        description: "Vibrar ao notificar",
        icon: <Vibrate size={16} />,
        enabled: true,
      },
    ]);

  /**
   * ==========================================================
   * SYNC PUSH STATE
   * ==========================================================
   *
   * Ao abrir a tela:
   *
   * - verifica se existe subscription;
   * - sincroniza toggle com estado real.
   */

  async function syncPushState() {

    try {

      /**
       * Aguarda SW
       */
      const registration =
        await getSWReady()

      /**
       * Busca subscription atual
       */
      const subscription =
        await registration
          .pushManager
          .getSubscription();

      /**
       * Existe subscription?
       */
      const hasSubscription =
        !!subscription;

      /**
       * Sincroniza toggle
       */
      setGeneralToggles((prev) =>
        prev.map((item) => {

          if (item.id === "notifications") {

            return {
              ...item,
              enabled: hasSubscription,
            };
          }

          return item;
        })
      );

    } catch (error) {

      console.error(
        "ERRO SYNC PUSH:",
        error
      );
    }
  }

  /**
   * ==========================================================
   * EFFECT
   * ==========================================================
   */

    useEffect(() => {

      const load = async () => {

        await syncPushState();
      };

      void load();

    }, []);

  /**
   * ==========================================================
   * TOGGLE GERAL
   * ==========================================================
   */
  
    async function toggleGeneral(
    id: string
  ) {

    /**
     * PUSH NOTIFICATIONS
     */
    if (id === "notifications") {

      const current =
        generalToggles.find(
          (item) => item.id === id
        );

      const enabled =
        current?.enabled ?? false;

      try {

        /**
         * DESABILITAR
         */
        if (enabled) {

          await unsubscribePush();

          setGeneralToggles((prev) =>
            prev.map((item) => {

              if (item.id === id) {

                return {
                  ...item,
                  enabled: false,
                };
              }

              return item;
            })
          );

          return;
        }

        /**
         * HABILITAR
         */

        await createOrGetSubscription();

        setGeneralToggles((prev) =>
          prev.map((item) => {

            if (item.id === id) {

              return {
                ...item,
                enabled: true,
              };
            }

            return item;
          })
        );

      } catch (error) {

        console.error(
          "ERRO TOGGLE PUSH:",
          error
        );
      }

      return;
    }

    /**
     * OUTROS TOGGLES
     */
    setGeneralToggles((prev) =>
      prev.map((item) => {

        if (item.id === id) {

          return {
            ...item,
            enabled: !item.enabled,
          };
        }

        return item;
      })
    );
  }

  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-[#DCFCE7] pb-24">

      <div className="px-4 pt-6">

        {/**
         * HEADER
         */}
        <div className="mb-6 flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="
              flex h-8 w-8 items-center
              justify-center rounded-full
              bg-white
            "
          >
            <ChevronLeft size={18} />
          </button>

          <div>
            <h1
              className="
                text-lg font-semibold
                text-[#0F172A]
              "
            >
              Configurações
            </h1>

            <p
              className="
                text-xs text-[#64748B]
              "
            >
              Personalize seus lembretes
            </p>
          </div>
        </div>

        {/**
         * CARD SETTINGS
         */}
        <div
          className="
            rounded-2xl bg-white
            p-4 shadow-sm
          "
        >
          <span
            className="
              mb-3 block text-[10px]
              font-semibold uppercase
              tracking-wide text-[#94A3B8]
            "
          >
            Geral
          </span>

          <div className="space-y-4">

            {generalToggles.map((item) => (

              <div
                key={item.id}
                className="
                  flex items-center
                  justify-between
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-8 w-8 items-center
                      justify-center rounded-full
                      bg-[#DCFCE7] text-[#16A34A]
                    "
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p
                      className="
                        text-sm font-medium
                        text-[#0F172A]
                      "
                    >
                      {item.label}
                    </p>

                    <p
                      className="
                        text-xs text-[#94A3B8]
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <Toggle
                  active={item.enabled}
                  onToggle={() =>
                    toggleGeneral(item.id)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/**
         * REMINDER CARD
         */}
        <div className="mt-5">
          <ReminderNavigationCard />
        </div>
      </div>
    </div>
  );
}