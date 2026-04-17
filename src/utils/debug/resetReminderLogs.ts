/**
 * 🧪 Reset dos logs de lembretes (QA / DEV ONLY)
 */
import { env } from "../../config/env";
import { supabase } from "../../services/supabaseClient";

export async function resetReminderLogs() {
  if (import.meta.env.PROD) {
    console.warn("Reset bloqueado em produção");
    return;
  }
  if (env.useMock) {
    const { resetMockLogs } = await import("../../mocks/reminderLogMock");
    resetMockLogs();
    console.log("[QA] Logs resetados (mock)");
    return;
  }

  const { error } = await supabase
    .from("reminder_logs")
    .delete()
    .neq("id", "");

  if (error) {
    console.error("Erro ao resetar logs:", error);
  }

  console.log("[QA] Logs resetados (DB)");
}
