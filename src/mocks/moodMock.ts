import type { MoodRecord } from "../types/moodRecord";
// import type { MoodType } from "../types/mood";

/**
 * Mock de dados de humor para testes locais e QA.
 */
export const moodMock: MoodRecord[] = [
  {
    id: "1",
    user_id: "mock-user-1",
    mood: "happy",
    checkin_date: "2026-03-18",
    created_at: "2026-03-18T08:00:00Z",
  },
  {
    id: "2",
    user_id: "mock-user-1",
    mood: "sad",
    checkin_date: "2026-03-17",
    created_at: "2026-03-17T14:20:00Z",
  },
  {
    id: "3",
    user_id: "mock-user-1",
    mood: "anxious",
    checkin_date: "2026-03-16",
    created_at: "2026-03-16T21:10:00Z",
  },
  {
    id: "4",
    user_id: "mock-user-1",
    mood: "excited",
    checkin_date: "2026-03-15",
    created_at: "2026-03-15T10:30:00Z",
  },
  {
    id: "5",
    user_id: "mock-user-1",
    mood: "tired",
    checkin_date: "2026-03-14",
    created_at: "2026-03-14T19:45:00Z",
  },
  {
    id: "6",
    user_id: "mock-user-1",
    mood: "angry",
    checkin_date: "2026-03-13",
    created_at: "2026-03-13T16:15:00Z",
  },
];
