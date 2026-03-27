import AppLayout from "../components/layout/AppLayout";
import MoodSelector from "../components/MoodSelector";
import EmotionExerciseCard from "../components/EmotionExerciseCard";
import { useMood } from "../hooks/useMood";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import { MoodConfirmModal } from "../components/MoodConfirmModal";
import type { MoodType } from "../types/mood";

type EmotionExercise = {
  title: string;
  duration: string;
  icon: "breathing" | "meditation";
  route: string;
};

const exercises: EmotionExercise[] = [
  {
    title: "Respiração Guiada",
    duration: "5 min",
    icon: "breathing",
    route: "/breathing",
  },
  {
    title: "Meditação Rápida",
    duration: "3 min",
    icon: "meditation",
    route: "/meditation",
  },
];

export default function Emotion() {
  const navigate = useNavigate();
  const { registerMood, status } = useMood();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (status === "success") navigate("/success");
    if (status === "error") navigate("/error");
  }, [status, navigate]);

  function handleSelectMood(mood: MoodType) {
    setSelectedMood(mood);
    setIsConfirmOpen(true);
  }

  function handleConfirm() {
    if (!selectedMood) return;

    registerMood(selectedMood);
    setIsConfirmOpen(false);
  }

  function handleCancel() {
    setIsConfirmOpen(false);
  }

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

          {/* 🔥 AGORA COM CONFIRMAÇÃO */}
          <MoodSelector onSelect={handleSelectMood} />

          {/* Exercises */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Exercícios recomendados
            </h2>

            {exercises.map((exercise) => (
              <EmotionExerciseCard
                key={exercise.title}
                title={exercise.title}
                duration={exercise.duration}
                icon={exercise.icon}
                onClick={() => navigate(exercise.route)}
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

      {/* 🔥 MODAL */}
      {isConfirmOpen && (
        <MoodConfirmModal
          mood={selectedMood}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </AppLayout>
  );
}
