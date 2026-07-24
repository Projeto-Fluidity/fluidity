# ADR-0001 — Desacoplamento do Fluxo de Instalação da PWA

- **Status:** ✅ Implementado
- **Data:** 2026-07-17

---

# Contexto

O fluxo de instalação da Progressive Web App (PWA) estava acoplado ao registro de humor da aplicação.

O convite para instalação era exibido somente após o usuário registrar um humor, utilizando estados temporários armazenados em `sessionStorage`.

Essa abordagem fazia com que uma funcionalidade de interface dependesse diretamente de uma funcionalidade de domínio, criando um acoplamento entre duas responsabilidades independentes:

- Registro de humor;
- Instalação da PWA.

Além disso, a decisão de exibição do convite deixava de refletir o estado real informado pelo navegador, tornando o comportamento menos previsível e mais difícil de manter.

---

# Problema

A lógica responsável pela instalação da PWA dependia de eventos que não possuíam qualquer relação com a instalação da aplicação.

Como consequência:

- havia acoplamento entre funcionalidades independentes;
- componentes de interface assumiam responsabilidades relacionadas à API do navegador;
- o fluxo era difícil de evoluir;
- o comportamento tornava-se pouco previsível;
- a reutilização dos componentes era limitada.

---

# Decisão

A responsabilidade pela captura e gerenciamento do evento `beforeinstallprompt` passa a ser centralizada em um único Provider da aplicação.

A arquitetura passa a ser composta por:

```text
Browser
      │
beforeinstallprompt
      │
      ▼
PWAInstallProvider
      │
      ▼
PWAInstallContext
      │
      ▼
usePWAInstall
      │
      ▼
InstallAppCard
```

O navegador passa a ser a única fonte de verdade sobre o estado de instalação da aplicação.

A aplicação deixa de manter qualquer estado próprio indicando se a PWA está instalada.

A decisão de exibição do convite passa a considerar exclusivamente:

- disponibilidade de instalação informada pelo navegador;
- execução da aplicação em modo `standalone`;
- plataforma suportada;
- política de exibição definida pela aplicação;
- preferência temporária do usuário em dispensar o convite.

O fluxo de registro de humor deixa de participar dessa decisão.

---

# Preferências da Interface

A aplicação poderá persistir apenas informações relacionadas à experiência do usuário.

Exemplos:

- data da última dispensa do convite;
- período para reapresentação do card de instalação.

Essas informações representam apenas preferências temporárias da interface e nunca substituem o estado informado pelo navegador.

---

# Evolução da Implementação

Durante a implementação foi identificada a necessidade de separar a lógica de instalação da responsabilidade dos componentes de interface.

Como consequência, foi adotada uma arquitetura baseada em Provider/Context, responsável por centralizar toda a comunicação com a API de instalação da PWA.

Essa mudança permitiu:

- eliminar dependências entre funcionalidades distintas;
- remover estados artificiais relacionados à instalação;
- simplificar os componentes consumidores;
- manter uma única origem para o estado de instalação.

---

# Observações para Testes

Durante a validação da implementação foi observado um comportamento importante do Chrome.

O evento `beforeinstallprompt` não é disparado quando a aplicação já está instalada para a mesma origem.

Para validar novamente o fluxo de instalação é necessário:

- desinstalar previamente a PWA;
- ou utilizar outra origem (porta ou domínio diferente).

Esse comportamento pertence ao navegador e não à aplicação.

Durante a investigação esse comportamento foi inicialmente interpretado como um possível problema na implementação. Após auditoria completa da arquitetura foi confirmado que o fluxo estava correto e que a ausência do evento era consequência do estado de instalação mantido pelo navegador.

---

# Consequências

## Positivas

- Separação clara de responsabilidades.
- Arquitetura baseada em Provider/Context.
- Navegador definido como fonte de verdade sobre o estado da instalação.
- Eliminação do acoplamento entre instalação da PWA e registro de humor.
- Eliminação da dependência de `sessionStorage`.
- Separação entre estado técnico da aplicação e preferências da interface.
- Código mais previsível.
- Componentes com responsabilidade única.
- Facilidade para evolução futura.

## Negativas

- Dependência das capacidades disponibilizadas por cada navegador.
- Necessidade de adaptação dos componentes relacionados ao fluxo de instalação.
- O comportamento pode variar conforme as políticas de instalação adotadas pelo navegador.

---

# Componentes Impactados

- `PWAInstallProvider`
- `PWAInstallContext`
- `usePWAInstall`
- `InstallAppCard`
- `pwaInstallPromptPolicy`
- `pwaInstallPromptStorage`
- fluxo de registro de humor

---

# Status da Implementação

✅ Implementado.

Principais entregas:

- criação do `PWAInstallProvider`;
- criação do `PWAInstallContext`;
- centralização da captura do evento `beforeinstallprompt`;
- simplificação do `usePWAInstall` através do Context;
- desacoplamento entre instalação da PWA e registro de humor;
- remoção da dependência de `sessionStorage`;
- adoção do navegador como fonte de verdade sobre o estado da instalação;
- separação entre estado técnico da PWA e preferências da interface;
- arquitetura preparada para evolução do fluxo de instalação sem impacto nas funcionalidades de domínio.
