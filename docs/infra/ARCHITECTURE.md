# Arquitetura da Infraestrutura

## Objetivo

Este documento apresenta a visão geral da infraestrutura do Fluidity, descrevendo como os serviços se comunicam e quais são as responsabilidades de cada componente.

---

# Visão Geral

O Fluidity é composto por dois serviços independentes:

- Frontend
- Push Server

Ambos compartilham a mesma base de dados hospedada no Supabase.

```text
                 GitHub
                    │
     ┌──────────────┴──────────────┐
     │                             │
Frontend (React/Vite)         Push Server (Node.js)
     │                             │
     ▼                             ▼
   Vercel                      Railway
     │                             │
     └──────────────┬──────────────┘
                    │
                Supabase
```

---

# Frontend

Hospedado na Vercel.

Responsável por:

- Interface da aplicação
- Autenticação
- Comunicação com Supabase
- Registro do Service Worker
- Registro das Push Subscriptions
- Consumo do Push Server

---

# Push Server

Hospedado no Railway.

Responsável por:

- Gerenciar inscrições Push
- Enviar notificações
- Integrar com Web Push API
- Comunicar-se com Supabase

---

# Supabase

Responsável por:

- Autenticação
- Banco de dados
- Armazenamento das inscrições Push
- Persistência das configurações da aplicação

---

# Fluxo das Notificações

```text
Usuário

    │

    ▼

Frontend

    │

    ▼

Push Server

    │

    ▼

Web Push API

    │

    ▼

Navegador

    │

    ▼

Notificação
```

---

# Separação de Responsabilidades

| Serviço | Responsabilidade |
|----------|------------------|
| Frontend | Interface e experiência do usuário |
| Push Server | Processamento das notificações Push |
| Supabase | Persistência dos dados |
| Vercel | Hospedagem do Frontend |
| Railway | Hospedagem do Push Server |