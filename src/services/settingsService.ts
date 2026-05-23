import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * BUSCAR CONFIGURAÇÕES DO DISPOSITIVO
 * ============================================================
 *
 * Retorna as configurações salvas para o device atual.
 */
export async function getSettings() {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("reminder_settings")
    .select("*")
    .eq("device_id", deviceId)
    .single();

  /**
   * PGRST116 = "nenhum resultado encontrado"
   * Não é erro real, só significa que ainda não existe config
   */
  if (error && error.code !== "PGRST116") {
    console.error("Erro ao buscar settings:", error);
  }

  return data;
}

/**
 * ============================================================
 * SALVAR / ATUALIZAR CONFIGURAÇÕES
 * ============================================================
 *
 * Usa UPSERT:
 * - se não existir → cria
 * - se existir → atualiza
 */
export async function saveSettings(settings: {
  start_hour: number;
  end_hour: number;
  frequency_minutes: number;
  max_per_day: number;
  enabled: boolean;
}) {
  const deviceId = getDeviceId();

  const { error } = await supabase
    .from("reminder_settings")
    .upsert({
      device_id: deviceId,
      ...settings,
    });

  if (error) {
    console.error("Erro ao salvar settings:", error);
  }
}
