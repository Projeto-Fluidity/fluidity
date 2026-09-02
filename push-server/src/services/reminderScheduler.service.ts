import type { ScheduledReminder } from "./reminder.service.js";

/**
 * ============================================================
 * REMINDER SCHEDULER SERVICE
 * ============================================================
 *
 * Responsável pelas regras de execução dos lembretes
 * automáticos no backend.
 *
 * Responsabilidades:
 *
 * - verificar se um lembrete deve ser executado;
 * - respeitar horário configurado;
 * - respeitar dias configurados;
 * - calcular a ocorrência do lembrete.
 *
 * Este serviço NÃO é responsável por:
 *
 * - acessar o banco de dados;
 * - controlar duplicidade de execuções;
 * - buscar lembretes;
 * - iniciar o processo recorrente do scheduler;
 * - enviar Push Notifications.
 *
 * Essas responsabilidades pertencem às respectivas camadas.
 *
 * ============================================================
 * ARQUITETURA
 * ============================================================
 *
 * reminder.service
 *        ↓
 * busca lembretes ativos
 *        ↓
 * reminderScheduler.service
 *        ↓
 * avalia horário e dia
 *        ↓
 * ocorrência elegível
 *        ↓
 * reminderDelivery.repository
 *        ↓
 * controla idempotência
 *        ↓
 * push.service
 *        ↓
 * envia Push
 */

/**
 * ============================================================
 * VERIFICAÇÃO DE EXECUÇÃO
 * ============================================================
 *
 * Determina se um lembrete deve ser executado
 * no momento informado.
 *
 * A função considera:
 *
 * - lembrete ativo;
 * - horário configurado;
 * - dia da semana configurado.
 *
 * Não realiza nenhuma operação de banco de dados
 * e não envia notificações.
 */
export function shouldRunReminder(
  reminder: ScheduledReminder,
  now: Date,
): boolean {
  /**
   * ==========================================================
   * LEMBRETE INATIVO
   * ==========================================================
   *
   * Lembretes desativados nunca devem ser processados.
   */
  if (!reminder.active) {
    return false;
  }

  /**
   * ==========================================================
   * HORÁRIO AUSENTE
   * ==========================================================
   *
   * Sem horário não existe uma ocorrência que possa
   * ser executada automaticamente.
   */
  if (!reminder.time) {
    return false;
  }

  /**
   * ==========================================================
   * CONVERTER HORÁRIO
   * ==========================================================
   *
   * O banco armazena o horário no formato:
   *
   * HH:mm
   *
   * Exemplo:
   *
   * "13:09"
   *   ↓
   * hour   = 13
   * minute = 09
   */
  const [hour, minute] = reminder.time.split(":").map(Number);

  /**
   * Proteção contra horários inválidos.
   */
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return false;
  }

  /**
   * ==========================================================
   * COMPARAÇÃO DE HORÁRIO
   * ==========================================================
   *
   * Convertemos os horários para minutos do dia.
   *
   * Exemplo:
   *
   * 13:09
   *
   * 13 * 60 + 9 = 789
   *
   * Dessa forma a comparação fica independente
   * dos segundos do relógio.
   */
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const reminderMinutes =
    hour * 60 + minute;

  /**
   * O lembrete somente pode ser executado
   * quando o horário configurado for atingido.
   */
  if (currentMinutes !== reminderMinutes) {
    return false;
  }

  /**
   * ==========================================================
   * DIAS DA SEMANA
   * ==========================================================
   *
   * O JavaScript retorna:
   *
   * 0 = domingo
   * 1 = segunda
   * 2 = terça
   * 3 = quarta
   * 4 = quinta
   * 5 = sexta
   * 6 = sábado
   *
   * O banco utiliza as abreviações:
   *
   * dom, seg, ter, qua, qui, sex, sab
   */
  const weekDays = [
    "dom",
    "seg",
    "ter",
    "qua",
    "qui",
    "sex",
    "sab",
  ];

  /**
   * ==========================================================
   * TODOS OS DIAS
   * ==========================================================
   *
   * Conforme definido no ADR-0003:
   *
   * days = NULL
   *
   * representa um lembrete válido todos os dias.
   */
  if (reminder.days === null) {
    return true;
  }

  /**
   * Obtém o dia atual utilizando o mesmo padrão
   * armazenado em scheduled_reminders.
   */
  const today = weekDays[now.getDay()];

  /**
   * Executa somente quando o dia atual estiver
   * entre os dias configurados para o lembrete.
   */
  return reminder.days.includes(today);
}

/**
 * ============================================================
 * CALCULAR OCORRÊNCIA
 * ============================================================
 *
 * Constrói o instante correspondente à ocorrência
 * do lembrete no dia informado.
 *
 * Exemplo:
 *
 * now:
 * 30/08/2026 17:41
 *
 * reminder.time:
 * 13:09
 *
 * resultado:
 * 30/08/2026 13:09
 *
 * O Date mantém o timezone local do ambiente
 * durante essa construção.
 *
 * Quando enviado ao Supabase através de
 * toISOString(), o instante é convertido para UTC.
 */
export function getScheduledFor(
  reminder: ScheduledReminder,
  now: Date,
): Date | null {
  /**
   * Sem horário não é possível calcular
   * a ocorrência.
   */
  if (!reminder.time) {
    return null;
  }

  /**
   * Converte HH:mm para hora e minuto.
   */
  const [hour, minute] = reminder.time.split(":").map(Number);

  /**
   * Proteção contra horário inválido.
   */
  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  /**
   * Cria uma cópia da data atual.
   *
   * Não alteramos o objeto `now` recebido pela função.
   */
  const scheduledFor = new Date(now);

  /**
   * Substitui somente o horário.
   *
   * A data permanece sendo a data da ocorrência.
   */
  scheduledFor.setHours(hour, minute, 0, 0);

  return scheduledFor;
}
