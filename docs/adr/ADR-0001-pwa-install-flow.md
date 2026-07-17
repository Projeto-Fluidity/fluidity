# ADR-0001 — Desacoplamento do Fluxo de Instalação da PWA

- **Status:** Aceita
- **Data:** 2026-07-17

---

## Contexto

Inicialmente, o card de instalação da PWA era exibido somente após o registro de um humor.

A lógica dependia de estados temporários (`sessionStorage`) criados pelo fluxo de registro de humor.

Essa abordagem gerava um forte acoplamento entre duas funcionalidades independentes:

- Registro de humor;
- Instalação da PWA.

Além disso, a exibição do convite deixava de refletir o estado real da aplicação e do navegador.

---

## Problema

O fluxo de instalação da PWA dependia de eventos que não possuem relação com a instalação da aplicação.

Isso dificultava:

- manutenção;
- evolução do código;
- reutilização dos componentes;
- previsibilidade do comportamento.

---

## Decisão

O convite de instalação deve depender exclusivamente do estado da PWA e das capacidades disponibilizadas pelo navegador.

A lógica de exibição passa a considerar apenas informações como:

- existência do evento `beforeinstallprompt`;
- aplicação instalada;
- plataforma suportada.

O fluxo de registro de humor deixa de participar dessa decisão.

---

## Consequências

### Positivas

- Separação clara de responsabilidades.
- Fluxo aderente às recomendações para PWAs.
- Eliminação de dependências em `sessionStorage`.
- Código mais previsível.
- Facilidade para evolução futura.

### Negativas

- Necessidade de revisar os componentes relacionados ao fluxo de instalação.

---

## Componentes impactados

- InstallAppCard
- Hooks relacionados à instalação da PWA
- Serviços de instalação
- Fluxo de registro de humor

---

## Status da implementação

✅ Implementado.
