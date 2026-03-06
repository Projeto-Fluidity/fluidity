import type { MoodType } from "../types/mood"

/**
 * Estrutura de um item de humor utilizado na interface.
 */
type MoodOption = {
  /** Descrição textual do humor */
  label: string

  /** Valor utilizado para persistência no banco */
  value: MoodType

  /** Emoji que representa visualmente o humor */
  emoji: string
}

/**
 * Lista de humores disponíveis na aplicação.
 *
 * Essa lista é utilizada para renderizar os botões
 * de seleção de humor no componente MoodSelector.
 */
export const moods: MoodOption[] = [
  { label: "Muito feliz", value: "very_happy", emoji: "😄" },
  { label: "Feliz", value: "happy", emoji: "🙂" },
  { label: "Neutro", value: "neutral", emoji: "😐" },
  { label: "Triste", value: "sad", emoji: "😔" },
  { label: "Muito triste", value: "very_sad", emoji: "😢" }
]
