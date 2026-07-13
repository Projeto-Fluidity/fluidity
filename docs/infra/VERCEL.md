# Vercel

## Objetivo

Documentar a configuração do ambiente Vercel responsável pelo Frontend do Fluidity.

---

# Serviço

Frontend

---

# Plataforma

Vercel

---

# Framework

React + Vite

---

# Branch de Produção

```text
main
```

---

# Build

```bash
npm run build
```

---

# Output

```text
dist/
```

---

# Responsabilidades

- Interface do usuário
- Registro do Service Worker
- Registro das Push Subscriptions
- Comunicação com Supabase
- Comunicação com o Push Server

---

# Variáveis Importantes

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_PUSH_API_URL
- VITE_DATA_MODE

---

# Processo de Deploy

```text
Merge na main

        │

        ▼

GitHub Actions

        │

        ▼

Vercel

        │

        ▼

Produção
```

---

# Auditoria

Antes de alterar o ambiente verificar:

- Branch
- Variáveis
- Build
- Logs
- Domínio
- Comunicação com o Push Server

---

# Boas Práticas

- Não armazenar segredos no frontend.
- Utilizar apenas variáveis prefixadas com `VITE_`.
- Validar a comunicação com o Push Server após cada deploy.
