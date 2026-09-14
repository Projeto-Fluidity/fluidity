# Sistema de Lembretes — Arquitetura

## Visão Geral

O sistema de lembretes do Fluidity permite configurar lembretes
de bem-estar associados a horários e dias específicos.

O processamento automático dos lembretes é realizado pelo backend.
O frontend é responsável pela configuração e gerenciamento dos
lembretes, mas não precisa permanecer em execução para que o
backend processe uma ocorrência agendada.

O Push Server permanece responsável pelo envio das notificações
por Web Push.

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
| time       | horário local do lembrete (`HH:mm`) |
| days       | dias da semana |
| active     | indica se o lembrete está ativo |
| is_fixed   | indica se o lembrete é obrigatório |
| created_at | data de criação |

### reminder_deliveries

Registra que uma ocorrência foi assumida para processamento
pelo scheduler.

| campo        | descrição |
|--------------|-----------|
| id           | identificador único |
| reminder_id  | referência ao lembrete |
| scheduled_for| instante correspondente à ocorrência |
| created_at   | momento em que a execução foi registrada |

A combinação `reminder_id` + `scheduled_for` possui uma restrição
`UNIQUE`, garantindo a idempotência da ocorrência.

> O registro em `reminder_deliveries` confirma apenas que a ocorrência
> foi registrada para processamento. Ele não confirma que a Push
> Notification foi entregue ou apresentada no dispositivo.

### reminder_logs

A tabela `reminder_logs` não é utilizada pelo scheduler automático
atual como mecanismo de controle de execução ou idempotência.

---

## Tipos de Lembretes

### Lembretes fixos

São lembretes obrigatórios da aplicação.

Atualmente existe:

- Registro diário de humor.

### Lembretes configuráveis

São criados e gerenciados pelo usuário.

Exemplos:

- Lembretes de hidratação;
- Outros lembretes de bem-estar configuráveis.

---

## Regras de Disparo

Uma ocorrência pode ser processada quando:

- o lembrete está ativo;
- o campo `time` possui um horário válido;
- o horário local atual corresponde ao horário configurado;
- o dia atual está configurado no lembrete;
- a ocorrência ainda não foi registrada em `reminder_deliveries`.

Quando `days` é `NULL`, o lembrete é considerado válido para todos
os dias.

O campo `time` representa o horário local configurado pelo usuário.
A interpretação de horário utiliza o timezone:

```text
America/Sao_Paulo
```

A ocorrência é identificada pela combinação:

```text
reminder_id + scheduled_for
```

---

## Agendamento Automático

O processamento automático é realizado pelo backend por meio de
um scheduler executado periodicamente.

Fluxo:

1. O scheduler consulta os lembretes ativos.
2. O sistema verifica se o lembrete está habilitado para o usuário.
3. O sistema verifica o dia e o horário configurados.
4. O sistema calcula o instante `scheduled_for`.
5. O sistema tenta registrar a ocorrência em `reminder_deliveries`.
6. A restrição `UNIQUE` impede o processamento duplicado.
7. A ocorrência registrada é encaminhada para o envio da Push.
8. O Push Server tenta enviar a notificação por Web Push.
9. O navegador ou sistema operacional pode apresentar a notificação
   por meio do Service Worker.

---

## Arquitetura de Entrega

```text
scheduled_reminders
        │
        ▼
Reminder Processor
        │
        ▼
Reminder Scheduler
        │
        ▼
Regra de dia e horário
        │
        ▼
reminder_deliveries
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
Navegador / Sistema operacional
```

---

## Condições para Recebimento

O recebimento da notificação depende de:

- permissão de notificações concedida no dispositivo;
- subscription Web Push válida e associada ao usuário;
- navegador ou ambiente compatível com Web Push;
- conectividade disponível;
- funcionamento do navegador, Service Worker e sistema operacional.

Cada dispositivo deve possuir sua própria subscription. Uma
subscription registrada no computador não representa automaticamente
a subscription de um smartphone.

---

## Limitações Atuais do MVP

No escopo atual:

- o scheduler executa periodicamente no backend;
- não existe infraestrutura de filas;
- não existe retry automático de notificações;
- não existem estados formais como `pending`, `sent` ou `failed`;
- o registro em `reminder_deliveries` ocorre antes da tentativa de envio;
- o registro da ocorrência não garante a entrega efetiva ao dispositivo;
- o funcionamento com o navegador completamente encerrado pode variar
  conforme o navegador, o sistema operacional e o ambiente do dispositivo;
- o frontend não deve ser considerado responsável pelo disparo automático
  dos lembretes.

Esses pontos podem ser tratados em uma evolução futura do sistema.