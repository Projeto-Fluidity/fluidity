/**
 * Opcoes de adiamento disponiveis para o usuario.
 */


export type PostponeOption = {
  id: string;
  label: string;
  description: string;
};

export const postponeOptions: PostponeOption[] = [
  { id: "15min", label: "15 minutos", description: "Lembrar em 15 min" },
  { id: "30min", label: "30 minutos", description: "Lembrar em 30 min" },
  { id: "1h", label: "1 hora", description: "Lembrar em 1 hora" },
  { id: "2h", label: "2 horas", description: "Lembrar em 2 horas" },
  { id: "4h", label: "4 horas", description: "Lembrar em 4 horas" },
  { id: "amanha", label: "Amanhã", description: "Lembrar amanhã" },
];