# ADR-0002 — Arquitetura de Identidade das Notificações Push

- **Status:** 🚧 Em evolução
- **Data:** 2026-07-17

---

# Contexto

Durante a auditoria da arquitetura de notificações do Fluidity foram identificadas inconsistências na definição das responsabilidades entre autenticação, configurações de notificações e infraestrutura de Web Push.

Diferentes partes da aplicação utilizavam identidades distintas para representar conceitos diferentes.

Atualmente:

- a Push Subscription representa uma assinatura criada pelo navegador;
- as configurações de notificações representam preferências de um usuário autenticado;
- o dispositivo representa a instalação da aplicação;
- diferentes camadas utilizavam `device_id` e `user_id` de forma inconsistente.

Essa sobreposição gerava conflitos durante a troca de usuário em um mesmo navegador e dificultava a evolução da arquitetura.

---

# Problema

Não existia uma definição arquitetural clara para a identidade de cada entidade envolvida no sistema de notificações.

Como consequência:

- surgiam conflitos entre banco de dados e aplicação;
- havia acoplamento entre autenticação e infraestrutura de notificações;
- múltiplos usuários compartilhando o mesmo dispositivo produziam inconsistências;
- a arquitetura tornava-se difícil de compreender e evoluir.

---

# Decisão

A arquitetura passa a separar explicitamente as responsabilidades entre infraestrutura de Push e preferências do usuário.

Cada entidade passa a possuir uma identidade própria.

---

# Push Subscription

A Push Subscription representa exclusivamente a assinatura criada pelo navegador através da Web Push API.

Sua identidade é o dispositivo (`device_id`).

Ela permanece válida independentemente do usuário autenticado.

É responsável por armazenar:

- endpoint;
- p256dh;
- auth.

A troca de usuário não cria uma nova Push Subscription.

A assinatura existente deve ser reutilizada.

---

# Notification Settings

As configurações de notificações representam exclusivamente as preferências de um usuário.

Sua identidade passa a ser `user_id`.

Essas configurações deixam de depender do dispositivo utilizado.

Como consequência:

- a tabela `reminder_settings` deixa de utilizar `UNIQUE(device_id)`;
- permanece apenas `UNIQUE(user_id)`.

---

# Device

O dispositivo representa a instalação da aplicação.

Sua responsabilidade é:

- identificar o navegador;
- reutilizar Push Subscriptions existentes;
- manter a associação da assinatura com o usuário autenticado.

O dispositivo não representa preferências do usuário.

---

# User

O usuário representa exclusivamente o proprietário atual das configurações de notificações.

Ele não representa a identidade da Push Subscription.

Sua responsabilidade limita-se às preferências funcionais da aplicação.

---

# Modelo Conceitual

```text
                 Usuário
                     │
                     ▼
        Notification Settings
               (user_id)

──────────────────────────────────────

              Dispositivo
              (device_id)
                     │
                     ▼
          Push Subscription
                     │
                     ▼
              Web Push API
```

---

# Evolução da Implementação

Durante a implementação da nova arquitetura foi identificado que a tabela `reminder_settings` ainda utilizava a restrição:

```sql
UNIQUE(device_id)
```

Essa modelagem fazia sentido quando o dispositivo era considerado a identidade da configuração.

Após a separação das responsabilidades, essa restrição tornou-se incompatível com a arquitetura, pois impedia que múltiplos usuários utilizassem o mesmo navegador.

Como consequência:

- `user_id` passa a representar a identidade das configurações de notificações;
- `device_id` permanece apenas como identificador técnico da instalação;
- `UNIQUE(device_id)` foi removido de `reminder_settings`;
- permanece apenas `UNIQUE(user_id)`.

---

# Consequências

## Positivas

- Separação clara entre infraestrutura e domínio.
- Identidade única para Push Subscription.
- Identidade única para Notification Settings.
- Arquitetura alinhada ao funcionamento da Web Push API.
- Redução do acoplamento entre autenticação e notificações.
- Compatibilidade com múltiplos usuários utilizando o mesmo dispositivo.
- Maior previsibilidade durante login e logout.
- Facilidade para evolução futura da infraestrutura de notificações.

## Negativas

- Necessidade de migração da modelagem existente.
- Revisão dos serviços relacionados às notificações.
- Ajustes na sincronização entre autenticação e assinatura.
- Adequação das tabelas existentes ao novo modelo.

---

# Componentes Impactados

- `subscriptionService`
- `subscriptionSyncService`
- `pushService`
- `notificationSettingsService`
- `AuthProvider`
- Push Server
- Supabase
- modelagem das tabelas de notificações

---

# Status da Implementação

🚧 Em evolução.

Principais entregas:

- consolidação da identidade da Push Subscription baseada em `device_id`;
- adoção de `user_id` como identidade das configurações de notificações;
- criação do `subscriptionSyncService`;
- sincronização automática entre autenticação e assinatura;
- remoção da restrição `UNIQUE(device_id)` em `reminder_settings`;
- manutenção da compatibilidade com múltiplos usuários utilizando o mesmo dispositivo;
- separação entre infraestrutura de Web Push e preferências do usuário.
