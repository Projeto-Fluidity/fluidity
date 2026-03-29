import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Volume2, Vibrate, Droplets, Coffee, Heart, Moon } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
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

function Toggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="relative h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none"
      style={{
        backgroundColor: active ? "#008236" : "#D1D5DB",
      }}
    >
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const [generalToggles, setGeneralToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(generalSettings.map((s) => [s.id, true]))
  );

  const [reminderToggles, setReminderToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(reminderItems.map((r) => [r.id, true]))
  );

  function toggleGeneral(id: string) {
    setGeneralToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleReminder(id: string) {
    setReminderToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
              <p className="text-sm text-gray-500">Personalize seus lembretes</p>
            </div>
          </div>

          {/* Seção: Geral */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Geral
            </p>
            <div
              className="rounded-2xl bg-white divide-y divide-gray-100"
              style={{
                border: "1.18px solid #B9F8CF",
                boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.10), 0px 1px 4px rgba(0, 0, 0, 0.06)",
              }}
            >
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

          {/* Seção: Lembretes Ativos */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Lembretes Ativos
            </p>
            <div className="space-y-3">
              {reminderItems.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                  style={{
                    border: "1.18px solid #B9F8CF",
                    boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.10), 0px 1px 4px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${reminder.iconBg} ${reminder.iconColor}`}>
                      {reminder.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{reminder.title}</p>
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

          {/* Card de dica */}
          <div
            className="rounded-2xl px-3 py-2"
            style={{
              backgroundColor: "#F0FDF4",
              border: "1.18px solid #B9F8CF",
            }}
          >
            <p className="text-sm text-gray-700 leading-relaxed text-center">
              💡 <span className="font-bold">Dica:</span> Lembretes regulares ajudam a
              <br />
              criar hábitos saudáveis e melhorar seu
              <br />
              bem-estar.
            </p>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}