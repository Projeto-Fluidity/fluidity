import ExerciseCard from "../components/ExerciseCard";
import LastCheckinCard from "../components/history/LastCheckinCard";
import MoodHistoryList from "../components/history/MoodHistoryList";
import { useMood } from "../hooks/useMood";
import { resetMoodMock } from "../utils/debug/resetMoodMock";
import { getLocalDate, toLocalDate } from "../lib/date";
import type { MoodRecord } from "../types/moodRecord";

/**
 * Retorna a "data de referencia" de um registro.
 * Prioriza checkin_date (modo API) e usa toLocalDate(created_at) como fallback (modos mock).
 */
function getRecordDate(record: MoodRecord): string {
  return record.checkin_date ?? toLocalDate(record.created_at);
}

/**
 * Tela responsavel por exibir o historico
 * de humor do usuario e praticas recomendadas.
 */
export default function History() {
  const { history, loading } = useMood();

  const today = getLocalDate();

  const lastCheckin = history.find((r) => getRecordDate(r) === today);
  const fullHistory = history;

  return (
    <div className="bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4 pb-2 flex-1">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          Historico de Hoje
        </h1>

        {lastCheckin && <LastCheckinCard record={lastCheckin} />}

        <ExerciseCard
          title="Respiracao Guiada"
          duration="5 min"
          icon="breathing"
          route="/breathing"
          variant="highlight"
        />

        <ExerciseCard
          title="Agua"
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

        <MoodHistoryList history={fullHistory} loading={loading} />
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
    </div>
  );
}