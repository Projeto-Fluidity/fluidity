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
 * STORAGE (seed persistido)
 * ============================================================
 */

const STORAGE_KEY = "fluidity:mood_mock";
const SEED_KEY = "fluidity:mood_seed";

  function loadSeed(): MoodRecord[] {
    const stored = localStorage.getItem(SEED_KEY);
    if (!stored) return [...moodMock];
    try {
      return JSON.parse(stored);
    } catch {
      return [...moodMock];
    }
  }

  function saveSeed(data: MoodRecord[]) {
    localStorage.setItem(SEED_KEY, JSON.stringify(data));
  }

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
 * Retorna a "data de referência" de um registro,
 * priorizando checkin_date (API) e caindo em created_at (mock).
 */
function getRecordDate(record: MoodRecord): string {
  return record.checkin_date ?? toLocalDate(record.created_at);
}

/**
 * ============================================================
 * GET HISTORY
 * ============================================================
 */

export async function getMoodHistory(): Promise<MoodRecord[]> {
  const source = env.moodSource;

  // SEED → mock fixo
  if (source === "seed") {
    const data = loadSeed().sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return Array.isArray(data) ? data : [];
  }

  // STORAGE → localStorage
  if (source === "storage") {
    const data = loadMock().sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return Array.isArray(data) ? data : [];
  }

  // API → Supabase
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .order("checkin_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }

  if (!Array.isArray(data)) return [];

  // Deduplica mantendo apenas o registro mais recente por checkin_date
  const seen = new Set<string>();
  const deduped = data.filter((record) => {
    const dateKey = getRecordDate(record);
    if (seen.has(dateKey)) return false;
    seen.add(dateKey);
    return true;
  });

  return deduped;
}

/**
 * ============================================================
 * SAVE MOOD
 * ============================================================
 */

export async function saveMood(mood: MoodType): Promise<void> {
  const source = env.moodSource;

  // SEED não permite salvar
  if (source === "seed") {
    console.log("[MOCK] Salvando em SEED:", mood);

    if (Math.random() < 0.2) {
      throw new Error("Erro simulado (seed)");
    }

    const mockData = loadSeed();
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

    saveSeed([newRecord, ...mockData]);
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

    saveMock([newRecord, ...mockData]);
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
