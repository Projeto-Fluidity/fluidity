type EnvConfig = {
  useMock: boolean;
};

/**
 * Centraliza as variáveis de ambiente da aplicação.
 */
export const env: EnvConfig = {
  useMock: import.meta.env.VITE_USE_MOCK === "true",
};
