import AppLayout from "../components/layout/AppLayout";
import MoodSelector from "../components/MoodSelector";
import ExerciseCard from "../components/ExerciseCard";
import { useMood } from "../hooks/useMood";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";

/**
 * Tela principal onde o usuário registra
 * como está se sentindo no dia.
 */
export default function Emotion() {
  const navigate = useNavigate();

  const { registerMood, status } = useMood();

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
      <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">

        <div className="space-y-6">

          {/* Greeting */}
          <div className="flex items-start justify-between">

            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Olá, Mariana!
              </h1>

              <p className="text-gray-500 mt-1">
                Como você está?
              </p>
            </div>

            {/* Avatar */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur shadow-sm text-green-600">
              <User size={20} />
            </div>

          </div>

          {/* Mood Selector */}
          <MoodSelector registerMood={registerMood} />

          {/* Exercises */}
          <div className="space-y-3">

            <h2 className="text-lg font-semibold text-gray-800">
              Exercícios recomendados
            </h2>

            <ExerciseCard
              title="Respiração Guiada"
              duration="5 min"
              icon="breathing"
            />

            <ExerciseCard
              title="Meditação Rápida"
              duration="3 min"
              icon="meditation"
            />

          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/history")}
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              font-medium
              py-3
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            Ver histórico completo
            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    </AppLayout>
  );
}
