/**
 * Props do componente MoodButton.
 */
type MoodButtonProps = {
  /** Emoji que representa o humor */
  emoji: string

  /** Indica se o humor está selecionado */
  selected: boolean

  /** Função executada quando o botão é selecionado */
  onSelect: () => void
}

/**
 * Componente responsável por renderizar um botão de seleção de humor.
 *
 * Cada botão representa um estado emocional através de um emoji.
 * O botão muda visualmente quando está selecionado.
 *
 * @param props Propriedades do botão de humor
 * @returns Elemento de botão representando um humor
 */
export default function MoodButton({ emoji, selected, onSelect }: MoodButtonProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        fontSize: "2rem",
        margin: "8px",
        padding: "10px",
        borderRadius: "10px",
        border: selected ? "2px solid blue" : "1px solid gray"
      }}
    >
      {emoji}
    </button>
  )
}
