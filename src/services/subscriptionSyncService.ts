import { getDeviceId } from "../lib/deviceId";

import {
  associateUserToDevice,
  clearDeviceAssociation,
} from "./subscriptionService";

import { hasPushSubscription } from "./pushService";

/**
 * ============================================================
 * SUBSCRIPTION SYNC SERVICE
 * ============================================================
 *
 * Responsável por sincronizar a associação entre
 * o usuário autenticado e o dispositivo atual.
 *
 * Este serviço NÃO cria Push Subscriptions.
 *
 * A criação da assinatura continua sendo
 * responsabilidade do pushService.
 *
 * Também não possui responsabilidade sobre
 * autenticação, permissões do navegador ou
 * configurações de notificações.
 *
 * Sua única responsabilidade é manter atualizada
 * a relação entre:
 *
 *      device_id
 *            ↓
 *      usuário autenticado
 *
 * Essa separação mantém a arquitetura aderente ao
 * princípio da Responsabilidade Única (SRP).
 */

/**
 * ============================================================
 * ASSOCIATE USER TO CURRENT DEVICE
 * ============================================================
 *
 * Associa o usuário autenticado ao dispositivo atual.
 *
 * Fluxo:
 *
 * 1. Recupera o device_id persistido no navegador.
 * 2. Solicita ao subscriptionService que atualize
 *    a associação do dispositivo.
 *
 * Este método é utilizado após um login bem sucedido
 * ou sempre que for necessário garantir que o
 * dispositivo esteja vinculado ao usuário correto.
 */
export async function associateUserToCurrentDevice(
  userId: string,
): Promise<void> {
  /**
   * ==========================================================
   * PUSH SUBSCRIPTION
   * ==========================================================
   */

  const hasSubscription = await hasPushSubscription();

  if (!hasSubscription) {
    return;
  }

  /**
   * ==========================================================
   * DEVICE
   * ==========================================================
   */

  const deviceId = getDeviceId();

  await associateUserToDevice(deviceId, userId);
}

/**
 * ============================================================
 * CLEAR CURRENT DEVICE ASSOCIATION
 * ============================================================
 *
 * Remove a associação entre o dispositivo atual
 * e o usuário autenticado.
 *
 * A Push Subscription permanece registrada.
 *
 * Apenas o campo user_id é removido da tabela,
 * permitindo que outro usuário utilize o mesmo
 * navegador futuramente.
 *
 * Fluxo:
 *
 * 1. Recupera o device_id atual.
 * 2. Solicita ao subscriptionService a remoção
 *    da associação do usuário.
 */
export async function clearCurrentDeviceAssociation(): Promise<void> {
  /**
   * ==========================================================
   * PUSH SUBSCRIPTION
   * ==========================================================
   */

  const hasSubscription = await hasPushSubscription();

  if (!hasSubscription) {
    return;
  }

  /**
   * ==========================================================
   * DEVICE
   * ==========================================================
   */

  const deviceId = getDeviceId();

  await clearDeviceAssociation(deviceId);
}
