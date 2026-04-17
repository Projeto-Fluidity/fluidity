# Sistema de Lembretes - Arquitetura

## Visão Geral

O sistema de lembretes foi projetado para exibir sugestões diárias de bem-estar,
garantindo que cada lembrete seja apresentado apenas uma vez por dia.

---

## Estrutura de Dados

### reminders (tabela base)

Armazena os lembretes fixos do sistema.

| campo       | descrição |
|------------|----------|
| id         | identificador único |
| title      | título do lembrete |
| description| descrição |
| time       | horário sugerido |
| variant    | tipo visual |

---

### reminder_logs (histórico)

Armazena todas as interações do usuário.

| campo        | descrição |
|-------------|----------|
| id          | identificador |
| reminder_id | referência ao reminder |
| action      | accepted / postponed |
| created_at  | data da interação |

---

## Regra de Negócio

Um lembrete é exibido apenas se:

- NÃO houver registro em `reminder_logs` no dia atual

---

## Fluxo

1. Usuário acessa a tela
2. Sistema busca reminders
3. Sistema busca logs do dia
4. Filtra lembretes já utilizados
5. Exibe apenas os disponíveis

---

## Interação

Ao clicar em um lembrete:

- Um registro é criado em `reminder_logs`
- O lembrete é removido da interface
- Não aparece novamente no mesmo dia

---

## Benefícios

- Histórico completo de interações
- Comportamento consistente por dia
- Base para métricas e análises futuras
