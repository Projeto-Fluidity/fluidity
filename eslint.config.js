import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * Configuração do ESLint para o projeto.
 *
 * Define regras de lint para JavaScript, TypeScript
 * e React, garantindo padronização e qualidade
 * do código durante o desenvolvimento.
 */
export default defineConfig([
  globalIgnores([
    "dist",
    "dev-dist",
    "node_modules",
    ".vite",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
      rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
