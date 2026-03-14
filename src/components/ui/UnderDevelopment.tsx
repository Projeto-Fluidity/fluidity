import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Props do componente UnderDevelopment.
 */
type UnderDevelopmentProps = {
  title: string;
  description: string;
};

/**
 * Componente reutilizável para exibir
 * funcionalidades que ainda estão em desenvolvimento.
 */
export default function UnderDevelopment({
  title,
  description,
}: UnderDevelopmentProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      {/* Ícone */}
      <div className="mb-4 text-5xl">🚧</div>

      {/* Título */}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* Descrição */}
      <p className="mt-2 max-w-sm text-gray-500">{description}</p>

      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 flex items-center gap-2 text-sm text-green-600 transition hover:text-green-700"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>
    </div>
  );
}
