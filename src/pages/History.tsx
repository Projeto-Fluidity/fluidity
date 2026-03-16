import AppLayout from "../components/layout/AppLayout";
import ExerciseCard from "../components/ExerciseCard";
import LastCheckinCard from "../components/history/LastCheckinCard";
import MoodHistoryList from "../components/history/MoodHistoryList";
import { useMood } from "../hooks/useMood";

/**
 * Tela responsável por exibir o histórico
 * de humor do usuário e práticas recomendadas.
 */
export default function History() {
  const { history, loading } = useMood();

  const lastCheckin = history[0];
  const previousHistory = history.slice(1);

  return (
    <AppLayout>
      <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-4">
          {/* Título */}
          <h1 className="text-2xl font-semibold text-gray-800">
            Histórico de Hoje
          </h1>

          {/* Último check-in */}
          {lastCheckin && <LastCheckinCard record={lastCheckin} />}

          {/* Exercícios */}
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

          {/* Histórico completo */}
          <MoodHistoryList history={previousHistory} loading={loading} />
        </div>
      </div>
    </AppLayout>
  );
}
