import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Volume2, Vibrate } from "lucide-react";
import Toggle from "../components/ui/Toggle";
import ReminderNavigationCard from "../components/reminders/ReminderNavigationCard";
import { useState } from "react";

type GeneralSetting = {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
};

const generalSettings: GeneralSetting[] = [
  {
    id: "notifications",
    icon: <Bell size={18} />,
    title: "Notificacoes",
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
    title: "Vibracao",
    subtitle: "Vibrar ao notificar",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
  },
];

/**
 * ============================================================
 * Page: Settings
 * ============================================================
 *
 * Tela de configuracoes da aplicacao.
 *
 * Responsavel por:
 * - Permitir ativar/desativar preferencias gerais
 * - Redirecionar para configuracao de lembretes
 * ============================================================
 */
export default function Settings() {
  const navigate = useNavigate();

  const [generalToggles, setGeneralToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(generalSettings.map((s) => [s.id, true]))
  );

  function toggleGeneral(id: string) {
    setGeneralToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-sm backdrop-blur hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Configuracoes</h1>
            <p className="text-sm text-gray-500">Personalize seus lembretes</p>
          </div>
        </div>

        {/* Geral */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Geral
          </p>
          <div className="rounded-2xl bg-white divide-y divide-gray-100 border border-gray-200 shadow-sm">
            {generalSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${setting.iconBg} ${setting.iconColor}`}>
                    {setting.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{setting.title}</p>
                    <p className="text-xs text-gray-400">{setting.subtitle}</p>
                  </div>
                </div>
                <Toggle
                  active={generalToggles[setting.id]}
                  onToggle={() => toggleGeneral(setting.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card lembretes inteligentes */}
        <ReminderNavigationCard />

      </div>
    </div>
  );
}