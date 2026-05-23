/**
 * ============================================================
 * DEVICE ID STORAGE KEY
 * ============================================================
 *
 * Nome usado para salvar o device_id no localStorage.
 *
 * O localStorage funciona como um pequeno armazenamento
 * persistente do navegador.
 *
 * Isso significa que:
 *
 * - o dado continua salvo mesmo após refresh;
 * - continua salvo após fechar o navegador;
 * - permanece até o usuário limpar os dados.
 */
const DEVICE_ID_KEY = "fluidity_device_id";

/**
 * ============================================================
 * GET OR CREATE DEVICE ID
 * ============================================================
 *
 * Objetivo:
 *
 * Garantir que o navegador tenha um ID único e persistente.
 *
 * Esse ID representa o "dispositivo" do usuário
 * dentro do sistema de push notifications.
 *
 * ============================================================
 * POR QUE ISSO É IMPORTANTE?
 * ============================================================
 *
 * Sem persistência:
 *
 * - cada refresh geraria um novo UUID;
 * - o Supabase ficaria cheio de devices duplicados;
 * - o usuário poderia receber notificações duplicadas;
 * - o backend perderia rastreabilidade.
 *
 * ============================================================
 * FLUXO:
 * ============================================================
 *
 * 1. Verifica se já existe um device_id salvo
 * 2. Se existir → reutiliza
 * 3. Se não existir → cria novo UUID
 * 4. Salva no localStorage
 * 5. Retorna o ID
 */
export function getOrCreateDeviceId(): string {

  /**
   * ============================================================
   * TENTA RECUPERAR DEVICE ID EXISTENTE
   * ============================================================
   */
  const existingDeviceId =
    localStorage.getItem(DEVICE_ID_KEY);

  /**
   * ============================================================
   * SE JÁ EXISTE:
   * reutiliza o mesmo ID
   * ============================================================
   */
  if (existingDeviceId) {

    console.log(
      "DEVICE ID existente encontrado:",
      existingDeviceId
    );

    return existingDeviceId;
  }

  /**
   * ============================================================
   * SE NÃO EXISTE:
   * cria novo UUID
   * ============================================================
   *
   * crypto.randomUUID()
   * gera um identificador único.
   *
   * Exemplo:
   *
   * b207b346-b3ff-4222-a601-2b7b9ee595ec
   */
  const newDeviceId =
    crypto.randomUUID();

  console.log(
    "Novo DEVICE ID criado:",
    newDeviceId
  );

  /**
   * ============================================================
   * SALVA NO LOCALSTORAGE
   * ============================================================
   */
  localStorage.setItem(
    DEVICE_ID_KEY,
    newDeviceId
  );

  /**
   * ============================================================
   * RETORNA O NOVO ID
   * ============================================================
   */
  return newDeviceId;
}
