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
 * Responsabilidades:
 * - Exibir opções de humor através de emojis
 * - Permitir seleção de humor
 * - Executar o registro utilizando o hook `useMood`
 *
 * Observação:
 * Este componente não controla navegação.
 * A página `Emotion` é responsável por redirecionar
 * para telas de sucesso ou erro.
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
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="mb-4 flex items-center gap-2">
        {/* Indicador visual */}
        <span className="h-2 w-2 rounded-full bg-green-500"></span>

        {/* Título */}
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
