import type { MoodType } from "../types/mood"

export const moods: {
  label: string
  value: MoodType
  emoji: string
}[] = [
  { label: "Muito feliz", value: "very_happy", emoji: "😄" },
  { label: "Feliz", value: "happy", emoji: "🙂" },
  { label: "Neutro", value: "neutral", emoji: "😐" },
  { label: "Triste", value: "sad", emoji: "😔" },
  { label: "Muito triste", value: "very_sad", emoji: "😢" }
]
