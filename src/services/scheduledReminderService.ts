/**
 * ============================================================
 * SCHEDULED REMINDER SERVICE
 * ============================================================
 *
 * Responsável por:
 * - Garantir que o usuário tenha 1 lembrete fixo
 * - Evitar duplicidade no banco
 * - Não sobrescrever configurações do usuário
 *
 * IMPORTANTE:
 * - NÃO altera horários se já existir um registro
 * - NÃO cria múltiplos registros
 */

import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";

/**
 * Tipo auxiliar para evitar "any"
 */
type ScheduledReminder = {
  id: string;
  device_id: string;
  type: "fixed" | "custom";
  hour: number;
  minute: number;
  enabled: boolean;
  created_at: string;
};

/**
 * Garante que existe exatamente 1 lembrete fixo por device.
 *
 * Regra:
 * - Se NÃO existir → cria (09:00 padrão)
 * - Se já existir → NÃO faz nada
 *
 * Nunca sobrescreve dados existentes.
 */
export async function ensureFixedReminder(): Promise<void> {
  const deviceId = getDeviceId();

  /**
   * 1. Buscar lembretes FIXED do device
   *
   * NÃO usar maybeSingle aqui (pode quebrar com múltiplos registros)
   */
  const { data, error } = await supabase
    .from("scheduled_reminders")
    .select("*")
    .eq("device_id", deviceId)
    .eq("type", "fixed")
    .returns<ScheduledReminder[]>();

  if (error) {
    console.error("Erro ao verificar lembrete fixo:", error);
    return;
  }

  /**
   * 2. Se já existe → não faz nada
   */
  if (data && data.length > 0) {
    // Segurança extra: se tiver mais de 1, loga (não corrige automaticamente)
    if (data.length > 1) {
      console.warn(
        "[WARNING] Múltiplos lembretes FIXED encontrados:",
        data.length
      );
    }

    return;
  }

  /**
   * 3. Criar lembrete padrão (somente se não existir)
   */
  const { error: insertError } = await supabase
    .from("scheduled_reminders")
    .insert({
      device_id: deviceId,
      type: "fixed",
      hour: 9,
      minute: 0,
      enabled: true,
    });

  if (insertError) {
    console.error("Erro ao criar lembrete fixo:", insertError);
  } else {
    console.log("Lembrete fixo criado com sucesso (09:00)");
  }
}
