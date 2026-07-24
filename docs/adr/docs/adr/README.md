# Architecture Decision Records (ADR)

Esta pasta reúne os **Architecture Decision Records (ADRs)** do Fluidity.

Um ADR registra uma decisão arquitetural relevante, o contexto em que ela foi tomada e as consequências para a evolução do projeto.

Seu principal objetivo é preservar o histórico das decisões técnicas, facilitando a manutenção, a evolução da arquitetura e o entendimento do projeto por novos colaboradores.

---

# Estrutura de um ADR

Cada ADR deve documentar, sempre que aplicável:

- Contexto
- Problema
- Decisão
- Evolução da implementação
- Consequências
- Componentes impactados
- Status da implementação

Nem todas as seções são obrigatórias, porém a estrutura deve permanecer consistente entre os documentos.

---

# Convenções

Os ADRs seguem uma numeração sequencial:

```text
ADR-0001
ADR-0002
ADR-0003
...
```

A numeração nunca deve ser reutilizada.

O nome do arquivo deve representar de forma objetiva a decisão arquitetural documentada.

Exemplos:

```text
ADR-0001-pwa-install-flow.md
ADR-0002-push-notification-identity.md
```

---

# Evolução das decisões

Um ADR representa uma decisão tomada em determinado momento da evolução do projeto.

Um ADR **não deve ser reescrito para representar uma decisão diferente**.

Quando a arquitetura evoluir, uma nova ADR deve ser criada, referenciando a decisão anterior quando necessário.

Dessa forma, o histórico arquitetural permanece íntegro e rastreável.

---

# Quando criar um ADR

Um novo ADR deve ser criado sempre que houver uma decisão arquitetural relevante, por exemplo:

- adoção de um novo padrão arquitetural;
- alteração significativa da estrutura da aplicação;
- mudança de responsabilidades entre componentes;
- definição de estratégias de persistência;
- decisões sobre autenticação, infraestrutura ou segurança;
- mudanças permanentes que impactem a evolução do sistema.

Pequenas refatorações, correções de bugs e alterações locais normalmente não justificam um novo ADR.

---

# Status

Cada ADR deve indicar seu estado atual.

Os status adotados pelo projeto são:

- ✅ Proposto
- ✅ Implementado
- 🚧 Em evolução
- 🔄 Substituído

Quando uma decisão for substituída, o novo ADR deve referenciar explicitamente o anterior.

---

# ADRs do projeto

| ADR | Descrição |
|------|-----------|
| ADR-0001 | Desacoplamento do fluxo de instalação da PWA |
| ADR-0002 | Arquitetura de identidade das notificações Push |
