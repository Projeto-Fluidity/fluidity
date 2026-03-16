import { ArrowRight, Smile, Lightbulb } from "lucide-react";

/**
 * Tipos de ícones disponíveis para os exercícios
 * exibidos na tela de Emotion.
 */
type EmotionExerciseIcon = "breathing" | "meditation";

/**
 * Props esperadas pelo componente EmotionExerciseCard.
 */
type EmotionExerciseCardProps = {
  /**
   * Título do exercício.
   */
  title: string;

  /**
   * Duração estimada do exercício.
   */
  duration: string;

  /**
   * Tipo de ícone associado ao exercício.
   */
  icon: EmotionExerciseIcon;

  /**
   * Função executada ao clicar no card.
   */
  onClick?: () => void;
};

/**
 * Mapa responsável por associar cada tipo de exercício
 * ao ícone correspondente exibido no card.
 */
const iconMap = {
  breathing: Smile,
  meditation: Lightbulb,
};

/**
 * Card utilizado exclusivamente na tela de Emotion
 * para exibir exercícios recomendados ao usuário.
 *
 * Diferente do componente ExerciseCard utilizado
 * em outras telas, este card segue o layout definido
 * no Figma para a tela inicial de registro emocional.
 *
 * Características visuais:
 * - fundo claro
 * - ícone centralizado em círculo verde claro
 * - seta indicando navegação
 */
export default function EmotionExerciseCard({
  title,
  duration,
  icon,
  onClick,
}: EmotionExerciseCardProps) {
  const Icon = iconMap[icon];

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-between rounded-2xl bg-white/70 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.10)] transition hover:shadow-md"
    >
      {/* Lado esquerdo do card */}
      <div className="flex items-center gap-3">
        {/* Container circular do ícone */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7]">
          <Icon size={18} strokeWidth={2} className="text-[#008236]" />
        </div>

        {/* Informações do exercício */}
        <div>
          <p className="font-medium text-gray-800">{title}</p>

          <p className="text-sm text-gray-500">{duration}</p>
        </div>
      </div>

      {/* Indicador de navegação */}
      <ArrowRight
        size={18}
        className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
      />
    </div>
  );
}
