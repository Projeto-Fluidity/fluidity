import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * BUSCAR CONFIGURAÇÕES DO USUÁRIO
 * ============================================================
 *
 * Recupera as configurações globais de notificações
 * pertencentes ao usuário autenticado.
 *
 * Embora a configuração seja identificada por user_id,
 * o device_id continua sendo persistido durante a fase
 * de migração para manter compatibilidade com os serviços
 * de Push Notification.
 */
export async function getSettings(userId: string) {
  const { data, error } = await supabase
    .from("reminder_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  /**
   * PGRST116 = "nenhum resultado encontrado"
   *
   * Não representa uma falha da aplicação.
   * Apenas indica que o usuário ainda não possui
   * configurações persistidas.
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
 * Persiste as configurações globais de notificações
 * do usuário autenticado.
 *
 * Utiliza UPSERT:
 *
 * - cria um registro caso ainda não exista;
 * - atualiza o registro existente caso já exista.
 *
 * Durante a migração arquitetural o registro continua
 * armazenando o device_id como metadado técnico para
 * manter compatibilidade com o sistema de Push
 * Notifications.
 *
 * A identidade da configuração passa a ser definida
 * pelo user_id.
 */
export async function saveSettings(
  userId: string,
  settings: {
    start_hour: number;
    end_hour: number;
    frequency_minutes: number;
    max_per_day: number;
    enabled: boolean;
  },
) {
  const deviceId = getDeviceId();

  const { error } = await supabase
    .from("reminder_settings")
    .upsert({
      user_id: userId,
      device_id: deviceId,
      ...settings,
    });

  if (error) {
    console.error("Erro ao salvar settings:", error);
  }
}
