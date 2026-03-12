import { cn } from "../lib/utils";

/**
 * Props do componente MoodButton.
 */
type MoodButtonProps = {
  /** Emoji que representa o humor */
  emoji: string;

  /** Label descritiva do humor */
  label: string;

  /** Indica se o humor está selecionado */
  selected: boolean;

  /** Função executada quando o botão é selecionado */
  onSelect: () => void;
};

/**
 * Componente responsável por renderizar um botão de seleção de humor.
 *
 * Cada botão representa um estado emocional através de um emoji
 * e uma descrição textual.
 *
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
  label,
  selected,
  onSelect,
}: MoodButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border p-3 transition",
        "hover:bg-gray-50",
        selected
          ? "border-green-500 bg-green-50"
          : "border-gray-200"
      )}
    >
      <span className="text-2xl">{emoji}</span>

      <span className="mt-1 text-sm text-gray-600">
        {label}
      </span>
    </button>
  );
}
