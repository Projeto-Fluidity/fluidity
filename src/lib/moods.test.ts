import { describe, expect, it } from "vitest";

import { getMoodDefinition } from "./moods";

/**
 * ============================================================================
 * Testes unitários de moods.ts
 * ============================================================================
 *
 * Este arquivo valida o comportamento das regras de negócio relacionadas
 * aos humores disponíveis na aplicação.
 *
 * Cada teste deve validar apenas um comportamento específico, mantendo
 * os cenários simples, independentes e de fácil compreensão.
 *
 * Estrutura utilizada:
 *
 * Arrange → prepara os dados necessários para o teste.
 * Act     → executa a funcionalidade que será testada.
 * Assert  → verifica se o resultado obtido é o esperado.
 */
describe("getMoodDefinition", () => {
  /**
   * Cenário:
   * Quando um humor existente é informado,
   * a função deve retornar todas as informações
   * associadas a esse humor.
   */
  it("deve retornar a definição completa de um humor existente", () => {
    /**
     * Arrange
     *
     * Prepara o dado que será utilizado durante o teste.
     */
    const mood = "happy";

    /**
     * Act
     *
     * Executa a função que estamos testando.
     */
    const result = getMoodDefinition(mood);

    /**
     * Assert
     *
     * Verifica se o objeto retornado corresponde
     * exatamente ao esperado.
     */
    expect(result).toEqual({
      value: "happy",
      emoji: "🙂",
      label: "Feliz",
    });
  });

  /**
   * Cenário:
   * Caso seja informado um humor inexistente,
   * a função não deve lançar erro.
   *
   * O comportamento esperado é retornar `undefined`,
   * indicando que não foi encontrada uma definição
   * correspondente.
   */
  it("deve retornar undefined para um humor inexistente", () => {
    /**
     * Utilizamos um valor inválido propositalmente
     * para validar esse cenário.
     *
     * O cast (`as never`) é utilizado apenas neste teste
     * para permitir a simulação de um valor que nunca
     * deveria existir durante o uso normal da aplicação.
     */
    const mood = "invalid-mood" as never;

    // Executa a função.
    const result = getMoodDefinition(mood);

    // Verifica o comportamento esperado.
    expect(result).toBeUndefined();
  });
});
