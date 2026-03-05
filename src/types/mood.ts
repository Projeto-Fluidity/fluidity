export type MoodType =
  | "very_happy"
  | "happy"
  | "neutral"
  | "sad"
  | "very_sad"

export interface Mood {
  id: string
  user_id: string
  mood: MoodType
  note?: string
  created_at: string
}
