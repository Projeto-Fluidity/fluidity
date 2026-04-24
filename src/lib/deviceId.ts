/**
 * ============================================================
 * DEVICE ID
 * ============================================================
 *
 * Como não temos autenticação ainda, precisamos identificar
 * o usuário/dispositivo de alguma forma.
 *
 * Estratégia:
 * - Gerar um ID único
 * - Salvar no localStorage
 * - Reutilizar sempre que o app abrir
 */
export function getDeviceId(): string {
  /**
   * Tenta recuperar o ID já salvo
   */
  let id = localStorage.getItem("device_id");

  /**
   * Se não existir, cria um novo
   */
  if (!id) {
    id = crypto.randomUUID();

    /**
     * Salva no navegador
     */
    localStorage.setItem("device_id", id);
  }

  return id;
}
