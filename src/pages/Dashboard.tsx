import MoodSelector from "../components/MoodSelector";
import MoodHistory from "../components/MoodHistory";

import { useMood } from "../hooks/useMood";

import {
  LayoutDashboard,
  Smile,
  History,
} from "lucide-react";

import {
  sendPushNotification,
} from "../services/notificationService";

/**
 * Página principal da aplicação.
 *
 * Responsável por orquestrar os principais componentes
 * relacionados ao registro e visualização do humor do usuário.
 *
 * ============================================================
 * ESTRUTURA DA PÁGINA
 * ============================================================
 *
 * - Header com título e descrição
 * - Registro de humor
 * - Histórico emocional
 * - Trigger DEV de push notification
 *
 * ============================================================
 * ARQUITETURA
 * ============================================================
 *
 * O hook `useMood` é instanciado apenas nesta página,
 * tornando o Dashboard a fonte única de verdade
 * (Single Source of Truth)
 * para o estado emocional da aplicação.
 */
export default function Dashboard() {

  /**
   * ==========================================================
   * MOOD STATE
   * ==========================================================
   */
  const {
    history,
    loading,
    registerMood,
  } = useMood();

  /**
   * ==========================================================
   * TESTE MANUAL DE PUSH (DEV ONLY)
   * ==========================================================
   *
   * Objetivo:
   *
   * Permitir validação rápida da infraestrutura
   * de notificações durante desenvolvimento.
   *
   * ==========================================================
   * IMPORTANTE
   * ==========================================================
   *
   * Esse fluxo:
   *
   * - NÃO representa o fluxo real do produto;
   * - NÃO faz parte da experiência do usuário;
   * - NÃO interfere no sistema de humor;
   * - NÃO altera regras de negócio.
   *
   * ==========================================================
   * TODO FUTURO
   * ==========================================================
   *
   * Substituir device_id fixo
   * por device_id dinâmico centralizado.
   */
  const handleTestPush = async () => {

    try {

      await sendPushNotification({
        // TODO:
        // remover device_id fixo após
        // estabilização da infraestrutura cloud
        device_id:
          "684f8619-74e0-43cb-bb47-413aba5fc7aa",

        title: "Fluidity 💧",

        body:
          "Teste manual de push notification",

        url: "/",
      });

      console.log(
        "Push enviado com sucesso"
      );

    } catch (err) {

      console.error(
        "Erro ao enviar push:",
        err
      );
    }
  };

  /**
   * ==========================================================
   * LOADING STATE
   * ==========================================================
   */
  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">
          Carregando dados...
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-slate-100 px-4 py-10">

      <div className="w-full max-w-3xl space-y-10">

        {/* ====================================================
            HEADER
        ===================================================== */}
        <header className="space-y-2 text-center">

          <div className="flex items-center justify-center gap-2">

            <LayoutDashboard className="h-7 w-7 text-slate-700" />

            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>
          </div>

          <p className="text-slate-600">
            Registro diário de humor
          </p>
        </header>

        {/* ====================================================
            DEV PUSH TEST
        ===================================================== */}
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

        {/* ====================================================
            MOOD REGISTER
        ===================================================== */}
        <section className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center gap-2">

            <Smile className="h-5 w-5 text-slate-600" />

            <h2 className="text-sm font-semibold text-slate-700">
              Como você está hoje?
            </h2>
          </div>

          <MoodSelector
            onSelect={registerMood}
          />
        </section>

        {/* ====================================================
            HISTORY
        ===================================================== */}
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
