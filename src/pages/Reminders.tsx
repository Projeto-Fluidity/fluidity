import AppLayout from "../components/layout/AppLayout";
import ReminderStatsCard from "../components/reminders/ReminderStatsCard";
import ReminderItemCard from "../components/reminders/ReminderItemCard";
import ReminderToggleCard from "../components/reminders/ReminderToggleCard";
import { useState, useEffect } from "react";
import type { Reminder } from "../types/reminder";

/**
 * Tela responsável por exibir lembretes inteligentes
 * com base no comportamento do usuário.
 */
export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Hora de se hidratar",
      description: "Você não bebe água há 2 horas",
      time: "14:30",
      variant: "info",
      status: "pending",
    },
    {
      id: "2",
      title: "Faça uma pausa",
      description: "Você está trabalhando há 3 horas seguidas",
      time: "15:00",
      variant: "warning",
      status: "pending",
    },
    {
      id: "3",
      title: "Como está seu humor?",
      description: "Registre seu humor do momento",
      time: "16:00",
      variant: "emotion",
      status: "pending",
    },
    {
      id: "4",
      title: "Hora de relaxar",
      description: "Pratique respiração guiada antes de dormir",
      time: "21:00",
      variant: "relax",
      status: "pending",
    },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, status: "accepted" }
          : reminder
      )
    );

    setFeedback("Lembrete aceito");
  };

  const handlePostpone = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, status: "postponed" }
          : reminder
      )
    );

    setFeedback("Lembrete adiado");
  };

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <AppLayout>
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-xl bg-black px-4 py-2 text-sm text-white shadow-md">
          {feedback}
        </div>
      )}

      <div className="flex-1 bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-3">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Lembretes
            </h1>
            <p className="text-sm text-gray-600">
              Sugestões inteligentes para você
            </p>
          </div>

          {/* Métricas */}
          <ReminderStatsCard />

          {/* Lista */}
          <h2 className="text-sm font-medium text-gray-700">
            Sugestões de hoje
          </h2>

          {/* Renderização dinâmica */}
          {reminders
            .filter((r) => r.status === "pending")
            .map((reminder) => (
              <ReminderItemCard
                key={reminder.id}
                title={reminder.title}
                description={reminder.description}
                time={reminder.time}
                variant={reminder.variant}
                status={reminder.status}
                onAccept={() => handleAccept(reminder.id)}
                onPostpone={() => handlePostpone(reminder.id)}
              />
            ))}

          {/* Configuração */}
          <ReminderToggleCard />
        </div>
      </div>
    </AppLayout>
  );
}