import type { MoodType } from "../types/mood";
import type { MoodRecord } from "../types/moodRecord";
import { supabase } from "./supabaseClient";

/**
 * Persiste no banco de dados o humor selecionado pelo usuário.
 *
 * O campo `checkin_date` é definido com base no fuso local do usuário,
 * garantindo consistência com a regra de 1 registro por dia.
 *
 * @param mood Valor do humor selecionado pelo usuário
 * @throws Error caso ocorra falha na inserção do registro
 */
export async function saveMood(mood: MoodType): Promise<void> {
  const today = new Date().toLocaleDateString("en-CA");
  
  const { error } = await supabase.from("moods").insert({
    mood,
    checkin_date: today,
  });

  if (error) {
    console.error("Erro ao salvar humor:", error);

    if (error.code === "23505") {
      throw new Error("Você já registrou seu humor hoje");
    }

    throw new Error(error.message || "Não foi possível salvar o humor");
  }

  console.log("Humor salvo:", mood);
}

/**
 * Recupera o histórico de humores registrados.
 *
 * Os registros são retornados ordenados do mais recente
 * para o mais antigo com base no campo `created_at`.
 *
 * @returns lista de registros de humor
 */
export async function getMoodHistory(): Promise<MoodRecord[]> {
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }

  return data ?? [];
}