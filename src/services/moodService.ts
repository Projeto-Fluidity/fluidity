import type { MoodType } from "../types/mood"
import type { MoodRecord } from "../types/moodRecord"
import { supabase } from "./supabaseClient"

/**

* Persiste no banco de dados o humor selecionado pelo usuário.
*
* O campo `created_at` é gerado automaticamente pelo banco
* através do valor padrão definido na tabela.
*
* @param mood Valor do humor selecionado pelo usuário
* @throws Error caso ocorra falha na inserção do registro
  */
  export async function saveMood(mood: MoodType): Promise<void> {
  const { error } = await supabase
  .from("moods")
  .insert({
  mood
  })

if (error) {
console.error("Erro ao salvar humor:", error)
throw new Error("Não foi possível salvar o humor")
}

console.log("Humor salvo:", mood)
}

/**

* Verifica se já existe um registro de humor para o dia atual.
*
* A consulta considera o intervalo completo do dia atual
* (00:00:00 até 23:59:59) baseado no campo `created_at`.
*
* @returns `true` caso já exista registro no dia atual
  */
  export async function hasMoodToday(): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0]

const startOfDay = `${today}T00:00:00`
const endOfDay = `${today}T23:59:59`

const { data, error } = await supabase
.from("moods")
.select("id")
.gte("created_at", startOfDay)
.lte("created_at", endOfDay)
.limit(1)

if (error) {
console.error("Erro ao verificar humor:", error)
return false
}

return (data?.length ?? 0) > 0
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
  .order("created_at", { ascending: false })

if (error) {
console.error("Erro ao buscar histórico:", error)
return []
}

return data ?? []
}
