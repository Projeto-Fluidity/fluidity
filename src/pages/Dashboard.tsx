import MoodSelector from "../components/MoodSelector";
import MoodHistory from "../components/MoodHistory";
import { useMood } from "../hooks/useMood";
import { LayoutDashboard, Smile, History } from "lucide-react";

/**
 * Página principal da aplicação.
 *
 * Responsável por orquestrar os principais componentes
 * relacionados ao registro e visualização do humor do usuário.
 *
 * Estrutura da página:
 * - Header com título e descrição da funcionalidade
 * - Seção de registro de humor (MoodSelector)
 * - Seção de histórico de humor (MoodHistory)
 *
 * Arquitetura:
 * O hook `useMood` é instanciado apenas nesta página,
 * tornando o Dashboard a **fonte única de verdade (Single Source of Truth)**
 * para o estado relacionado ao humor do usuário.
 */
export default function Dashboard() {
  /**
   * Hook responsável por gerenciar o estado de humor da aplicação.
   */
  const { history, loading, registerMood } = useMood();

  /**
   * ============================================================
   * TESTE DE PUSH (APENAS DEV)
   * ============================================================
   *
   * NÃO interfere no fluxo de check-in
   * NÃO altera regras de negócio
   * Apenas dispara a Edge Function manualmente
   */
  const handleTestPush = async () => {
    try {
      await fetch("/functions/v1/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: "684f8619-74e0-43cb-bb47-413aba5fc7aa", // 🔁 seu device_id
        }),
      });

      console.log("Push enviado 🚀");
    } catch (err) {
      console.error("Erro ao enviar push:", err);
    }
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">Carregando dados...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl space-y-10">
        {/* Header */}
        <header className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>
          </div>

          <p className="text-slate-600">Registro diário de humor</p>
        </header>

        {/* 🔥 BOTÃO DEV (não impacta produção) */}
        {import.meta.env.DEV && (
          <div className="flex justify-center">
            <button
              onClick={handleTestPush}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Testar Push (DEV)
            </button>
          </div>
        )}

        {/* Registro de humor */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Smile className="h-5 w-5 text-slate-600" />

            <h2 className="text-sm font-semibold text-slate-700">
              Como você está hoje?
            </h2>
          </div>

          <MoodSelector onSelect={registerMood} />
        </section>

        {/* Histórico */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-600" />

            <h2 className="text-sm font-semibold text-slate-700">
              Histórico de humor
            </h2>
          </div>

          <MoodHistory records={history} />
        </section>
      </div>
    </main>
  );
}
