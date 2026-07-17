/**
 * ============================================================
 * Page: MoodSuccess
 * ============================================================
 *
 * Descrição:
 * Tela exibida após o registro bem-sucedido do humor.
 *
 * Responsabilidades:
 *
 * - informar que o humor foi registrado;
 * - permitir retorno imediato para a Home;
 * - realizar redirecionamento automático após alguns segundos.
 *
 * Esta página não contém regras de negócio.
 * Todo o processo de registro do humor já foi concluído
 * antes de sua exibição.
 *
 * ============================================================
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Check } from "lucide-react";

import StatusIcon from "../components/ui/StatusIcon";

export default function MoodSuccess() {
  /**
   * Hook de navegação do React Router.
   */
  const navigate = useNavigate();

  /**
   * ==========================================================
   * REDIRECIONAMENTO AUTOMÁTICO
   * ==========================================================
   *
   * Após alguns segundos, o usuário é redirecionado
   * automaticamente para a Home.
   *
   * O botão "Ir para Home" continua disponível caso
   * o usuário deseje retornar imediatamente.
   */
  useEffect(() => {
    /**
     * Timer responsável pelo retorno automático.
     */
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    /**
     * Evita que o timer permaneça ativo caso
     * o componente seja desmontado antes do prazo.
     */
    return () => clearTimeout(timer);
  }, [navigate]);

  /**
   * Retorna imediatamente para a Home.
   */
  function handleGoToHome() {
    navigate("/");
  }

  /**
   * ==========================================================
   * RENDERIZAÇÃO
   * ==========================================================
   */
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-6 bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] px-6 text-center">
      {/* ======================================================
          Ícone de sucesso
         ====================================================== */}
      <StatusIcon
        variant="success"
        icon={<Check size={20} strokeWidth={3} />}
      />

      {/* ======================================================
          Mensagem
         ====================================================== */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-[#1E2939]">
          Humor registrado!
        </h1>

        <p className="text-sm text-[#4A5565]">
          Seu humor foi registrado com sucesso.
        </p>
      </div>

      {/* ======================================================
          Ação principal
         ====================================================== */}
      <button
        onClick={handleGoToHome}
        className="w-full max-w-xs rounded-xl bg-gradient-to-r from-[#05DF72] to-[#00A63E] py-3 font-medium text-white shadow-md transition active:scale-[0.98]"
      >
        Ir para Home
      </button>
    </div>
  );
}
