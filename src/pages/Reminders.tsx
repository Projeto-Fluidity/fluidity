import AppLayout from "../components/layout/AppLayout";
import ReminderStatsCard from "../components/reminders/ReminderStatsCard";
import ReminderItemCard from "../components/reminders/ReminderItemCard";
import ReminderToggleCard from "../components/reminders/ReminderToggleCard";
import { useReminders } from "../hooks/useReminders";
// import { resetReminders } from "../services/reminderService";
// import { useEffect } from "react";

/**
 * Tela responsável por exibir lembretes inteligentes
 * com base no comportamento do usuário.
 */
export default function Reminders() {
  const {
    reminders,
    feedback,
    acceptReminder,
    postponeReminder,
  } = useReminders();

  // RESET AQUI (dentro do componente)
  // useEffect(() => {
  //   resetReminders();
  // }, []);

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
            .map((reminder) => (
              <ReminderItemCard
                key={reminder.id}
                title={reminder.title}
                description={reminder.description}
                time={reminder.time}
                variant={reminder.variant}
                status={reminder.status}
                onAccept={() => acceptReminder(reminder.id)}
                onPostpone={() => postponeReminder(reminder.id)}
              />
            ))}

          {/* Configuração */}
          <ReminderToggleCard />
        </div>
        {import.meta.env.DEV && (
  <div className="mt-4 flex justify-center">
    <button
      onClick={() => window.resetRemindersMock?.()}
      className="rounded-lg border border-red-400 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
    >
      🧪 Resetar lembretes (QA)
    </button>
  </div>
)}
      </div>
    </AppLayout>
  );
}
