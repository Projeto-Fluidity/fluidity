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

## [0.4.0] - Em desenvolvimento

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

- Primeira release oficial publicada utilizando Git Tags e GitHub Releases.
