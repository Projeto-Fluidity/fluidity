/**
 * Representa um lembrete do sistema.
 */
export type Reminder = {
  id: string;
  title: string;
  description: string;
  time: string;
  variant: "info" | "warning" | "emotion" | "relax";
  status: "pending" | "accepted" | "postponed";
};
