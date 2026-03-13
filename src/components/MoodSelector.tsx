import { moods } from "../lib/moods";
import MoodButton from "./MoodButton";
import { useState } from "react";
import type { MoodType } from "../types/mood";

/**
 * Props do componente MoodSelector.
 */
type MoodSelectorProps = {
  /**
   * Função responsável por registrar um novo humor.
   * Essa função é fornecida pelo hook `useMood`
   * através da página Emotion.
   */
  registerMood: (mood: MoodType) => Promise<void>;
};

/**
 * Componente responsável por permitir que o usuário
 * registre seu humor diário.
 *
 * Funcionalidades:
 * - Exibe opções de humor através de emojis
 * - Permite selecionar um humor
 * - Executa o registro utilizando o hook `useMood`
 *
 * A navegação para telas de sucesso ou erro
 * é controlada pela página Emotion.
 */
export default function MoodSelector({ registerMood }: MoodSelectorProps) {

  /**
   * Estado responsável por armazenar o humor selecionado.
   */
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  /**
   * Manipula a seleção de humor pelo usuário.
   *
   * @param mood Humor selecionado
   */
  async function handleSelectMood(mood: MoodType) {
    setSelectedMood(mood);
    await registerMood(mood);
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">

      {/* Título */}
      <div className="flex items-center gap-2 mb-4">

        <span className="w-2 h-2 rounded-full bg-green-500"></span>

        <h2 className="text-base font-semibold">
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
