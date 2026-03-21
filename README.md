# Fluidity

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node](https://img.shields.io/badge/Node-22.13.0-green)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Status](https://img.shields.io/badge/status-MVP-yellow)

Aplicação web para **registro e acompanhamento do humor diário do usuário**.

O objetivo do projeto é permitir que o usuário registre como está se sentindo ao longo do tempo e acompanhe seu histórico emocional, incentivando práticas simples de bem-estar.

O **Fluidity** está sendo desenvolvido inicialmente como um **MVP (Minimum Viable Product)** focado em validar a experiência de registro diário de humor.

---

# Interface do projeto

Algumas telas do **Fluidity** baseadas no design do UX.

> As imagens abaixo representam as principais telas do MVP.

![Tela de emoção](docs/screens/emotion.png)

![Tela de sucesso](docs/screens/success.png)

![Tela de erro](docs/screens/error.png)

![Tela de histórico](docs/screens/history.png)

---

# Objetivo do projeto

O Fluidity busca oferecer uma experiência simples e acessível para que usuários possam:

* registrar seu humor diariamente
* acompanhar padrões emocionais ao longo do tempo
* visualizar seu histórico de registros
* acessar exercícios simples de bem-estar

---

# Funcionalidades do MVP

### Check-in diário de humor

O usuário pode registrar como está se sentindo no dia através de uma seleção de emoções representadas por emojis.

### Histórico de humor

Visualização do histórico de registros de humor, ordenados do mais recente para o mais antigo.

### Exercícios de bem-estar

Recomendações de exercícios simples voltados ao equilíbrio emocional.

---

# Funcionalidades já implementadas

Atualmente o projeto já possui:

* Registro diário de humor
* Persistência de dados utilizando **Supabase**
* Histórico de registros de humor
* Ordenação automática do histórico
* Atualização reativa da interface após registro
* Prevenção de múltiplos registros no mesmo dia
* Gerenciamento de estado com hook customizado
* Arquitetura organizada em camadas
* Modo QA com dados mockados

---

# Stack do projeto

| Camada         | Tecnologia         |
| -------------- | ------------------ |
| Frontend       | React + TypeScript |
| Build Tool     | Vite               |
| Estilização    | Tailwind CSS       |
| Backend        | Supabase           |
| Banco de dados | PostgreSQL         |
| Ícones         | Lucide React       |

---

# Versão do Node

O projeto foi desenvolvido utilizando:

```id="nodever"
Node.js 22.13.0
```

Recomenda-se utilizar a mesma versão para evitar incompatibilidades.

---

# Arquitetura do projeto

A aplicação segue uma arquitetura baseada em **separação de responsabilidades em camadas**.

```id="archtree"
src
 ├ components
 ├ hooks
 ├ services
 ├ mocks
 ├ config
 ├ lib
 ├ types
 ├ pages
```

---

# Fluxo da aplicação

```id="flowapp"
components
     ↓
hooks
     ↓
services
     ↓
Supabase / Mock
```

Essa abordagem permite:

* melhor organização do código
* maior facilidade de manutenção
* escalabilidade da aplicação
* separação clara entre interface e regras de negócio

---

# Como executar o projeto

Clone o repositório:

```id="clone"
git clone https://github.com/pipocaagil-hash/projeto-fluidity.git
```

Entre na pasta do projeto:

```id="cd"
cd projeto-fluidity
```

Instale as dependências:

```id="install"
npm install
```

Execute o projeto:

```id="run"
npm run dev
```

A aplicação ficará disponível em:

```id="url"
http://localhost:5173
```

---

# Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```id="env"
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_USE_MOCK=false
```

---

# 🧪 Modo QA (Mock de dados)

O projeto possui um modo de execução com dados mockados, permitindo testes da aplicação sem dependência do Supabase.

## Como ativar

No arquivo `.env`:

```id="mockon"
VITE_USE_MOCK=true
```

## O que é simulado

Quando o modo mock está ativo:

* O histórico de humor é carregado a partir de dados locais
* O registro de humor é simulado
* A regra de 1 registro por dia é mantida
* A ordenação por data continua funcionando
* Não há comunicação com o Supabase

## Quando usar

* Testes locais sem backend
* Validação de fluxo pelo QA
* Demonstrações do sistema
* Desenvolvimento offline

## Como desativar

```id="mockoff"
VITE_USE_MOCK=false
```

ou remover a variável do `.env`.

## Importante

Em ambiente de produção, o modo mock deve estar desativado.

---

# Roadmap

Próximas funcionalidades planejadas:

* Integração completa com layout oficial do UX
* Biblioteca de exercícios de bem-estar
* Melhorias visuais no dashboard de humor
* Autenticação de usuários
* Evolução para PWA

---

# Autores

Jair Sousa
https://github.com/jair-sousa

Carlos Eduardo
https://github.com/Carlosedukj
