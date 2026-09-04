import type { ScheduledReminder } from "./reminder.service.js";

/**
 * ============================================================
 * CONFIGURAÇÃO
 * ============================================================
 *
 * O Fluidity considera, nesta versão, apenas usuários
 * localizados no território brasileiro.
 *
 * Os horários configurados pelos usuários são interpretados
 * no timezone de São Paulo.
 */
const FLUIDITY_TIMEZONE = "America/Sao_Paulo";

/**
 * ============================================================
 * TIPOS
 * ============================================================
 */

type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
};

/**
 * ============================================================
 * DATA E HORA
 * ============================================================
 *
 * Obtém os componentes de uma data no timezone utilizado
 * pelo Fluidity.
 *
 * O objeto Date representa um instante absoluto.
 * A função apenas projeta esse instante para o timezone
 * do domínio para permitir a avaliação de horário e dia.
 */
function getZonedDateParts(date: Date): ZonedDateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: FLUIDITY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    weekday: values.weekday,
  };
}

/**
 * Converte um horário do timezone do Fluidity
 * para um instante absoluto representado por Date.
 *
 * Exemplo:
 *
 * 04/09/2026 13:09
 * America/Sao_Paulo
 *        ↓
 * 04/09/2026 16:09 UTC
 */
function createDateFromZonedTime(
  date: Date,
  hour: number,
  minute: number,
): Date {
  const { year, month, day } = getZonedDateParts(date);

  /**
   * Cria uma representação inicial utilizando UTC.
   *
   * Essa representação ainda não é o instante final.
   * Ela serve como referência para calcular o offset
   * efetivo do timezone do Fluidity.
   */
  const utcTimestamp = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0,
  );

  const utcDate = new Date(utcTimestamp);

  /**
   * Obtém como o timezone do Fluidity representa
   * essa mesma referência.
   */
  const zonedParts = getZonedDateParts(utcDate);

  /**
   * Diferença entre a representação desejada e a
   * representação obtida no timezone do domínio.
   */

  const zonedTimestamp = Date.UTC(
    zonedParts.year,
    zonedParts.month - 1,
    zonedParts.day,
    zonedParts.hour,
    zonedParts.minute,
    0,
    0,
  );

  const offset = utcTimestamp - zonedTimestamp;

  return new Date(utcTimestamp + offset);
}

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
  const {
    hour: currentHour,
    minute: currentMinute,
    weekday,
  } = getZonedDateParts(now);

  const currentMinutes =
    currentHour * 60 + currentMinute;

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

  const weekdayIndex = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ].indexOf(weekday);

  if (weekdayIndex === -1) {
    return false;
  }

  const today = weekDays[weekdayIndex];

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
   * Converte o horário configurado pelo usuário,
   * interpretado em America/Sao_Paulo, para um
   * instante absoluto.
   */
  return createDateFromZonedTime(
    now,
    hour,
    minute,
  );
}
