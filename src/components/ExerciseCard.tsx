import { ArrowRight, Wind, Sparkles } from "lucide-react";

/**
 * Props do componente ExerciseCard.
 */
type ExerciseCardProps = {
  title: string;
  duration: string;
  icon?: "breathing" | "meditation";
};

/**
 * Card responsável por exibir um exercício
 * recomendado para o usuário.
 */
export default function ExerciseCard({
  title,
  duration,
  icon,
}: ExerciseCardProps) {

  const Icon =
    icon === "breathing"
      ? Wind
      : icon === "meditation"
      ? Sparkles
      : Wind;

  return (
    <div className="
    group
    flex items-center justify-between
    bg-white border border-[#E5E7EB]
    rounded-xl p-4
    transition-all duration-200
    hover:bg-gray-50
    hover:shadow-sm
    cursor-pointer">

      {/* Lado esquerdo */}
      <div className="flex items-center gap-3">

        {/* Ícone circular */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
          <Icon size={20} />
        </div>

        {/* Texto */}
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{duration}</p>
        </div>

      </div>

      {/* Seta */}
      <ArrowRight size={18} className="text-gray-400 transition-transform group-hover:translate-x-1" />

    </div>
  );
}
