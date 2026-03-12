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

### Gráfico semanal

Apresentação visual dos registros de humor ao longo da semana.

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
* Camada de analytics para o histórico
* Gráfico semanal baseado nos registros
* Gerenciamento de estado com hook customizado
* Arquitetura organizada em camadas

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

```
Node.js 22.13.0
```

Recomenda-se utilizar a mesma versão para evitar incompatibilidades.

---

# Arquitetura do projeto

A aplicação segue uma arquitetura baseada em **separação de responsabilidades em camadas**.

```
src
 ├ components
 │   ├ history
 │   │   ├ LastCheckinCard.tsx
 │   │   ├ MoodHistoryList.tsx
 │   │   └ WeeklyChart.tsx
 │   │
 │   ├ layout
 │   │   └ AppLayout.tsx
 │   │
 │   ├ navigation
 │   │   └ BottomNav.tsx
 │   │
 │   ├ ui
 │   │   └ UnderDevelopment.tsx
 │   │
 │   ├ ExerciseCard.tsx
 │   ├ MoodButton.tsx
 │   ├ MoodHistory.tsx
 │   └ MoodSelector.tsx
 │
 ├ hooks
 │   ├ useMood.ts
 │   └ useMoodAnalytics.ts
 │
 ├ services
 │   ├ moodService.ts
 │   └ supabaseClient.ts
 │
 ├ lib
 │   ├ moodAnalytics.ts
 │   ├ date.ts
 │   └ utils.ts
 │
 ├ types
 │   ├ mood.ts
 │   ├ moodRecord.ts
 │   └ analytics.ts
 │
 ├ pages
 │   ├ Emotion.tsx
 │   ├ History.tsx
 │   ├ MoodSuccess.tsx
 │   ├ MoodError.tsx
 │   ├ Practices.tsx
 │   └ Profile.tsx
 │
 ├ App.tsx
 └ main.tsx
```

---

# Fluxo da aplicação

```
components
     ↓
hooks
     ↓
services
     ↓
Supabase
```

Essa abordagem permite:

* melhor organização do código
* maior facilidade de manutenção
* escalabilidade da aplicação
* separação clara entre interface e regras de negócio

---

# Como executar o projeto

Clone o repositório:

```
git clone https://github.com/pipocaagil-hash/projeto-fluidity.git
```

Entre na pasta do projeto:

```
cd projeto-fluidity
```

Instale as dependências:

```
npm install
```

Execute o projeto:

```
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---

# Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Essas variáveis são necessárias para conectar a aplicação ao banco de dados do Supabase.

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
Carlos Eduardo
