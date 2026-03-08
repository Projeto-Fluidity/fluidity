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
 *
 * Dessa forma:
 * - O histórico é carregado e mantido neste componente
 * - A função `registerMood` é passada como prop para o MoodSelector
 * - O MoodHistory recebe os registros atualizados automaticamente
 *
 * Isso garante que qualquer alteração no estado
 * reflita imediatamente na interface sem necessidade de reload.
 *
 * Estilização:
 * - Utiliza Tailwind CSS para layout responsivo e organização visual
 * - Utiliza ícones da biblioteca Lucide para melhorar a leitura visual
 *
 * @returns Interface principal do dashboard da aplicação
 */
export default function Dashboard() {
  /**
   * Hook responsável por gerenciar o estado de humor da aplicação.
   *
   * history      → lista de registros de humor
   * loading      → estado de carregamento do histórico
   * registerMood → função responsável por registrar um novo humor
   */
  const { history, loading, registerMood } = useMood();

  /**
   * Renderização condicional exibida enquanto os dados
   * do histórico de humor estão sendo carregados.
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
      {/* Container principal da aplicação */}
      <div className="w-full max-w-3xl space-y-10">
        {/* Cabeçalho da página */}
        <header className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          </div>

          <p className="text-slate-600">Registro diário de humor</p>
        </header>

        {/* Seção de registro de humor */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Smile className="h-5 w-5 text-slate-600" />

            <h2 className="text-sm font-semibold text-slate-700">
              Como você está hoje?
            </h2>
          </div>

          {/* Componente responsável por registrar um novo humor */}
          <MoodSelector registerMood={registerMood} />
        </section>

        {/* Seção de histórico de humor */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-600" />

            <h2 className="text-sm font-semibold text-slate-700">
              Histórico de humor
            </h2>
          </div>

          {/* Lista de registros já realizados pelo usuário */}
          <MoodHistory records={history} />
        </section>
      </div>
    </main>
  );
}
