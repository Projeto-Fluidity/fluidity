import { useEffect, useState } from "react";
import type { MoodType } from "../types/mood";
import type { MoodRecord } from "../types/moodRecord";
import { getMoodHistory, saveMood } from "../services/moodService";

/**
 * Hook responsável por centralizar o estado de humor.
 *
 * Ele controla:
 * - histórico
 * - loading
 * - erro
 * - status da operação
 */
export function useMood() {
  const [history, setHistory] = useState<MoodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  /**
   * Busca histórico no service
   */
  async function loadHistory() {
    try {
      const data = await getMoodHistory();
      setHistory(data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      setError("Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Registra um novo humor
   *
   * Importante:
   * - Não usamos throw no service
   * - O erro vem como retorno controlado
   */
  async function registerMood(mood: MoodType) {
    setStatus("loading");
    setError(null);

    try {
      const result = await saveMood(mood);

      if (result?.error) {
        setError(result.message || "Erro ao registrar humor");
        setStatus("error");
      } else {
        setStatus("success");
      }

      /**
       * Sempre atualiza histórico,
       * independentemente de sucesso ou erro.
       */
      await loadHistory();
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado");
      setStatus("error");
    }
  }

  /**
   * Carrega histórico ao iniciar
   */
  useEffect(() => {
    loadHistory();
  }, []);

  return {
    history,
    loading,
    error,
    status,
    registerMood,
    reload: loadHistory,
  };
}
