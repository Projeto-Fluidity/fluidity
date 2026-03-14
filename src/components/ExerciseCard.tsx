import { ArrowRight, Check, CheckCircle, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Tipos possíveis de ícone para os exercícios.
 */
type ExerciseIcon = "breathing" | "water" | "rest";

/**
 * Props do componente ExerciseCard.
 */
type ExerciseCardProps = {
  title: string;
  duration: string;
  icon?: ExerciseIcon;
  route: string;
};

/**
 * Mapa responsável por associar
 * cada tipo de exercício ao ícone correspondente.
 */
const iconMap = {
  breathing: Check,
  water: CheckCircle,
  rest: Monitor,
};

/**
 * Card responsável por exibir um exercício
 * recomendado para o usuário.
 */
export default function ExerciseCard({
  title,
  duration,
  icon = "breathing",
  route,
}: ExerciseCardProps) {
  const navigate = useNavigate();

  const Icon = iconMap[icon];

  return (
    <div
      onClick={() => navigate(route)}
      className="group flex cursor-pointer items-center justify-between rounded-3xl bg-[#008236] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.10)] transition-all duration-200 hover:brightness-110"
    >
      {/* Lado esquerdo */}
      <div className="flex items-center gap-4">
        {/* Ícone circular */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white">
          <Icon size={20} />
        </div>

        {/* Texto */}
        <div>
          <p className="font-semibold text-white">{title}</p>

          <p className="text-sm text-white/80">{duration}</p>
        </div>
      </div>

      {/* Seta */}
      <ArrowRight
        size={20}
        className="text-white transition-transform group-hover:translate-x-1"
      />
    </div>
  );
}
