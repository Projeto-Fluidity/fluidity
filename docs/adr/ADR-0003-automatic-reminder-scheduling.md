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
entregues independentemente da execução do frontend.

## Decisão

O processamento automático dos lembretes será movido
para o backend, mantendo o Push Server como responsável
pela entrega das notificações.

## Escopo

- Processar `scheduled_reminders`
- Avaliar horário e dias
- Evitar disparos duplicados
- Enviar Push
- Registrar a entrega

## Fora do escopo

- Alterações na UI
- Alteração do Service Worker
- Substituição do Web Push
- Nova infraestrutura de filas

## Consequências

O navegador não precisará estar aberto para que o
lembrete seja processado.

O backend passa a ser responsável pelo agendamento.
