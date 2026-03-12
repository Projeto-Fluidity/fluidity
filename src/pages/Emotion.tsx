import AppLayout from "../components/layout/AppLayout";
import MoodSelector from "../components/MoodSelector";
import ExerciseCard from "../components/ExerciseCard";
import { useMood } from "../hooks/useMood";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Tela principal onde o usuário registra
 * como está se sentindo no dia.
 */
export default function Emotion() {
  const navigate = useNavigate();

  const { registerMood, status } = useMood();

  /**
   * Observa o status da operação de registro
   * e redireciona o usuário conforme o resultado.
   */
  useEffect(() => {
    if (status === "success") {
      navigate("/success");
    }

    if (status === "error") {
      navigate("/error");
    }
  }, [status, navigate]);

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Olá, Mariana!
          </h1>

          <p className="text-gray-500 mt-1">
            Como você está?
          </p>
        </div>

        {/* Mood Selector */}
        <MoodSelector registerMood={registerMood} />

        {/* Exercises */}
        <div className="space-y-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Exercícios recomendados
          </h2>

          <ExerciseCard
            title="Respiração Guiada"
            duration="5 min"
          />

          <ExerciseCard
            title="Meditação Rápida"
            duration="3 min"
          />

        </div>

      </div>
    </AppLayout>
  );
}
