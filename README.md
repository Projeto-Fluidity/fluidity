# Fluidity

Fluidity é uma aplicação web focada em bem-estar emocional.
O objetivo do projeto é permitir que usuários registrem seu humor diário, acompanhem seu histórico emocional e recebam lembretes para manter o hábito de autoavaliação.

Este projeto está sendo desenvolvido como um **MVP (Minimum Viable Product)** utilizando React, TypeScript e uma arquitetura moderna de frontend.

---

# Funcionalidade atual (MVP)

Atualmente o sistema já permite:

* Registro diário de humor
* Seleção de humor através de emojis
* Persistência local utilizando **localStorage**
* Regra que impede múltiplos registros no mesmo dia
* Feedback visual ao usuário

---

# Tecnologias utilizadas

* React
* TypeScript
* Vite
* Node.js
* Git
* GitHub

Tecnologias planejadas para as próximas versões:

* Supabase (backend e banco de dados)
* PWA (Progressive Web App)
* Notificações Push
* Inteligência Artificial para geração de insights emocionais

---

# Estrutura do projeto

```
src
├── components
│   ├── MoodButton.tsx
│   └── MoodSelector.tsx
│
├── pages
│   └── Dashboard.tsx
│
├── services
│   └── moodService.ts
│
├── lib
│   └── moods.ts
│
├── types
│   └── mood.ts
│
├── App.tsx
└── main.tsx
```

---

# Como rodar o projeto

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

A aplicação estará disponível em:

```
http://localhost:5173
```

---

# Roadmap do projeto

Próximas funcionalidades planejadas:

* Integração com Supabase
* Autenticação de usuários
* Histórico de humor
* Lembretes inteligentes
* Biblioteca de exercícios de bem-estar
* Transformação da aplicação em PWA

---

# Autores

Jair Sousa
Carlos
