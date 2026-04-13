import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import StatusIcon from "../components/ui/StatusIcon";

export default function MoodSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center space-y-6 bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4]">
      
      {/* Ícone reutilizado */}
      <StatusIcon
        variant="success"
        icon={<Check size={20} strokeWidth={3} />}
      />

      {/* Texto */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-[#1E2939]">
          Humor registrado!
        </h1>
        <p className="text-sm text-[#4A5565]">
          Seu humor foi registrado com sucesso.
        </p>
      </div>

      {/* Botão */}
      <button
        onClick={() => navigate("/")}
        className="w-full max-w-xs rounded-xl py-3 font-medium text-white shadow-md 
        bg-gradient-to-r from-[#05DF72] to-[#00A63E] 
        active:scale-[0.98] transition"
      >
        Ir para Home
      </button>
    </div>
  );
}