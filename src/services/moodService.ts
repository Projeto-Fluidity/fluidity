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

const USE_MOCK = env.useMock;

if (import.meta.env.DEV) {
  console.log("USE_MOCK:", USE_MOCK);
}

/**
 * Persiste no banco de dados o humor selecionado pelo usuário.
 */
export async function saveMood(mood: MoodType): Promise<void> {
  if (USE_MOCK) {
    console.log("[MOCK] Salvando humor:", mood);

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

    throw new Error(error.message || "Não foi possível salvar o humor");
  }

  console.log("Humor salvo:", mood);
}

/**
 * Recupera o histórico de humores registrados.
 */
export async function getMoodHistory(): Promise<MoodRecord[]> {
  if (USE_MOCK) {
    console.log("[MOCK] Buscando histórico");

    const data = loadMock();

    return data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }

  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .order("created_at", { ascending: false });

  if (import.meta.env.DEV) {
    console.log("DATA FROM DB:", data);
  }

  if (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }

  return data ?? [];
}
