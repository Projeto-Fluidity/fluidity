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
   * através do componente Dashboard.
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
 * - Registra o humor utilizando o hook `useMood`
 * - Exibe mensagens de feedback ao usuário
 *
 * O estado selecionado também é carregado do localStorage
 * caso exista um registro anterior salvo localmente.
 *
 * @returns Interface de seleção de humor
 */
export default function MoodSelector({ registerMood }: MoodSelectorProps) {
  /**
   * Hook responsável por controlar
   * o registro de humor e atualização do histórico.
   */

  /**
   * Estado responsável por armazenar o humor selecionado.
   * Inicialmente tenta recuperar valor salvo no localStorage.
   */
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    const savedMood = localStorage.getItem("mood-value");
    return savedMood ? (savedMood as MoodType) : null;
  });

  /**
   * Estado responsável por exibir mensagens
   * de feedback para o usuário.
   */
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Manipula a seleção de humor pelo usuário.
   *
   * O registro é delegado ao hook `useMood`,
   * que centraliza as regras de negócio e comunicação
   * com o banco de dados.
   *
   * @param mood Humor selecionado pelo usuário
   */
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
    <div>
      <h2>Como você está hoje?</h2>

      <div className="flex gap-3">
        {moods.map((mood) => (
          <MoodButton
            key={mood.value}
            emoji={mood.emoji}
            selected={selectedMood === mood.value}
            onSelect={() => handleSelectMood(mood.value)}
          />
        ))}
      </div>

      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
