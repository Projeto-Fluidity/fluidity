import ExerciseCard from "../components/ExerciseCard";
import LastCheckinCard from "../components/history/LastCheckinCard";
import MoodHistoryList from "../components/history/MoodHistoryList";
import { useMood } from "../hooks/useMood";
import ReminderNavigationCard from "../components/reminders/ReminderNavigationCard";
import { resetMoodMock } from "../utils/debug/resetMoodMock";
import { getLocalDate, toLocalDate } from "../lib/date";
import type { MoodRecord } from "../types/moodRecord";

/**
 * Retorna a "data de referência" de um registro.
 * Prioriza checkin_date (modo API) e usa toLocalDate(created_at) como fallback (modos mock).
 */
function getRecordDate(record: MoodRecord): string {
  return record.checkin_date ?? toLocalDate(record.created_at);
}

/**
 * Tela responsável por exibir o histórico
 * de humor do usuário e práticas recomendadas.
 */
export default function History() {
  const { history, loading } = useMood();

  const today = getLocalDate();

  // Registro de hoje para o LastCheckinCard
  const lastCheckin = history.find(
    (r) => getRecordDate(r) === today
  );

  // Lista completa incluindo hoje (já vem ordenada desc pelo service)
  const fullHistory = history;

  return (
    <>
      <div className="bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4 pb-2 flex-1">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            Histórico de Hoje
          </h1>

          {lastCheckin && <LastCheckinCard record={lastCheckin} />}

          <ExerciseCard
            title="Respiração Guiada"
            duration="5 min"
            icon="breathing"
            route="/breathing"
            variant="highlight"
          />

          <ExerciseCard
            title="Água"
            duration="3 de 10 copos"
            icon="water"
            route="/water"
            variant="highlight"
          />

          <ExerciseCard
            title="Descanso Visual"
            duration="5 min"
            icon="rest"
            route="/rest"
            variant="highlight"
          />

          {/* Histórico completo — hoje no topo, mais antigo no fim */}
          <MoodHistoryList history={fullHistory} loading={loading} />

          <ReminderNavigationCard />
        </div>
      </div>

      {import.meta.env.DEV && (
        <button
          onClick={() => {
            resetMoodMock();
            window.location.reload();
          }}
          className="mt-2 w-full rounded-lg border border-red-400 text-red-500 py-2 text-sm font-medium"
        >
          Resetar humor (QA)
        </button>
      )}
    </>
  );
}
