import { moods } from "../lib/moods";
import MoodButton from "./MoodButton";
import { useState } from "react";
import type { MoodType } from "../types/mood";

/**
 * Props do componente MoodSelector.
 */
type MoodSelectorProps = {
  registerMood: (mood: MoodType) => Promise<void>;
};

/**
 * Componente responsável por permitir que o usuário
 * registre seu humor diário.
 */
export default function MoodSelector({ registerMood }: MoodSelectorProps) {

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    const savedMood = localStorage.getItem("mood-value");
    return savedMood ? (savedMood as MoodType) : null;
  });

  const [message, setMessage] = useState<string | null>(null);

  async function handleSelectMood(mood: MoodType) {
    try {
      setSelectedMood(mood);

      await registerMood(mood);

      setSelectedMood(mood);
      setMessage("Humor registrado com sucesso");
    } catch {
      setMessage("Você já registrou seu humor hoje");
    }
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Como você está se sentindo hoje?
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => (
          <MoodButton
            key={mood.value}
            emoji={mood.emoji}
            label={mood.label}
            selected={selectedMood === mood.value}
            onSelect={() => handleSelectMood(mood.value)}
          />
        ))}
      </div>

      {message && (
        <p className="mt-4 text-sm text-green-600">
          {message}
        </p>
      )}

    </div>
  );
}
