# Sistema de Lembretes - Arquitetura

## Visão Geral

O sistema de lembretes do Fluidity permite configurar lembretes
de bem-estar associados a horários e dias específicos.

Atualmente, o processamento automático dos lembretes é realizado
pelo frontend.

A arquitetura definida no ADR-0003 prevê a migração desse
processamento para o backend, permitindo que as notificações sejam
entregues mesmo quando o frontend não está aberto.

---

## Estrutura de Dados

### scheduled_reminders

Armazena os lembretes agendados para cada usuário.

| campo      | descrição |
|------------|-----------|
| id         | identificador único |
| user_id    | usuário proprietário |
| category   | categoria do lembrete |
| label      | nome exibido |
| time       | horário do lembrete |
| days       | dias da semana |
| active     | indica se o lembrete está ativo |
| is_fixed   | indica se o lembrete é obrigatório |
| created_at | data de criação |

### reminder_logs

Armazena o histórico das ações relacionadas aos lembretes.

| campo       | descrição |
|-------------|-----------|
| id          | identificador único |
| reminder_id | referência ao lembrete |
| action      | ação realizada |
| created_at  | data da ação |
| device_id   | dispositivo relacionado |

---

## Tipos de Lembretes

### Lembretes fixos

São lembretes obrigatórios da aplicação.

Atualmente existe:

- Registro diário de humor

Lembretes fixos são garantidos pelo serviço
`scheduledReminderService`.

### Lembretes configuráveis

São criados e gerenciados pelo usuário.

Exemplo:

- Lembretes de hidratação

Esses lembretes não são recriados automaticamente.

---

## Regra de Disparo

Um lembrete pode ser disparado quando:

- está ativo;
- o horário atual corresponde ao horário configurado;
- o dia atual está configurado no lembrete;
- ainda não foi processado para aquela execução.

Quando `days` é `NULL`, o lembrete é considerado válido para todos
os dias.

A verificação de horário utiliza uma janela de disparo de até
1 minuto após o horário configurado.

---

## Agendamento Automático

O processamento automático dos lembretes é realizado pelo backend.

Fluxo:

1. Scheduler executa periodicamente.
2. Sistema consulta `scheduled_reminders`.
3. Sistema identifica lembretes ativos.
4. Sistema verifica dia e horário.
5. Sistema verifica se o lembrete já foi processado.
6. Sistema solicita a entrega da notificação.
7. Push Server envia a notificação por Web Push.
8. A execução é registrada no histórico.

---

## Arquitetura de Entrega

```text
scheduled_reminders
        │
        ▼
Reminder Scheduler
        │
        ▼
Regra de disparo
        │
        ▼
Reminder Delivery
        │
        ▼
Push Server
        │
        ▼
Web Push
        │
        ▼
Service Worker
        │
        ▼
Sistema operacional
