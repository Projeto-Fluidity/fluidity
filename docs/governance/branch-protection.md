# Proteção da Branch Main

## Objetivo

A branch `main` representa a versão oficial de produção do projeto Fluidity.

Sua proteção garante que toda alteração publicada siga obrigatoriamente o fluxo oficial de desenvolvimento, preservando a estabilidade da aplicação, a rastreabilidade das mudanças e a qualidade do processo de entrega.

Esta política não altera o funcionamento da aplicação, apenas fortalece a governança do repositório.

---

# Fluxo Oficial

Todo desenvolvimento deve seguir o fluxo abaixo:

```text
feature/*
        │
        ▼
develop
        │
        ▼
Pull Request
        │
        ▼
main
```

Não são permitidas alterações diretas na branch `main`.

---

# Regras configuradas

## Pull Request obrigatório

Toda alteração destinada à `main` deve ser realizada através de Pull Request.

Não é permitido realizar merge direto na branch protegida.

---

## Aprovações

Atualmente o projeto não exige aprovações obrigatórias.

Quantidade mínima:

```text
0
```

Essa decisão considera que o projeto possui um mantenedor principal.

A política poderá ser revisada futuramente conforme o crescimento da equipe.

---

## Conversas

Todas as conversas abertas durante a Pull Request devem ser resolvidas antes do merge.

---

## Continuous Integration

O merge somente é permitido após a execução bem-sucedida do Status Check obrigatório:

```text
validate
```

Esse Status Check representa a validação da infraestrutura de Continuous Integration do projeto.

Atualmente contempla:

- Lint;
- Testes Unitários (Vitest);
- Build.

---

## Branch atualizada

A branch da Pull Request deve estar sincronizada com a versão mais recente da `main` antes do merge.

Essa regra reduz riscos de regressões causadas por alterações recentes.

---

## Force Push

Force Push é bloqueado na branch `main`.

Essa restrição preserva o histórico do repositório, Git Tags, Releases e a rastreabilidade das alterações.

---

## Exclusão

A exclusão da branch `main` é bloqueada.

Essa proteção evita perda acidental da principal branch do projeto.

---

# O que permanece permitido

- Desenvolvimento em `feature/*`;
- Pull Requests para `develop`;
- Promoção de `develop` para `main`;
- GitHub Releases;
- Git Tags;
- Semantic Versioning;
- Continuous Delivery.

---

# Benefícios

A política implementada proporciona:

- maior estabilidade;
- rastreabilidade das alterações;
- proteção contra erros operacionais;
- integração efetiva da CI ao processo de merge;
- preservação do fluxo oficial de desenvolvimento.

---

# Fora do escopo

Esta implementação não contempla:

- proteção da branch `develop`;
- CODEOWNERS;
- Pull Request Templates;
- Issue Templates;
- Labels;
- Milestones;
- Dependabot;
- CodeQL;
- Renovate;
- Semantic Release.

Esses itens serão avaliados em futuras evoluções da governança do repositório.

---

# Evoluções Futuras

Entre as melhorias previstas para a governança estão:

- proteção da branch `develop`;
- adoção de CODEOWNERS;
- política de revisões obrigatórias;
- definição oficial da estratégia de merge;
- automações adicionais para Pull Requests.
