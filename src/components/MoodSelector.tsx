import { moods } from "../lib/moods";
import MoodButton from "./MoodButton";
import { useState } from "react";
import type { MoodType } from "../types/mood";

/**
 * Props do componente MoodSelector.
 */
type MoodSelectorProps = {
  /**
   * Apenas notifica o humor selecionado
   */
  onSelect: (mood: MoodType) => void;
};

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  function handleSelectMood(mood: MoodType) {
    setSelectedMood(mood);
    onSelect(mood);
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>

        <h2 className="text-base font-medium text-gray-800">
          Como você está se sentindo hoje?
        </h2>
      </div>

      {/* Grid de emoções */}
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
    </div>
  );
}