/**
 * ============================================================
 * DEVICE ID STORAGE KEY
 * ============================================================
 *
 * Nome da chave usada no localStorage.
 *
 * O localStorage funciona como um armazenamento
 * persistente do navegador.
 *
 * Isso permite reutilizar o mesmo device_id
 * entre diferentes sessões do app.
 */
const DEVICE_ID_KEY = "fluidity_device_id";

/**
 * ============================================================
 * GET DEVICE ID
 * ============================================================
 *
 * Como o projeto ainda não possui autenticação,
 * precisamos identificar o navegador/dispositivo
 * de maneira persistente.
 *
 * Estratégia:
 *
 * - gerar um UUID único;
 * - salvar no localStorage;
 * - reutilizar sempre que o app abrir.
 *
 * ============================================================
 * POR QUE ISSO É IMPORTANTE?
 * ============================================================
 *
 * O sistema de push notifications depende
 * de um identificador consistente para:
 *
 * - evitar subscriptions duplicadas;
 * - localizar o dispositivo correto;
 * - atualizar subscriptions existentes;
 * - manter rastreabilidade do device.
 */
export function getDeviceId(): string {

  /**
   * ============================================================
   * TENTA RECUPERAR ID EXISTENTE
   * ============================================================
   */
  let id =
    localStorage.getItem(DEVICE_ID_KEY);

  /**
   * ============================================================
   * SE NÃO EXISTIR:
   * cria novo UUID
   * ============================================================
   */
  if (!id) {

    id = crypto.randomUUID();

    /**
     * ============================================================
     * PERSISTE NO NAVEGADOR
     * ============================================================
     */
    localStorage.setItem(
      DEVICE_ID_KEY,
      id
    );

    console.log(
      "Novo DEVICE ID criado:",
      id
    );
  }

  /**
   * ============================================================
   * RETORNA O DEVICE ID
   * ============================================================
   */
  return id;
}
