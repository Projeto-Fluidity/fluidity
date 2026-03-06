import type { MoodType } from "../types/mood"
import { supabase } from "./supabaseClient"

export async function saveMood(mood: MoodType) {

  const { error } = await supabase
    .from("moods")
    .insert({
      mood: mood
    })

  if (error) {
    console.error("Erro ao salvar humor:", error)
    return
  }

  console.log("Humor salvo:", mood)
}

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
