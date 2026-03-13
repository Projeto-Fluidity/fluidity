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
  "flex flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 transition",
  "hover:bg-[#F3F4F6]",
  selected
    ? "border-green-500 bg-green-50"
    : ""
)}
>
  <span className="text-4xl">{emoji}</span>

  <span className="mt-2 text-xs text-gray-500">
    {label}
  </span>
</button>
  );
}
