import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * GARANTE LEMBRETES FIXOS (CHECK-IN + HIDRATAÇÃO)
 * ============================================================
 *
 * Estratégia Sênior:
 * - Usa UPSERT (idempotente)
 * - Não depende de SELECT prévio
 * - Funciona com React Strict Mode (double execution)
 * - Evita race conditions
 *
 * Regras:
 * - Sempre existe 1 Check-in
 * - Sempre existe 1 Hidratação
 * - Nunca duplica (garantido por UNIQUE + onConflict)
 */
export async function ensureFixedReminders(): Promise<void> {
  console.log("🚀 ensureFixedReminders FOI CHAMADO");

  const deviceId = getDeviceId();

  /**
   * ============================================================
   * UPSERT DIRETO (SEM SELECT)
   * ============================================================
   */
  const { error } = await supabase
    .from("scheduled_reminders")
    .upsert(
      [
        {
          device_id: deviceId,
          type: "fixed",
          label: "Check-in",
          hour: 9,
          minute: 0,
          time: "09:00",
          active: true,
        },
        {
          device_id: deviceId,
          type: "fixed",
          label: "Hidratação",
          hour: 14,
          minute: 0,
          time: "14:00",
          active: true,
        },
      ],
      {
        onConflict: "device_id,label", // 🔥 ESSENCIAL
      }
    );

  /**
   * ============================================================
   * ERRO
   * ============================================================
   */
  if (error) {
    console.error("❌ Erro ao garantir reminders fixos:", error);
    return;
  }

  /**
   * ============================================================
   * SUCESSO
   * ============================================================
   */
  console.log("✅ Reminders fixos garantidos (idempotente)");
}
