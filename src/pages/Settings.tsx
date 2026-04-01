/**
 * ============================================================
 * Page: Settings
 * ============================================================
 *
 * Tela de configurações da aplicação.
 *
 * Responsável por:
 * - Permitir ativar/desativar preferências gerais (em breve)
 * - Controlar lembretes ativos (modo visual)
 *
 * Observação:
 * - Configurações gerais ainda não possuem funcionalidade
 *   e estão desabilitadas no MVP
 *
 * ============================================================
 */

import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Bell,
  Volume2,
  Vibrate,
  Droplets,
  Coffee,
  Heart,
  Moon,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Toggle from "../components/ui/Toggle";
import { useState } from "react";

type ReminderItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  time: string;
  frequency: string;
  iconColor: string;
  iconBg: string;
};

type GeneralSetting = {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
};

/**
 * Configurações gerais (MVP - desabilitadas)
 */
const generalSettings: GeneralSetting[] = [
  {
    id: "notifications",
    icon: <Bell size={18} />,
    title: "Notificações",
    subtitle: "Em breve disponível",
    iconColor: "text-gray-400",
    iconBg: "bg-gray-100",
  },
  {
    id: "sound",
    icon: <Volume2 size={18} />,
    title: "Som",
    subtitle: "Em breve disponível",
    iconColor: "text-gray-400",
    iconBg: "bg-gray-100",
  },
  {
    id: "vibration",
    icon: <Vibrate size={18} />,
    title: "Vibração",
    subtitle: "Em breve disponível",
    iconColor: "text-gray-400",
    iconBg: "bg-gray-100",
  },
];

/**
 * Lembretes ativos
 */
const reminderItems: ReminderItem[] = [
  {
    id: "water",
    icon: <Droplets size={18} />,
    title: "Hora de se hidratar",
    time: "14:30",
    frequency: "Diariamente",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-100",
  },
  {
    id: "break",
    icon: <Coffee size={18} />,
    title: "Faça uma pausa",
    time: "15:00",
    frequency: "Diariamente",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-100",
  },
  {
    id: "mood",
    icon: <Heart size={18} />,
    title: "Como está seu humor?",
    time: "16:00",
    frequency: "Diariamente",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-100",
  },
  {
    id: "relax",
    icon: <Moon size={18} />,
    title: "Hora de relaxar",
    time: "21:00",
    frequency: "Diariamente",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-100",
  },
];

export default function Settings() {
  const navigate = useNavigate();

  const [generalToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(generalSettings.map((s) => [s.id, false]))
  );

  const [reminderToggles, setReminderToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(reminderItems.map((r) => [r.id, true]))
  );

  function toggleReminder(id: string) {
    setReminderToggles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-6">

          {/* HEADER */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-sm backdrop-blur hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Configurações
              </h1>
              <p className="text-sm text-gray-500">
                Personalize seus lembretes
              </p>
            </div>
          </div>

          {/* GERAL (DESABILITADO) */}
          <div className="space-y-2 opacity-70">
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
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${setting.iconBg} ${setting.iconColor}`}
                    >
                      {setting.icon}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {setting.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {setting.subtitle}
                      </p>
                    </div>
                  </div>

                  <Toggle active={false} disabled onToggle={() => {}} />
                </div>
              ))}
            </div>
          </div>

          {/* LEMBRETES (ATIVOS) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Lembretes Ativos
            </p>

            <div className="space-y-3">
              {reminderItems.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 border border-green-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${reminder.iconBg} ${reminder.iconColor}`}
                    >
                      {reminder.icon}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {reminder.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        🕐 {reminder.time} • {reminder.frequency}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    active={reminderToggles[reminder.id]}
                    onToggle={() => toggleReminder(reminder.id)}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
