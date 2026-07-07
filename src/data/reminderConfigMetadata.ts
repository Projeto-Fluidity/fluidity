import type { ReminderCategory } from "../types/reminderCategory";

/**
 * ============================================================
 * REMINDER CONFIG METADATA
 * ============================================================
 *
 * Estrutura responsável por centralizar todas as
 * configurações relacionadas às telas de configuração
 * dos Lembretes Inteligentes.
 *
 * Diferente de reminderCategories.ts, este arquivo NÃO
 * representa informações do Hub de Lembretes.
 *
 * Sua responsabilidade é exclusivamente definir como
 * cada categoria deverá se comportar durante sua
 * configuração.
 *
 * Exemplos:
 *
 * • título do card de resumo;
 * • descrição apresentada ao usuário;
 * • possibilidade de criar novos lembretes;
 * • possibilidade de excluir lembretes;
 * • edição dos dias da semana;
 * • suporte a múltiplos lembretes.
 *
 * Benefícios:
 *
 * • evita valores hardcoded nas páginas;
 * • mantém uma única fonte de verdade;
 * • facilita inclusão de novas categorias;
 * • reduz condicionais espalhadas pela interface;
 * • preserva o princípio de Single Responsibility.
 */

/**
 * ============================================================
 * REMINDER CONFIG METADATA ITEM
 * ============================================================
 *
 * Configuração de comportamento da interface para
 * uma categoria de lembrete.
 *
 * Este objeto NÃO contém regras de persistência,
 * valores padrão ou lógica de negócio.
 *
 * Sua responsabilidade limita-se exclusivamente
 * às necessidades da camada de apresentação.
 */
export type ReminderConfigMetadataItem = {
  /**
   * Categoria representada.
   */
  category: ReminderCategory;

  /**
   * Título exibido no card de resumo da tela
   * de configuração.
   */
  summaryTitle: string;

  /**
   * Texto explicativo exibido abaixo do título.
   */
  summaryDescription: string;

  /**
   * Define se a categoria permite criação de
   * múltiplos lembretes.
   */
  allowCreate: boolean;

  /**
   * Define se os lembretes podem ser removidos.
   */
  allowDelete: boolean;

  /**
   * Define se o usuário pode editar os dias
   * da semana.
   */
  allowEditDays: boolean;

  /**
   * Define se a categoria suporta mais de um
   * lembrete simultaneamente.
   */
  allowMultiple: boolean;
};

/**
 * ============================================================
 * REMINDER CONFIG METADATA
 * ============================================================
 *
 * Fonte única de verdade para todas as configurações
 * de interface das telas de lembretes.
 *
 * Cada categoria possui sua própria configuração,
 * permitindo que novas categorias sejam adicionadas
 * sem necessidade de alterar componentes ou páginas.
 */
export const reminderConfigMetadata: Record<
  ReminderCategory,
  ReminderConfigMetadataItem
> = {
  /**
   * ==========================================================
   * HUMOR
   * ==========================================================
   */
  mood: {
    category: "mood",

    summaryTitle: "Lembrete diário",

    summaryDescription:
      "Você pode alterar o horário do lembrete responsável pelo registro diário de humor.",

    allowCreate: false,
    allowDelete: false,
    allowEditDays: false,
    allowMultiple: false,
  },

  /**
   * ==========================================================
   * HIDRATAÇÃO
   * ==========================================================
   */
  hydration: {
    category: "hydration",

    summaryTitle: "Lembretes de hidratação",

    summaryDescription:
      "Adicione lembretes ao longo do dia para manter uma boa hidratação.",

    allowCreate: true,
    allowDelete: true,
    allowEditDays: true,
    allowMultiple: true,
  },

  /**
   * ==========================================================
   * PAUSA
   * ==========================================================
   *
   * Estrutura preparada para implementação futura.
   */
  break: {
    category: "break",

    summaryTitle: "Faça uma pausa",

    summaryDescription:
      "Categoria em desenvolvimento.",

    allowCreate: false,
    allowDelete: false,
    allowEditDays: false,
    allowMultiple: false,
  },

  /**
   * ==========================================================
   * RELAXAMENTO
   * ==========================================================
   *
   * Estrutura preparada para implementação futura.
   */
  relax: {
    category: "relax",

    summaryTitle: "Hora de relaxar",

    summaryDescription:
      "Categoria em desenvolvimento.",

    allowCreate: false,
    allowDelete: false,
    allowEditDays: false,
    allowMultiple: false,
  },
};
