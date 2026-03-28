/**
 * Reminder = apenas dados (template)
 */
export type Reminder = {
  id: string;
  title: string;
  description: string;
  time: string;
  variant: "emotion" | "warning" | "info" | "relax";
};