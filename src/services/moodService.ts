import type { MoodType } from "../types/mood"

export function saveMood(mood: MoodType) {

  const today = new Date().toISOString().split("T")[0]

  localStorage.setItem("mood-date", today)
  localStorage.setItem("mood-value", mood)

  console.log("Humor salvo:", mood)

}

export function hasMoodToday(): boolean {

  const today = new Date().toISOString().split("T")[0]

  const savedDate = localStorage.getItem("mood-date")

  return savedDate === today
}