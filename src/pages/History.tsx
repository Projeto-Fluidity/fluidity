import AppLayout from "../components/layout/AppLayout";
import { useMood } from "../hooks/useMood";

import LastCheckinCard from "../components/history/LastCheckinCard";
import MoodHistoryList from "../components/history/MoodHistoryList";
import ExerciseCard from "../components/ExerciseCard";

/**
 * Página responsável por exibir o histórico
 * de humor do usuário.
 *
 * A tela apresenta:
 * - último check-in realizado
 * - exercícios recomendados
 * - histórico completo de registros
 *
 * Esta página consome dados do hook `useMood`
 * e delega a renderização para componentes visuais.
 */
export default function History() {
  /**
   * Recupera o histórico de registros do usuário.
   */
  const { history, loading } = useMood();

  /**
   * Obtém o último check-in registrado.
   */
  const lastCheckin = history[0];

  /**
   * Exercícios recomendados exibidos na tela.
   * Mantidos como estrutura de dados para facilitar manutenção.
   */
  const exercises = [
    {
      title: "Respiração Guiada",
      duration: "5 min",
      icon: "breathing" as const,
    },
    {
      title: "Água",
      duration: "3 de 10 copos",
      icon: "water" as const,
    },
    {
      title: "Descanso Visual",
      duration: "5 min",
      icon: "rest" as const,
    },
  ];

  return (
    <AppLayout>
      <div className="bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] px-4 pb-8 pt-6">
        {/* Cabeçalho da página */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Histórico de Hoje
          </h1>
        </header>

        {/* Conteúdo principal */}
        <div className="space-y-4">
          {/* Último check-in */}
          {lastCheckin && <LastCheckinCard record={lastCheckin} />}

          {/* Cards de práticas recomendadas */}
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.title}
              title={exercise.title}
              duration={exercise.duration}
              icon={exercise.icon}
            />
          ))}

          {/* Lista de histórico */}
          <MoodHistoryList history={history} loading={loading} />
        </div>
      </div>
    </AppLayout>
  );
}
