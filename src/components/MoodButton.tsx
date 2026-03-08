import { cn } from "../lib/utils";

/**
 * Props do componente MoodButton.
 */
type MoodButtonProps = {
  /** Emoji que representa o humor */
  emoji: string;

  /** Indica se o humor está selecionado */
  selected: boolean;

  /** Função executada quando o botão é selecionado */
  onSelect: () => void;
};

/**
 * Componente responsável por renderizar um botão de seleção de humor.
 *
 * Cada botão representa um estado emocional através de um emoji.
 * O botão aplica estilos visuais diferentes quando está selecionado,
 * proporcionando feedback imediato ao usuário.
 *
 * Estilização:
 * - Utiliza Tailwind CSS para estilização baseada em utilitários
 * - Utiliza o helper `cn()` para composição segura de classes
 *
 * @param props Propriedades do botão de humor
 * @returns Elemento de botão representando um humor
 */
export default function MoodButton({
  emoji,
  selected,
  onSelect,
}: MoodButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "m-2 rounded-lg border p-3 text-2xl transition duration-200 hover:scale-105",
        selected
          ? "border-blue-500 bg-blue-100"
          : "border-gray-300 hover:bg-gray-100",
      )}
    >
      {emoji}
    </button>
  );
}
