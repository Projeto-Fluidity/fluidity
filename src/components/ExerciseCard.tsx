import { ArrowRight, Check, CheckCircle, Monitor } from "lucide-react";

/**
 * Props do componente ExerciseCard.
 */
type ExerciseCardProps = {
  title: string;
  duration: string;
  icon?: "breathing" | "water" | "rest";
};

/**
 * Card responsável por exibir um exercício
 * recomendado para o usuário.
 *
 * Este componente segue o design definido
 * no Figma da aplicação Fluidity.
 */
export default function ExerciseCard({
  title,
  duration,
  icon,
}: ExerciseCardProps) {

  /**
   * Seleciona o ícone apropriado
   * com base no tipo do exercício.
   */
  const Icon =
    icon === "breathing"
      ? Check
      : icon === "water"
      ? CheckCircle
      : icon === "rest"
      ? Monitor
      : Check;

  return (
    <div
      className="
      group
      flex items-center justify-between
      bg-[#008236]
      rounded-3xl
      px-5 py-4
      shadow-[0_1px_3px_rgba(0,0,0,0.10)]
      transition-all duration-200
      hover:brightness-110
      cursor-pointer
    "
    >

      {/* Lado esquerdo */}
      <div className="flex items-center gap-4">

        {/* Ícone circular */}
        <div
          className="
          flex items-center justify-center
          w-11 h-11
          rounded-full
          border border-white/40
          text-white
        "
        >
          <Icon size={20} />
        </div>

        {/* Texto */}
        <div>

          <p className="font-semibold text-white">
            {title}
          </p>

          <p className="text-sm text-white/80">
            {duration}
          </p>

        </div>

      </div>

      {/* Seta */}
      <ArrowRight
        size={20}
        className="
        text-white
        transition-transform
        group-hover:translate-x-1
      "
      />

    </div>
  );
}
