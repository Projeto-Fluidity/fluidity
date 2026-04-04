import type { MoodType } from "../types/mood";
import type { MoodRecord } from "../types/moodRecord";
import { supabase } from "./supabaseClient";
import { moodMock } from "../mocks/moodMock";
import { env } from "../config/env";
import {
  getLocalDate,
  getCurrentTimestamp,
  toLocalDate,
} from "../lib/date";

/**
 * ============================================================
 * STORAGE (mock persistido)
 * ============================================================
 */

const STORAGE_KEY = "fluidity:mood_mock";

function loadMock(): MoodRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return [...moodMock];

  try {
    return JSON.parse(stored);
  } catch {
    return [...moodMock];
  }
}

function saveMock(data: MoodRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * ============================================================
 * GET HISTORY
 * ============================================================
 */

export async function getMoodHistory(): Promise<MoodRecord[]> {
  const source = env.moodSource;

  // 🟢 SEED → mock fixo
  if (source === "seed") {
    console.log("[MOCK] Using SEED mood");

    const data = [...moodMock].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

    return Array.isArray(data) ? data : [];
  }

  // 🔵 STORAGE → localStorage
  if (source === "storage") {
    console.log("[MOCK] Using STORAGE mood");

    const data = loadMock().sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

    return Array.isArray(data) ? data : [];
  }

  // 🟣 API → Supabase
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * ============================================================
 * SAVE MOOD
 * ============================================================
 */

export async function saveMood(mood: MoodType): Promise<void> {
  const source = env.moodSource;

  // ❌ SEED não permite salvar
  if (source === "seed") {
    console.warn("[MOCK] Seed mode não permite salvar");
    return;
  }

  // 🔵 STORAGE
  if (source === "storage") {
    console.log("[MOCK] Salvando em STORAGE:", mood);

    const mockData = loadMock();
    const today = getLocalDate();

    const alreadyExists = mockData.some(
      (item) => toLocalDate(item.created_at) === today
    );

    if (alreadyExists) {
      throw new Error("Você já registrou seu humor hoje");
    }

    const newRecord: MoodRecord = {
      id: String(Date.now()),
      mood,
      created_at: getCurrentTimestamp(),
    };

    const updated = [newRecord, ...mockData];

    saveMock(updated);
    return;
  }

  // 🟣 API
  const today = getLocalDate();

  const { error } = await supabase.from("moods").insert({
    mood,
    checkin_date: today,
  });

  if (error) {
    console.error("Erro ao salvar humor:", error);

    if (error.code === "23505") {
      throw new Error("Você já registrou seu humor hoje");
    }

    throw new Error(error.message || "Erro ao salvar");
  }

  console.log("Humor salvo:", mood);
}
