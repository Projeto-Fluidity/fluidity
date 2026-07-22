# ADR-0001 — Desacoplamento do Fluxo de Instalação da PWA

- **Status:** Implementada
- **Data:** 2026-07-17

---

## Evolução da implementação

Durante a implementação e validação do novo fluxo observou-se que a decisão de exibir o convite de instalação não deve depender apenas da existência do evento `beforeinstallprompt`.

A exibição do convite deve refletir o contexto atual informado pelo navegador e respeitar as preferências temporárias do usuário, evitando apresentar ações que não possuem utilidade.

Como consequência:

- o navegador permanece como fonte de verdade sobre o estado da instalação;
- a aplicação não persiste um estado próprio indicando que a PWA está instalada;
- o armazenamento local é utilizado apenas para registrar preferências temporárias da interface;
- o convite poderá ser reapresentado futuramente após uma dispensa temporária, respeitando as regras definidas pela aplicação.

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

O convite de instalação deve depender exclusivamente das informações disponibilizadas pelo navegador e das preferências temporárias da interface.

A lógica de exibição considera:

- disponibilidade de instalação informada pelo navegador;
- execução da aplicação em modo `standalone`;
- plataforma suportada;
- preferência temporária do usuário em dispensar o convite.

O fluxo de registro de humor deixa de participar dessa decisão.

A aplicação não mantém um estado próprio indicando que o aplicativo está instalado.

---

## Preferências da interface

A aplicação poderá persistir apenas preferências relacionadas à experiência do usuário.

Exemplos:

- data da última dispensa do convite de instalação.

Essas informações representam apenas preferências temporárias da interface e não substituem o estado informado pelo navegador.

---

## Consequências

### Positivas

- Separação clara de responsabilidades.
- Fluxo aderente às recomendações para PWAs.
- Eliminação de dependências em `sessionStorage`.
- Navegador definido como fonte de verdade sobre o estado da instalação.
- Separação entre estado técnico da aplicação e preferências da interface.
- Código mais previsível.
- Facilidade para evolução futura.

### Negativas

- Necessidade de revisar os componentes relacionados ao fluxo de instalação.
- Dependência das capacidades disponibilizadas por cada navegador.

---

## Componentes impactados

- InstallAppCard
- Hooks relacionados à instalação da PWA
- Serviços de instalação
- Fluxo de registro de humor

---

## Status da implementação

✅ Implementado.

Principais entregas:

- remoção do acoplamento entre registro de humor e instalação da PWA;
- remoção da dependência de `sessionStorage`;
- adoção do navegador como fonte de verdade sobre o estado da instalação;
- separação entre estado técnico da PWA e preferências da interface;
- arquitetura preparada para reexibição controlada do convite de instalação.
