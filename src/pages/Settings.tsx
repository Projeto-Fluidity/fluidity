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
  hasPushSubscription,
  unsubscribePush,
} from "../services/pushService";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */
type GeneralSetting = {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
};

/**
 * ============================================================
 * SETTINGS CONFIG
 * ============================================================
 */
const generalSettings: GeneralSetting[] = [
  {
    id: "notifications",

    icon: <Bell size={18} />,

    title: "Notificações",

    subtitle: "Receber alertas",

    iconColor: "text-[#008236]",

    iconBg: "bg-green-100",
  },

  {
    id: "sound",

    icon: <Volume2 size={18} />,

    title: "Som",

    subtitle: "Tocar som nos alertas",

    iconColor: "text-[#008236]",

    iconBg: "bg-green-100",
  },

  {
    id: "vibration",

    icon: <Vibrate size={18} />,

    title: "Vibração",

    subtitle: "Vibrar ao notificar",

    iconColor: "text-purple-500",

    iconBg: "bg-purple-100",
  },
];

/**
 * ============================================================
 * PAGE: SETTINGS
 * ============================================================
 *
 * Responsável por:
 * - configurações gerais;
 * - ativar/desativar push;
 * - sincronizar UI com Push API.
 */
export default function Settings() {

  const navigate = useNavigate();

  /**
   * ============================================================
   * ESTADO DOS TOGGLES
   * ============================================================
   *
   * IMPORTANTE:
   * Não iniciamos notifications como true.
   *
   * O valor real virá da Push API.
   */
  const [
    generalToggles,
    setGeneralToggles,
  ] = useState<Record<string, boolean>>({
    notifications: false,
    sound: true,
    vibration: true,
  });

  /**
   * ============================================================
   * SYNC COM PUSH API
   * ============================================================
   *
   * Ao abrir a tela:
   * - verifica se já existe subscription;
   * - sincroniza o toggle com estado real.
   */
  useEffect(() => {

    async function syncPushState() {

      try {

        const hasSubscription =
          await hasPushSubscription();

        console.log(
          "Push subscription ativa:",
          hasSubscription
        );

        setGeneralToggles((prev) => ({
          ...prev,
          notifications: hasSubscription,
        }));

      } catch (error) {

        console.error(
          "Erro ao sincronizar push:",
          error
        );
      }
    }

    syncPushState();

  }, []);

  /**
   * ============================================================
   * TOGGLE GERAL
   * ============================================================
   */
  async function toggleGeneral(
    id: string
  ) {

    const nextValue =
      !generalToggles[id];

    /**
     * Atualiza UI imediatamente
     */
    setGeneralToggles((prev) => ({
      ...prev,
      [id]: nextValue,
    }));

    /**
     * ============================================================
     * PUSH NOTIFICATIONS
     * ============================================================
     */
    if (id === "notifications") {

      try {

        /**
         * ============================================================
         * ATIVAR PUSH
         * ============================================================
         */
        if (nextValue) {

          await createOrGetSubscription();

          console.log(
            "Push notifications ativadas"
          );
        }

        /**
         * ============================================================
         * DESATIVAR PUSH
         * ============================================================
         */
        else {

          await unsubscribePush();

          console.log(
            "Push notifications desativadas"
          );
        }

      } catch (error) {

        console.error(
          "Erro ao alterar push:",
          error
        );

        /**
         * Reverte UI em caso de erro
         */
        setGeneralToggles((prev) => ({
          ...prev,
          [id]: !nextValue,
        }));
      }
    }
  }

  return (

    <div
      className="
        min-h-full
        bg-gradient-to-b
        from-[#DCFCE7]
        to-[#F0FDF4]
        p-4
      "
    >

      <div className="space-y-6">

        {/* ============================================================
            HEADER
        ============================================================ */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}

            aria-label="Voltar"

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/80
              text-gray-600
              shadow-sm
              backdrop-blur
              hover:bg-white
            "
          >
            <ChevronLeft size={20} />
          </button>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-gray-800
              "
            >
              Configurações
            </h1>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Personalize seus lembretes
            </p>
          </div>
        </div>

        {/* ============================================================
            GERAL
        ============================================================ */}
        <div className="space-y-2">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-widest
              text-gray-400
            "
          >
            Geral
          </p>

          <div
            className="
              rounded-2xl
              bg-white
              divide-y
              divide-gray-100
              border
              border-gray-200
              shadow-sm
            "
          >

            {generalSettings.map((setting) => (

              <div
                key={setting.id}

                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      ${setting.iconBg}
                      ${setting.iconColor}
                    `}
                  >
                    {setting.icon}
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-800
                      "
                    >
                      {setting.title}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      {setting.subtitle}
                    </p>
                  </div>
                </div>

                <Toggle
                  active={
                    generalToggles[
                      setting.id
                    ]
                  }

                  onToggle={() =>
                    toggleGeneral(setting.id)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            CARD LEMBRETES
        ============================================================ */}
        <ReminderNavigationCard />

      </div>
    </div>
  );
}
