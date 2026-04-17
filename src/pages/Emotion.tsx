/**
 * ============================================================
 * Page: Emotion
 * ============================================================
 *
 * Descrição:
 * Esta página é o ponto principal do MVP do Fluidity.
 * Aqui o usuário:
 * - Visualiza uma saudação
 * - Seleciona seu humor do dia
 * - Confirma o registro via modal
 * - Acessa exercícios recomendados
 * - Navega para histórico e configurações
 *
 * ------------------------------------------------------------
 * Fluxo principal:
 *
 * 1. Usuário seleciona um humor
 * 2. Modal de confirmação é aberto
 * 3. Usuário confirma
 * 4. Hook (useMood) registra o humor
 * 5. Status é atualizado (success | error)
 * 6. useEffect redireciona para próxima tela
 *
 * ------------------------------------------------------------
 * Estrutura de responsabilidades:
 *
 * - UI (renderização): este componente
 * - Estado de UI: useState (modal + seleção)
 * - Regra de negócio: useMood (hook)
 * - Navegação: react-router
 *
 * ------------------------------------------------------------
 * Melhorias aplicadas:
 *
 * - Botão de configurações (engrenagem) adicionado
 * - Navegação desacoplada em função dedicada
 * - Código organizado em handlers claros
 * - Documentação para facilitar onboarding de devs juniores
 *
 * ============================================================
 */

import MoodSelector from "../components/MoodSelector";
import EmotionExerciseCard from "../components/EmotionExerciseCard";
import { useMood } from "../hooks/useMood";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, Settings } from "lucide-react";
import { MoodConfirmModal } from "../components/MoodConfirmModal";
import type { MoodType } from "../types/mood";

/**
 * Tipagem dos exercícios exibidos na tela
 */
type EmotionExercise = {
  title: string;
  duration: string;
  icon: "breathing" | "meditation";
  route: string;
};

/**
 * Lista fixa de exercícios recomendados
 * Pode futuramente vir de API ou configuração dinâmica
 */
const exercises: EmotionExercise[] = [
  {
    title: "Respiração Guiada",
    duration: "5 min",
    icon: "breathing",
    route: "/breathing",
  },
  {
    title: "Meditação Rápida",
    duration: "3 min",
    icon: "meditation",
    route: "/meditation",
  },
];

export default function Emotion() {
  /**
   * Hook de navegação do React Router
   */
  const navigate = useNavigate();

  /**
   * Hook responsável pela regra de negócio do humor
   * registerMood → envia/registrar humor
   * status → controla sucesso/erro da operação
   */
  const { registerMood, status } = useMood();

  /**
   * Estado do humor selecionado pelo usuário
   */
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  /**
   * Controla abertura do modal de confirmação
   */
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  /**
   * Efeito responsável por reagir ao resultado do registro
   *
   * Se sucesso → vai para tela de sucesso
   * Se erro → vai para tela de erro
   */
  useEffect(() => {
    if (status === "success") navigate("/success");
    if (status === "error") navigate("/error");
  }, [status, navigate]);

  /**
   * Quando o usuário seleciona um humor:
   * - Salva no estado
   * - Abre o modal de confirmação
   */
  function handleSelectMood(mood: MoodType) {
    setSelectedMood(mood);
    setIsConfirmOpen(true);
  }

  /**
   * Confirmação do registro:
   * - Garante que existe um humor selecionado
   * - Chama o hook de registro
   * - Fecha o modal
   */
  function handleConfirm() {
    if (!selectedMood) return;

    registerMood(selectedMood);
    setIsConfirmOpen(false);
  }

  /**
   * Cancela o modal sem registrar nada
   */
  function handleCancel() {
    setIsConfirmOpen(false);
  }

  /**
   * Navega para tela de configurações
   *
   * Esse botão foi adicionado como melhoria de UX
   * para acesso rápido às preferências do usuário
   */
  function handleGoToSettings() {
    navigate("/settings");
  }

  return (
    <>
      {/* Background principal da tela */}
      <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-6">
          {/* ======================================================
              Header (Saudação + Ações)
             ====================================================== */}
          <div className="flex items-start justify-between">
            {/* Texto de saudação */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Olá, Mariana!
              </h1>
              <p className="mt-1 text-gray-500">Como você está?</p>
            </div>

            {/* Ações do topo (Configurações + Usuário) */}
            <div className="flex items-center gap-2">
              {/* Botão de configurações */}
              <button
                onClick={handleGoToSettings}
                aria-label="Ir para configurações"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-green-600 shadow-sm backdrop-blur transition hover:bg-white"
              >
                <Settings size={20} />
              </button>

              {/* Avatar do usuário (placeholder por enquanto) */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-green-600 shadow-sm backdrop-blur">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* ======================================================
              Seleção de Humor
             ====================================================== */}
          <MoodSelector onSelect={handleSelectMood} />

          {/* ======================================================
              Exercícios Recomendados
             ====================================================== */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Exercícios recomendados
            </h2>

            {exercises.map((exercise) => (
              <EmotionExerciseCard
                key={exercise.title}
                title={exercise.title}
                duration={exercise.duration}
                icon={exercise.icon}
                onClick={() => navigate(exercise.route)}
              />
            ))}
          </div>

          {/* ======================================================
              Botão para histórico completo
             ====================================================== */}
          <button
            onClick={() => navigate("/history")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-medium text-white transition hover:bg-green-700"
          >
            Ver histórico completo
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ======================================================
            Modo QA (apenas em desenvolvimento)
           ====================================================== */}
        {import.meta.env.DEV && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => window.resetMoodMock?.()}
              className="rounded-lg border border-blue-400 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
            >
              Resetar humor (QA)
            </button>
          </div>
        )}
      </div>

      {/* ======================================================
          Modal de confirmação
         ====================================================== */}
      {isConfirmOpen && (
        <MoodConfirmModal
          mood={selectedMood}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
