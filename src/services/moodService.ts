/**
 * Serviço responsável por lidar com dados de humor.
 *
 * Ele abstrai três fontes:
 * - seed (mock em memória)
 * - storage (localStorage)
 * - api (Supabase)
 */

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
 * STORAGE (persistência local)
 */
const STORAGE_KEY = "fluidity:mood_mock";

function loadMock(): MoodRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveMock(data: MoodRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * SEED (estado em memória)
 *
 * Não persiste após reload.
 * Ideal para QA.
 */
let seedState: MoodRecord[] = [...moodMock];

function loadSeed(): MoodRecord[] {
  return [...seedState];
}

function resetSeedState() {
  seedState = [...moodMock];
}

/**
 * Utilitário de data
 */
function getRecordDate(record: MoodRecord): string {
  return record.checkin_date ?? toLocalDate(record.created_at);
}

/**
 * GET HISTORY
 */
export async function getMoodHistory(): Promise<MoodRecord[]> {
  const source = env.dataMode;

  if (source === "seed") {
    return loadSeed().sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }

  if (source === "storage") {
    return loadMock().sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }

  if (source === "api") {
    const { data, error } = await supabase
      .from("moods")
      .select("*")
      .order("checkin_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return [];

    const seen = new Set<string>();

    return (data ?? []).filter((record) => {
      const key = getRecordDate(record);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return [];
}

/**
 * SAVE MOOD
 */
export async function saveMood(
  mood: MoodType
): Promise<{ error?: boolean; message?: string } | void> {
  const source = env.dataMode;

  /**
   * SEED
   */
  if (source === "seed") {
    const today = getLocalDate();

    const alreadyExists = seedState.some(
      (item) => toLocalDate(item.created_at) === today
    );

    if (alreadyExists) {
      return { error: true, message: "Você já registrou seu humor hoje" };
    }

    const newRecord: MoodRecord = {
      id: String(Date.now()),
      mood,
      created_at: getCurrentTimestamp(),
    };

    seedState = [newRecord, ...seedState];

    if (env.forceError) {
      return { error: true, message: "Erro simulado (QA)" };
    }

    return;
  }

  /**
   * STORAGE
   */
  if (source === "storage") {
    const mockData = loadMock();
    const today = getLocalDate();

    const alreadyExists = mockData.some(
      (item) => toLocalDate(item.created_at) === today
    );

    if (alreadyExists) {
      return { error: true, message: "Você já registrou seu humor hoje" };
    }

    const newRecord: MoodRecord = {
      id: String(Date.now()),
      mood,
      created_at: getCurrentTimestamp(),
    };

    saveMock([newRecord, ...mockData]);

    if (env.forceError) {
      return { error: true, message: "Erro simulado (QA)" };
    }

    return;
  }

  /**
   * API
   */
  if (source === "api") {
    const today = getLocalDate();

    const { error } = await supabase.from("moods").insert({
      mood,
      checkin_date: today,
    });

    if (error) {
      return { error: true, message: error.message };
    }

    if (env.forceError) {
      return { error: true, message: "Erro simulado (QA)" };
    }
  }
}

/**
 * RESET (QA)
 */
export function resetMoodQA() {
  localStorage.removeItem(STORAGE_KEY);
  resetSeedState();

  console.log("Reset completo aplicado");
}
