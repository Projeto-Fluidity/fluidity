import { useEffect, useState } from "react";
import type { MoodType } from "../types/mood";
import type { MoodRecord } from "../types/moodRecord";
import {
  getMoodHistory,
  saveMood,
} from "../services/moodService";

/**
 * Hook responsável por centralizar o estado e as operações
 * relacionadas ao humor do usuário.
 *
 * Responsabilidades:
 * - carregar o histórico de humores
 * - registrar um novo humor
 * - controlar estados de loading e erro
 * - informar o status da operação de registro
 *
 * Toda comunicação com o banco de dados é delegada
 * ao service `moodService`.
 */
export function useMood() {
  /**
   * Histórico de registros de humor.
   */
  const [history, setHistory] = useState<MoodRecord[]>([]);

  /**
   * Indica se os dados estão sendo carregados.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Armazena mensagens de erro.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Status da operação de registro de humor.
   */
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  /**
   * Carrega o histórico de humores do banco.
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
   * Registra um novo humor.
   *
   * O controle de duplicidade é garantido pelo banco de dados.
   * O frontend apenas reage ao erro retornado.
   *
   * @param mood Humor selecionado pelo usuário
   */
  async function registerMood(mood: MoodType) {
    try {
      setStatus("loading");
      setError(null);

      await saveMood(mood);

      await loadHistory();

      setStatus("success");
    } catch (err: unknown) {
      console.error("Erro ao registrar humor:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao registrar humor");
      };
        setStatus("error");
    }
  }

  /**
   * Carrega o histórico ao montar o componente.
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