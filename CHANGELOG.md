# Changelog

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

O formato deste documento é baseado no **Keep a Changelog**.

O Fluidity segue o padrão de versionamento **Semantic Versioning (SemVer 2.0.0)**.

## Tipos de alterações

- **Adicionado** para novas funcionalidades.
- **Alterado** para mudanças em funcionalidades existentes.
- **Corrigido** para correções de bugs.
- **Removido** para funcionalidades removidas.
- **Segurança** para correções relacionadas à segurança.

---

## [0.6.0] - 2026-07-24

### Alterado

- Refatoração completa do fluxo de instalação da PWA.
- Centralização da lógica de instalação em `PWAInstallProvider`.
- Navegador definido como fonte da verdade para o estado da instalação.
- Separação entre estado técnico da PWA e preferências da interface.
- Evolução da arquitetura das notificações Push.

### Documentação

- Atualização completa do README.
- Consolidação dos Architecture Decision Records (ADRs).
- Padronização da documentação técnica.
- Atualização da documentação de governança.

### Segurança

- Consolidação do fluxo de release com validação obrigatória da pipeline de CI antes da publicação.

---

## [0.5.0] - 2026-06-18

### Adicionado

- Infraestrutura de testes unitários utilizando Vitest.
- Primeira suíte de testes unitários.
- Integração dos testes unitários ao pipeline de Continuous Integration.
- Documentação de governança para proteção da branch principal.
- Infraestrutura inicial para automação do processo de release.

### Alterado

- Atualização da documentação principal do projeto.
- Aprimoramento da documentação da infraestrutura.
- Padronização da documentação técnica.
- Integração dos scripts de versionamento ao fluxo de preparação de releases.
- Sincronização automática da versão exibida no README durante o processo de release.
- Refatoração completa do fluxo de instalação da PWA.
- Centralização do fluxo de instalação em `PWAInstallProvider`.
- Adoção do navegador como fonte de verdade para o estado de instalação.
- Desacoplamento entre registro de humor e instalação da PWA.
- Separação entre estado técnico da PWA e preferências da interface.
- Migração da identidade da infraestrutura de Push Notifications para `device_id`.
- Implementação da sincronização automática entre autenticação e Push Subscription.
- Criação do `subscriptionSyncService`.
- Atualização da modelagem da tabela `push_subscriptions`.
- Atualização da modelagem da tabela `reminder_settings`, tornando `user_id` a identidade da configuração.
- Remoção da restrição `UNIQUE(device_id)` de `reminder_settings`.
- Correção do carregamento inicial das configurações de notificações.

### Documentação

- Consolidação dos ADRs da arquitetura da instalação da PWA.
- Consolidação dos ADRs da arquitetura de notificações Push.
- Padronização da documentação arquitetural do projeto.

### Segurança

- Implementação de proteção da branch `main` por meio de Rulesets do GitHub.
- Exigência de validação da pipeline de CI antes do merge.
- Bloqueio de force push na branch principal.

---

## [0.3.0] - 2026-04-17

### Adicionado

- Central de lembretes inteligentes.
- Configuração de notificações.
- Gerenciamento de configurações de lembretes.
- Evolução da infraestrutura da aplicação.

### Observações

- Consolidação da arquitetura da PWA para preparação da aplicação para ambiente de produção.

### Alterado

- Migração da identidade da infraestrutura de Push Notifications para `device_id`.
- Implementação da sincronização automática entre autenticação e Push Subscription.
- Criação do `subscriptionSyncService`.
- Atualização da modelagem da tabela `push_subscriptions`.
- Atualização da modelagem da tabela `reminder_settings`, tornando `user_id` a identidade da configuração.
- Remoção da restrição `UNIQUE(device_id)` de `reminder_settings`, permitindo múltiplos usuários utilizarem o mesmo dispositivo.
- Correção do carregamento inicial das configurações de notificações.