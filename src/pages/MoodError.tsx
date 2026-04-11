import { AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusIcon from "../components/ui/StatusIcon";
import Button from "../components/ui/Button";

/**
 * Tela exibida quando ocorre erro
 * ao registrar o humor do usuário.
 *
 * Versão fiel ao Figma.
 * Utiliza o AppLayout para estrutura global.
 */
export default function MoodError() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center space-y-6 bg-gradient-to-b from-[#FFE2E2] to-[#FEF2F2]">
      
      {/* Ícone de erro */}
      <StatusIcon
        variant="error"
        icon={<AlertCircle size={64} />}
      />

      {/* Mensagem */}
      <p className="text-base font-semibold text-[#1E2939] leading-relaxed">
        Não foi possível salvar o seu humor.
        <br />
        Tente novamente
      </p>

      {/* Ação */}
      <Button
        variant="error"
        className="h-12 px-6 rounded-xl shadow-md"
        icon={<RefreshCw size={16} />}
        onClick={() => navigate("/")}
      >
        Voltar para home
      </Button>
    </div>
  );
}