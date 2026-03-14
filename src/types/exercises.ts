/**
 * Representa um exercício de bem-estar
 * recomendado ao usuário dentro da aplicação.
 */
export type Exercise = {
  title: string;
  duration: string;
  icon: "breathing" | "water" | "rest";
  route: string;
};
