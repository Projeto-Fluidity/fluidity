import type { MoodRecord } from "../types/moodRecord";
import type { MoodType } from "../types/mood";

/**
 * Mock de dados de humor para testes locais e QA.
 */
export const moodMock: MoodRecord[] = [
  {
    id: "1",
    mood: "happy" as MoodType,
    created_at: "2026-03-18T08:00:00Z",
  },
  {
    id: "2",
    mood: "sad" as MoodType,
    created_at: "2026-03-17T14:20:00Z",
  },
  {
    id: "3",
    mood: "calm" as MoodType,
    created_at: "2026-03-16T21:10:00Z",
  },
];
