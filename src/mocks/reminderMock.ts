import type { Reminder } from "../types/reminder";

const STORAGE_KEY = "mock_reminders";

/**
 * Dados iniciais (seed)
 */
const initialData: Reminder[] = [
  {
    id: "1",
    title: "Hora de se hidratar",
    description: "Você não bebe água há 2 horas",
    time: "14:30",
    variant: "info",
    status: "pending",
  },
  {
    id: "2",
    title: "Faça uma pausa",
    description: "Você está trabalhando há 3 horas seguidas",
    time: "15:00",
    variant: "warning",
    status: "pending",
  },
  {
    id: "3",
    title: "Como está seu humor?",
    description: "Registre seu humor do momento",
    time: "16:00",
    variant: "emotion",
    status: "pending",
  },
  {
    id: "4",
    title: "Hora de relaxar",
    description: "Pratique respiração guiada antes de dormir",
    time: "21:00",
    variant: "relax",
    status: "pending",
  },
];

/**
 * Recupera dados do "banco fake"
 */
export function getMockReminders(): Reminder[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  return JSON.parse(stored);
}

/**
 * Salva no "banco fake"
 */
export function setMockReminders(data: Reminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
