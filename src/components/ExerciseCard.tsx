import { ArrowRight, Check, CheckCircle, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ExerciseIcon = "breathing" | "water" | "rest";

type ExerciseCardProps = {
  title: string;
  duration: string;
  icon?: ExerciseIcon;
  route: string;
  variant?: "default" | "highlight";
};

const iconMap = {
  breathing: Check,
  water: CheckCircle,
  rest: Monitor,
};

export default function ExerciseCard({
  title,
  duration,
  icon = "breathing",
  route,
  variant = "default",
}: ExerciseCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[icon];

  const styles =
    variant === "highlight"
      ? "bg-[#008236] text-white"
      : "bg-white text-gray-800";

  const iconStyles =
    variant === "highlight"
      ? "border border-white/40 text-white"
      : "bg-[#DCFCE7] text-green-600";

  const arrowStyles =
    variant === "highlight" ? "text-white" : "text-gray-400";

  return (
    <div
      onClick={() => navigate(route)}
      className={`group flex cursor-pointer items-center justify-between rounded-2xl px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md ${styles}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconStyles}`}
        >
          <Icon size={18} />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm opacity-70">{duration}</p>
        </div>
      </div>

      <ArrowRight
        size={20}
        className={`transition-transform group-hover:translate-x-1 ${arrowStyles}`}
      />
    </div>
  );
}