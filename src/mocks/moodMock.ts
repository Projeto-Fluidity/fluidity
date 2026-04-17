import type { MoodRecord } from "../types/moodRecord";
// import type { MoodType } from "../types/mood";

/**
 * Mock de dados de humor para testes locais e QA.
 */
export const moodMock: MoodRecord[] = [
  {
    id: "1",
    mood: "happy",
    created_at: "2026-03-18T08:00:00Z",
  },
  {
    id: "2",
    mood: "sad",
    created_at: "2026-03-17T14:20:00Z",
  },
  {
    id: "3",
    mood: "anxious",
    created_at: "2026-03-16T21:10:00Z",
  },
  {
    id: "4",
    mood: "excited",
    created_at: "2026-03-15T10:30:00Z",
  },
  {
    id: "5",
    mood: "tired",
    created_at: "2026-03-14T19:45:00Z",
  },
];
