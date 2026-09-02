# ADR-0003 — Agendamento Automático de Lembretes

## Status

Proposed

## Contexto

Atualmente o disparo dos lembretes é realizado pelo
hook `useReminderTrigger`, utilizando `setInterval`
no frontend.

Esse mecanismo depende da aplicação React estar em
execução e, portanto, não permite disparos quando o
navegador está fechado.

## Problema

O Fluidity precisa permitir que lembretes sejam
processados independentemente da execução do frontend.

## Decisão

O processamento automático dos lembretes será movido
para o backend, mantendo o Push Server como responsável
pela entrega das notificações.

O processamento será separado em responsabilidades:

- `reminder.service.ts` → acesso aos lembretes agendados;
- `reminderScheduler.service.ts` → regras de horário,
  dias e cálculo da ocorrência;
- `reminderDelivery.repository.ts` → persistência e
  controle de idempotência;
- `reminderProcessor.service.ts` → orquestração do
  processamento.

## Regras de Execução

- `active = false` → o lembrete não será processado.
- `time = NULL` → o lembrete não possui horário válido
  para processamento automático.
- `days = NULL` → o lembrete é válido todos os dias.
- Quando `days` possuir valores, o lembrete será
  processado somente nos dias configurados.
- O campo `time` representa o horário local configurado
  pelo usuário.
- A ocorrência é identificada pela combinação
  `reminder_id` + `scheduled_for`.
- A combinação `reminder_id` + `scheduled_for` possui
  uma restrição `UNIQUE`, impedindo o processamento
  duplicado da mesma ocorrência.

## Registro de Execução

A tabela `reminder_deliveries` registra que uma ocorrência
foi assumida para processamento pelo scheduler.

O registro utiliza:

- `reminder_id` → referência ao lembrete agendado;
- `scheduled_for` → instante correspondente à ocorrência;
- `created_at` → momento em que a execução foi registrada.

O registro de `reminder_deliveries` representa o controle
de execução e idempotência.

Ele não representa confirmação de entrega da Push
Notification ao dispositivo.

## Fluxo

1. O processor busca os lembretes ativos.
2. O scheduler verifica horário e dia.
3. O scheduler calcula `scheduled_for`.
4. O repository tenta registrar a ocorrência.
5. A constraint `UNIQUE` impede duplicidade.
6. Ocorrências reservadas ficam disponíveis para a etapa
   de envio da Push.

## Idempotência

A idempotência é garantida pelo banco de dados através da
restrição:

`UNIQUE (reminder_id, scheduled_for)`

Quando duas execuções tentarem registrar a mesma ocorrência,
somente uma poderá realizar o registro.

A execução que encontrar uma violação de unicidade não
deve processar novamente a ocorrência.

## Fora do escopo

- Alterações na UI;
- Alteração do Service Worker;
- Substituição do Web Push;
- Nova infraestrutura de filas;
- Retry de notificações;
- Estados de entrega (`pending`, `sent`, `failed`).

## Consequências

O processamento automático deixa de depender da execução
do frontend.

O backend passa a ser responsável pelo processamento
dos lembretes agendados.

A arquitetura possui responsabilidades separadas entre
acesso aos dados, regras de agendamento, persistência,
idempotência e orquestração.

O envio da Push Notification permanece sob
responsabilidade do `push.service.ts`.
