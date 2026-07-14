# Railway

## Objetivo

Documentar a configuração do ambiente Railway responsável pelo Push Server do Fluidity.

---

# Serviço

Push Server

---

# Plataforma

Railway

---

# Root Directory

```text
/push-server
```

---

# Branch de Produção

```text
main
```

---

# Build Command

```bash
npm run build
```

---

# Start Command

```bash
npm start
```

---

# Domínio Público

```text
https://fluidity-production.up.railway.app
```

---

# Variáveis Obrigatórias

- PORT
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY

---

# Estrutura do Serviço

```text
push-server/

├── src/
├── dist/
├── package.json
└── tsconfig.json
```

---

# Processo de Deploy

```text
Merge na main

        │

        ▼

GitHub

        │

        ▼

Railway

        │

        ▼

Build

        │

        ▼

Deploy

        │

        ▼

Produção
```

---

# Auditoria

Antes de qualquer alteração verificar:

- Root Directory
- Branch
- Variáveis
- Build Command
- Start Command
- Logs de Build
- Logs de Deploy
- Status do serviço

---

# Boas Práticas

- Nunca alterar o Root Directory para a raiz do repositório.
- Manter as variáveis sincronizadas.
- Validar o funcionamento das notificações após cada alteração.
- Auditar a infraestrutura antes de modificar configurações.
