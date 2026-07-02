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
          type: "fixed_mood",
          label: "Registro diário",
          hour: 8,
          minute: 0,
          time: "08:00",
          active: true,
        },
        {
          device_id: deviceId,
          type: "fixed_hydration",
          label: "Hora de se hidratar",
          hour: 9,
          minute: 0,
          time: "09:00",
          active: true,
        },
      ],
      {
        onConflict: "device_id,label", // ESSENCIAL
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

}
