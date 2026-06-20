/**

  * Serviço responsável por lidar com dados de humor.
  *
  * Ele abstrai três fontes:
  * * seed (mock em memória)
  * * storage (localStorage)
  * * api (Supabase)
  *
  * Observação importante:
  * * O modo de erro (QA) é avaliado dinamicamente via localStorage
  * * Isso permite simular erro sem recarregar a aplicação
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
  import { getDeviceId } from "../lib/deviceId"; 

  type SaveMoodResult = {
    error?: boolean;
    message?: string;
    code?: "ALREADY_REGISTERED";
  };

  /**

  * ============================================================
  * STORAGE (persistência local)
  * ============================================================
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

  * ============================================================
  * SEED (estado em memória)
  * ============================================================
    */

  let seedState: MoodRecord[] = [...moodMock];

  function loadSeed(): MoodRecord[] {
    return [...seedState];
  }

  function resetSeedState() {
    seedState = [...moodMock];
  }

  /**
  * ============================================================
  * UTILITÁRIOS
  * ============================================================
    */

  /**

  * Obtém a data de referência do registro
  */
  function getRecordDate(record: MoodRecord): string {
   return record.checkin_date ?? toLocalDate(record.created_at);
  }

  /**

  * Verifica se o modo de erro forçado está ativo
  */
  function isForceErrorEnabled(): boolean {
    return (
    localStorage.getItem("debug:forceError") === "true" ||
    env.forceError
    );
  }

  /**

  * ============================================================
  * GET HISTORY
  * ============================================================
    */

  export async function getMoodHistory(): Promise<MoodRecord[]> {
    const source = env.dataMode;

    if (source === "seed") {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      return loadSeed()
        .filter(
          (record) => record.user_id === user.id
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      }

      if (source === "storage") {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return [];
        }

        return loadMock()
          .filter(
            (record) => record.user_id === user.id
          )
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
      }

      if (source === "api") {
      /**
       * Recupera usuário autenticado.
       */
        const {
          data: { user },
      } = await supabase.auth.getUser();  

      /**
       * Sem usuário autenticado.
       */
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erro ao buscar histórico:",
          error
        );

        return [];
      }

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

  * ============================================================
  * SAVE MOOD
  * ============================================================
    */

  export async function saveMood(
    mood: MoodType
  ): Promise<SaveMoodResult
   | void> {
    const source = env.dataMode;

  /**

  * ========================================================
  * SEED (memória)
  * ========================================================
    */
    if (source === "seed") {
    const today = getLocalDate();
    /**
     * Recupera usuário autenticado.
     */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: true,
        message: "Usuário não autenticado",
      };
    }

    const alreadyExists = seedState.some(
      (item) =>
        item.user_id === user.id &&
        getRecordDate(item) === today
    );

  if (alreadyExists) {
    return { 
      error: true, 
      code: "ALREADY_REGISTERED",
      message: "Você já registrou seu humor hoje" };
  }

  const newRecord: MoodRecord = {
    id: String(Date.now()),
    user_id: user.id,
    mood,
    checkin_date: today,
    created_at: getCurrentTimestamp(),
  };

  seedState = [newRecord, ...seedState];

  if (isForceErrorEnabled()) {
    return { error: true, message: "Erro simulado (QA)" };
  }

  return;

  }

  /**

  * ========================================================
  * STORAGE (persistente)
  * ========================================================
    */
    if (source === "storage") {
    const mockData = loadMock();
    const today = getLocalDate();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: true,
        message: "Usuário não autenticado",
      };
    }

    const alreadyExists = mockData.some(
      (item) =>
        item.user_id === user.id &&
        getRecordDate(item) === today
    );

    if (alreadyExists) {
      return { error: true, 
        code: "ALREADY_REGISTERED",
        message: "Você já registrou seu humor hoje", 
      };
    }

    const newRecord: MoodRecord = {
      id: String(Date.now()),
      user_id: user.id,
      mood,
      checkin_date: today,
      created_at: getCurrentTimestamp(),
    };

    saveMock([newRecord, ...mockData]);

    if (isForceErrorEnabled()) {
      return { error: true, message: "Erro simulado (QA)" };
    }

    return;

  }

  /**

  * ========================================================
  * API (Supabase)
  * ========================================================
  */
  if (source === "api") {
    const today = getLocalDate();

    /**
     * Recupera usuário autenticado.
     */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: true,
        message: "Usuário não autenticado",
      };
    }

    const { error } = await supabase
    .from("moods")
    .insert({
      mood,
      checkin_date: today,

      /**
       * Novo ownership.
       */
      user_id: user.id,

      /**
       * Compatibilidade temporária.
       */
      device_id: getDeviceId(),
    });

  if (error) {

    const isDuplicateMood =
      error.code === "23505" &&
      error.message?.includes(
        "moods_user_day_unique"
      );

    if (isDuplicateMood) {
      return {
        error: true,
        code: "ALREADY_REGISTERED",
        message: "Você já registrou seu humor hoje",
      };
    }

    return {
      error: true,
      message: error.message,
    };
  }

    if (isForceErrorEnabled()) {
      return {
        error: true,
        message: "Erro simulado (QA)",
      };
    }
  }
}
/**

* ============================================================
* RESET (QA)
* ============================================================
  */

export function resetMoodQA() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("debug:forceError");

  resetSeedState();
}

