/**
 * ============================================================
 * REMINDER CATEGORY
 * ============================================================
 *
 * Categorias de lembretes suportadas pela aplicação.
 *
 * Atualmente existem duas categorias:
 *
 * • mood
 *   Responsável pelo lembrete diário de registro
 *   de humor.
 *
 * • hydration
 *   Responsável pelos lembretes de hidratação.
 *
 * Novas categorias deverão ser adicionadas aqui,
 * mantendo um único ponto de definição para todo
 * o sistema.
 */
export type ReminderCategory =
  | "mood"
  | "hydration";

/**
 * ============================================================
 * SCHEDULED REMINDER
 * ============================================================
 *
 * Representa um lembrete configurado pelo usuário
 * na tabela:
 *
 * scheduled_reminders
 *
 * Este tipo NÃO deve ser confundido com o tipo
 * Reminder, utilizado pelo motor de disparo da
 * aplicação.
 *
 * Responsabilidades deste modelo:
 *
 * • representar os dados persistidos;
 * • alimentar as telas de configuração;
 * • permitir criação, edição, exclusão e ativação
 *   dos lembretes.
 *
 * Toda conversão entre banco de dados e interface
 * deve ocorrer através dos adapters da aplicação.
 */
export interface ScheduledReminder {

  /**
   * Identificador único do lembrete.
   */
  id: string;

  /**
   * Nome exibido ao usuário.
   *
   * Exemplos:
   *
   * - Registro diário
   * - Hora de se hidratar
   * - Beber água
   */
  label: string;

  /**
   * Horário programado para execução.
   *
   * Formato:
   *
   * HH:mm
   *
   * Exemplo:
   *
   * 08:00
   * 14:30
   */
  time: string;

  /**
   * Dias da semana em que o lembrete será executado.
   *
   * Exemplo:
   *
   * ["seg", "ter", "qua"]
   *
   * Para lembretes diários este campo poderá conter
   * todos os dias da semana.
   */
  days: string[];

  /**
   * Indica se o lembrete está ativo.
   *
   * true  -> dispara normalmente
   * false -> permanece salvo, porém desativado
   */
  active: boolean;

  /**
   * Categoria responsável pelo lembrete.
   *
   * Esta informação permite que uma mesma estrutura
   * seja reutilizada por diferentes módulos da
   * aplicação.
   */
  category: ReminderCategory;

  /**
   * Indica se o lembrete faz parte das regras
   * obrigatórias do sistema.
   *
   * Exemplos:
   *
   * • Registro diário de humor
   * • Lembrete principal de hidratação
   *
   * Lembretes fixos possuem regras de negócio
   * específicas e não podem ser removidos.
   */
  isFixed: boolean;
}
