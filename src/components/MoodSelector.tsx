import { moods } from "../lib/moods"
import MoodButton from "./MoodButton"
import { useState } from "react"
import { saveMood } from "../services/moodService"
import type { MoodType } from "../types/mood"
import { hasMoodToday } from "../services/moodService"

/**
 * Componente responsável por permitir que o usuário
 * registre seu humor diário.
 *
 * Funcionalidades:
 * - Exibe opções de humor através de emojis
 * - Permite selecionar um humor
 * - Verifica se o usuário já registrou humor no dia
 * - Salva o humor selecionado no banco de dados
 * - Exibe mensagens de feedback ao usuário
 *
 * O estado selecionado também é carregado do localStorage
 * caso exista um registro anterior salvo localmente.
 *
 * @returns Interface de seleção de humor
 */
export default function MoodSelector() {

  /**
   * Estado responsável por armazenar o humor selecionado.
   * Inicialmente tenta recuperar valor salvo no localStorage.
   */
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    const savedMood = localStorage.getItem("mood-value")
    return savedMood ? (savedMood as MoodType) : null
  })

  /**
   * Estado responsável por exibir mensagens
   * de feedback para o usuário.
   */
  const [message, setMessage] = useState<string | null>(null)

  /**
   * Manipula a seleção de humor pelo usuário.
   *
   * Antes de registrar o humor, verifica se já existe
   * um registro no dia atual para evitar duplicidade.
   *
   * @param mood Humor selecionado pelo usuário
   */
  async function handleSelectMood(mood: MoodType) {

    if (await hasMoodToday()) {
      setMessage("Você já registrou seu humor hoje")
      return
    }

    setSelectedMood(mood)

    saveMood(mood)

    setMessage("Humor registrado com sucesso")
  }

  return (
    <div>
      <h2>Como você está hoje?</h2>

      <div>
        {moods.map((mood) => (
          <MoodButton
            key={mood.value}
            emoji={mood.emoji}
            selected={selectedMood === mood.value}
            onSelect={() => handleSelectMood(mood.value)}
          />
        ))}
      </div>

      {message && (
        <p>{message}</p>
      )}

    </div>
  )
}
