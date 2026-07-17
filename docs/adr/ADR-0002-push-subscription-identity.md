# ADR-0002 — Identidade da Push Subscription

- **Status:** Proposta
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

### Negativas

- Necessidade de revisão da modelagem da tabela.
- Ajustes no `subscriptionService`.
- Revisão do fluxo de login e logout.

---

## Componentes impactados

- subscriptionService
- pushService
- notificationSettingsService
- Push Server
- Supabase
- Documentação da arquitetura

---

## Status da implementação

🚧 Em andamento.
