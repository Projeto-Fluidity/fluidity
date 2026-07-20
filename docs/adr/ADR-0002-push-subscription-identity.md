# ADR-0002 — Identidade da Push Subscription

---

## Evolução da implementação

Durante a implementação observou-se que a tabela
`reminder_settings` ainda utilizava a restrição
`UNIQUE(device_id)`.

Essa restrição fazia sentido quando o dispositivo era
considerado a identidade da configuração.

Após a adoção da arquitetura baseada em `user_id`,
essa restrição tornou-se incompatível, impedindo que
múltiplos usuários utilizassem o mesmo dispositivo.

Como consequência:

- `user_id` passa a representar a identidade da configuração;
- `device_id` permanece apenas como metadado técnico;
- a restrição `UNIQUE(device_id)` foi removida de
  `reminder_settings`;
- permanece apenas `UNIQUE(user_id)`.

- **Status:** Implementada
- **Data:** 2026-07-17

---

## Contexto

O Fluidity utiliza Web Push para envio de notificações.

Durante a auditoria da arquitetura foram identificadas inconsistências entre as diferentes camadas da aplicação.

Atualmente:

- o Frontend realiza persistência considerando `user_id`;
- o Push Server consulta registros utilizando `device_id`;
- a tabela `push_subscriptions` possui restrições `UNIQUE` para ambos.

Essa divergência gera conflitos durante a troca de usuário em um mesmo navegador.

---

## Problema

Não existe uma definição única sobre qual entidade representa uma Push Subscription.

Cada camada do sistema utiliza uma identidade diferente.

Como consequência:

- surgem conflitos de persistência;
- aumenta o acoplamento entre autenticação e notificações;
- a arquitetura torna-se inconsistente.

---

## Decisão

Uma Push Subscription representa um navegador/dispositivo.

Ela não representa um usuário.

O usuário apenas identifica quem está autenticado naquele dispositivo no momento.

Ao trocar de usuário:

- a Push Subscription permanece;
- a associação com o usuário deve ser atualizada.

Não deve ser criada uma nova assinatura apenas porque houve troca de autenticação.

---

## Modelo conceitual

```text
Usuário
      │
      │ login / logout
      ▼
Dispositivo (device_id)
      │
      ▼
Push Subscription
      │
      ▼
Web Push
```

---

## Responsabilidades

### Push Subscription

Responsável por:

- endpoint;
- p256dh;
- auth.

Representa a assinatura criada pelo navegador.

---

### Device

Responsável por:

- identificar o navegador;
- reutilizar a assinatura existente;
- manter a associação atual com o usuário autenticado.

---

### User

Representa apenas o proprietário atual da assinatura.

---

## Consequências

### Positivas

- Identidade única da assinatura.
- Eliminação de conflitos entre banco e aplicação.
- Arquitetura alinhada ao funcionamento da Web Push API.
- Melhor separação entre autenticação e infraestrutura de notificações.
- Compatibilidade com múltiplos usuários utilizando o mesmo dispositivo.

### Negativas

- Necessidade de revisão da modelagem da tabela.
- Ajustes no `subscriptionService`.
- Revisão do fluxo de login e logout.
- Migração das tabelas que ainda utilizavam device_id como identidade.

---

## Componentes impactados

- subscriptionService
- subscriptionSyncService
- pushService
- notificationSettingsService
- AuthProvider
- Push Server
- Supabase
- Documentação da arquitetura

---

## Status da implementação

✅ Implementada.

Principais entregas:

- migração da identidade da Push Subscription para `device_id`;
- sincronização automática entre autenticação e assinatura;
- criação do `subscriptionSyncService`;
- atualização da modelagem das tabelas;
- remoção da restrição `UNIQUE(device_id)` em `reminder_settings`;
- compatibilidade com múltiplos usuários utilizando o mesmo dispositivo.
