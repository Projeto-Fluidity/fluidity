# Infraestrutura e Deploy do Fluidity

## Objetivo

Este documento descreve a arquitetura de infraestrutura do Fluidity, os serviços utilizados, o fluxo de deploy, as configurações necessárias e as boas práticas para manutenção do ambiente de produção.

---

# Arquitetura

O Fluidity é composto por dois serviços independentes que trabalham de forma integrada.

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

Cada serviço possui seu próprio ciclo de build e deploy, permitindo evolução e manutenção independentes.

---

# Frontend

Responsável pela interface da aplicação e pela experiência do usuário.

## Plataforma

Vercel

## Tecnologias

- React
- TypeScript
- Vite
- PWA

## Responsabilidades

- Interface da aplicação
- Registro do Service Worker
- Registro das Push Subscriptions
- Comunicação com Supabase
- Comunicação com o Push Server

## Deploy

Todo merge na branch `main` dispara automaticamente um novo deploy na Vercel.

---

# Push Server

Responsável pelo processamento e envio das notificações Push.

## Plataforma

Railway

## Localização no repositório

```text
/push-server
```

O Push Server é um serviço Node.js independente localizado dentro do monorepositório.

## Responsabilidades

- Registro de Push Subscriptions
- Envio de notificações Push
- Comunicação com Supabase
- Gerenciamento das chaves VAPID
- Integração com Web Push API

## Build

```bash
npm run build
```

## Inicialização

```bash
npm start
```

---

# Domínio Público

O Push Server é disponibilizado publicamente através do domínio:

```text
https://fluidity-production.up.railway.app
```

O frontend acessa esse serviço através da variável de ambiente:

```text
VITE_PUSH_API_URL
```

---

# Variáveis de Ambiente

O Push Server depende das seguintes variáveis para funcionamento:

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta utilizada pelo servidor |
| `SUPABASE_URL` | URL da instância Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave Service Role do Supabase |
| `VAPID_PUBLIC_KEY` | Chave pública utilizada nas notificações Push |
| `VAPID_PRIVATE_KEY` | Chave privada utilizada nas notificações Push |

Sem essas variáveis o serviço não poderá ser iniciado corretamente.

---

# Fluxo de CI/CD

## Frontend

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

## Push Server

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

# Fluxo das Notificações Push

```text
Usuário

    │

    ▼

Frontend (Vercel)

    │
    │ Registro da Subscription
    ▼

Push Server (Railway)

    │
    │ Web Push API
    ▼

Navegador

    │

    ▼

Notificação exibida ao usuário
```

---

# Configuração do Push Server

A configuração de produção deve seguir os seguintes parâmetros:

| Configuração | Valor |
|--------------|-------|
| Plataforma | Railway |
| Root Directory | `/push-server` |
| Branch de produção | `main` |
| Build Command | `npm run build` |
| Start Command | `npm start` |

---

# Checklist de Auditoria

Antes de realizar qualquer alteração na infraestrutura, verificar:

- Projeto Railway correto;
- Root Directory configurado como `/push-server`;
- Branch de produção;
- Variáveis de ambiente;
- Build Command;
- Start Command;
- Domínio público;
- Logs de Build;
- Logs de Deploy;
- Status do serviço;
- Comunicação entre frontend e Push Server;
- Funcionamento das notificações Push.

Nenhuma alteração de infraestrutura deve ser realizada sem auditoria prévia.

---

# Boas Práticas

- Manter o frontend hospedado exclusivamente na Vercel.
- Manter o Push Server hospedado exclusivamente no Railway.
- Utilizar sempre `/push-server` como Root Directory do serviço.
- Manter as variáveis de ambiente sincronizadas com a infraestrutura.
- Validar o funcionamento das notificações Push após alterações de deploy.
- Documentar qualquer alteração de infraestrutura neste diretório.

---

# Estrutura da Infraestrutura

```text
docs/
└── infra/
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    ├── RAILWAY.md
    └── VERCEL.md
```

Cada documento possui uma responsabilidade específica:

- **ARCHITECTURE.md** → visão geral da arquitetura da aplicação.
- **DEPLOYMENT.md** → fluxo de deploy, CI/CD e configuração da infraestrutura.
- **RAILWAY.md** → configuração detalhada do Push Server.
- **VERCEL.md** → configuração detalhada do frontend.
