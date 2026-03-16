import AppLayout from "../components/layout/AppLayout";
import MoodSelector from "../components/MoodSelector";
import ExerciseCard from "../components/ExerciseCard";
import { useMood } from "../hooks/useMood";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import type { Exercise } from "../types/exercises";

/**
 * Lista de exercícios recomendados.
 */
const exercises: Exercise[] = [
  {
    title: "Respiração Guiada",
    duration: "5 min",
    icon: "breathing",
    route: "/breathing",
  },
  {
    title: "Meditação Rápida",
    duration: "3 min",
    icon: "rest",
    route: "/meditation",
  },
];

/**
 * Tela principal onde o usuário registra
 * como está se sentindo no dia.
 */
export default function Emotion() {
  const navigate = useNavigate();

  const { registerMood, status } = useMood();

  useEffect(() => {
    if (status === "success") navigate("/success");
    if (status === "error") navigate("/error");
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

              <p className="mt-1 text-gray-500">Como você está?</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-green-600 shadow-sm backdrop-blur">
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

            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.title}
                title={exercise.title}
                duration={exercise.duration}
                icon={exercise.icon}
                route={exercise.route}
              />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/history")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-medium text-white transition hover:bg-green-700"
          >
            Ver histórico completo
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}