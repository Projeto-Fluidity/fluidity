/**
 * ============================================================
 * NOTIFICATION PROVISIONING SERVICE - TESTES
 * ============================================================
 *
 * Estes testes validam as regras responsáveis pela inicialização
 * do sistema de notificações de um novo usuário.
 *
 * O provisioning é executado pelo push-server e deve garantir
 * que o usuário possua:
 *
 * - configurações padrão de notificações;
 * - lembrete fixo de Mood.
 *
 * Importante:
 *
 * Estes são testes unitários.
 *
 * Portanto, não utilizamos o Supabase real. Os repositories são
 * substituídos por mocks para que possamos testar somente a
 * regra de negócio do service.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createDefaultReminderSettings,
  getReminderSettings,
} from "../repositories/reminderSettings.repository.js";

import {
  createFixedMoodReminder,
  hasFixedMoodReminder,
} from "../repositories/scheduledReminder.repository.js";

import { provisionUserNotificationState } from "./notificationProvisioning.service.js";

/**
 * ============================================================
 * MOCKS DOS REPOSITORIES
 * ============================================================
 *
 * O service utiliza repositories para acessar o banco de dados.
 *
 * Durante o teste não queremos fazer consultas reais ao Supabase.
 * Por isso, substituímos as funções dos repositories por mocks.
 *
 * Dessa forma conseguimos controlar o que o banco "responderia"
 * em cada cenário.
 */

vi.mock("../repositories/reminderSettings.repository.js", () => ({
  getReminderSettings: vi.fn(),
  createDefaultReminderSettings: vi.fn(),
}));

vi.mock("../repositories/scheduledReminder.repository.js", () => ({
  hasFixedMoodReminder: vi.fn(),
  createFixedMoodReminder: vi.fn(),
}));

/**
 * ============================================================
 * REFERÊNCIAS DOS MOCKS
 * ============================================================
 *
 * vi.mock() substitui as funções pelos mocks do Vitest.
 *
 * vi.mocked() permite que o TypeScript reconheça essas funções
 * como mocks e nos permita configurar seus retornos durante
 * os testes.
 */

const mockedGetReminderSettings = vi.mocked(getReminderSettings);

const mockedCreateDefaultReminderSettings = vi.mocked(
  createDefaultReminderSettings,
);

const mockedHasFixedMoodReminder = vi.mocked(hasFixedMoodReminder);

const mockedCreateFixedMoodReminder = vi.mocked(
  createFixedMoodReminder,
);

/**
 * ============================================================
 * DADOS DE TESTE
 * ============================================================
 *
 * Representa uma configuração que já existe para o usuário.
 *
 * Os valores correspondem aos valores padrão definidos pelo
 * provisioning no push-server.
 */

const existingSettings = {
  user_id: "user-123",
  device_id: null,
  enabled: true,
  start_hour: 8,
  end_hour: 18,
  frequency_minutes: 60,
  max_per_day: 10,
};

/**
 * ============================================================
 * TESTES
 * ============================================================
 */

describe("provisionUserNotificationState", () => {
  /**
   * Antes de cada teste limpamos o estado dos mocks.
   *
   * Isso é importante porque cada teste deve começar
   * completamente independente dos testes anteriores.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ----------------------------------------------------------
   * CENÁRIO 1
   * ----------------------------------------------------------
   *
   * Usuário já possui:
   *
   * - reminder_settings;
   * - lembrete fixo de Mood.
   *
   * Nesse caso o provisioning não deve criar nada.
   *
   * Esse comportamento é importante porque o provisioning
   * pode ser executado mais de uma vez para o mesmo usuário.
   */
  it("não cria recursos quando o usuário já está provisionado", async () => {
    mockedGetReminderSettings.mockResolvedValue(existingSettings);

    mockedHasFixedMoodReminder.mockResolvedValue(true);

    await provisionUserNotificationState("user-123");

    expect(mockedCreateDefaultReminderSettings).not.toHaveBeenCalled();

    expect(mockedCreateFixedMoodReminder).not.toHaveBeenCalled();
  });

  /**
   * ----------------------------------------------------------
   * CENÁRIO 2
   * ----------------------------------------------------------
   *
   * Usuário novo:
   *
   * - não possui reminder_settings;
   * - não possui lembrete fixo de Mood.
   *
   * Nesse caso o provisioning deve criar os dois recursos.
   *
   * Este é o cenário principal da nova funcionalidade.
   */
  it("cria configurações e Mood fixo para um usuário novo", async () => {
    mockedGetReminderSettings.mockResolvedValue(null);

    mockedHasFixedMoodReminder.mockResolvedValue(false);

    await provisionUserNotificationState("user-123");

    expect(mockedCreateDefaultReminderSettings).toHaveBeenCalledOnce();

    expect(mockedCreateDefaultReminderSettings).toHaveBeenCalledWith(
      "user-123",
    );

    expect(mockedCreateFixedMoodReminder).toHaveBeenCalledOnce();

    expect(mockedCreateFixedMoodReminder).toHaveBeenCalledWith(
      "user-123",
    );
  });

  /**
   * ----------------------------------------------------------
   * CENÁRIO 3
   * ----------------------------------------------------------
   *
   * O usuário já possui as configurações, mas ainda não possui
   * o lembrete fixo de Mood.
   *
   * O service deve criar somente o que está faltando.
   *
   * Isso demonstra que o provisioning é composto por etapas
   * independentes e pode corrigir parcialmente um estado.
   */
  it("cria apenas o Mood fixo quando as configurações já existem", async () => {
    mockedGetReminderSettings.mockResolvedValue(existingSettings);

    mockedHasFixedMoodReminder.mockResolvedValue(false);

    await provisionUserNotificationState("user-123");

    expect(mockedCreateDefaultReminderSettings).not.toHaveBeenCalled();

    expect(mockedCreateFixedMoodReminder).toHaveBeenCalledOnce();

    expect(mockedCreateFixedMoodReminder).toHaveBeenCalledWith(
      "user-123",
    );
  });

  /**
   * ----------------------------------------------------------
   * CENÁRIO 4
   * ----------------------------------------------------------
   *
   * O usuário já possui o lembrete fixo de Mood.
   *
   * Isso também representa o caso em que o usuário decidiu
   * desativar esse lembrete.
   *
   * A regra de negócio determina que:
   *
   * "existir" é diferente de "estar ativo".
   *
   * Portanto, o provisioning não deve recriar nem reativar
   * um Mood que o usuário já possui.
   *
   * O repository verifica a existência do lembrete fixo
   * independentemente do campo `active`.
   */
  it("não recria o Mood quando o lembrete fixo já existe", async () => {
    mockedGetReminderSettings.mockResolvedValue(existingSettings);

    mockedHasFixedMoodReminder.mockResolvedValue(true);

    await provisionUserNotificationState("user-123");

    expect(mockedCreateFixedMoodReminder).not.toHaveBeenCalled();
  });
});
