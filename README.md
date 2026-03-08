# Fluidity

Aplicação web para registro e acompanhamento do humor diário do usuário.

O objetivo do projeto é permitir que o usuário registre como está se sentindo ao longo do tempo e visualize o histórico de seus registros.

Este projeto está sendo desenvolvido como MVP utilizando React, TypeScript e Supabase.

---

# Funcionalidades

- Registro de humor diário
- Persistência de dados no Supabase
- Histórico de registros de humor
- Ordenação do histórico do mais recente para o mais antigo
- Gerenciamento de estado com hook customizado

---

# Tecnologias utilizadas

- React
- TypeScript
- Vite
- Supabase
- Node.js

---

# Arquitetura do projeto

A aplicação segue separação de responsabilidades em camadas.

```
src
 ├ components
 │   ├ MoodSelector.tsx
 │   └ MoodHistory.tsx
 │
 ├ hooks
 │   └ useMood.ts
 │
 ├ services
 │   ├ moodService.ts
 │   └ supabaseClient.ts
 │
 ├ types
 │   ├ mood.ts
 │   └ moodRecord.ts
 │
 └ pages
     └ Dashboard.tsx
```

Essa estrutura facilita manutenção, escalabilidade e organização do código.

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

Crie um arquivo `.env` na raiz do projeto.

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

# Roadmap

Próximas funcionalidades planejadas:

- Integração com layout do UX
- Visualização gráfica do histórico de humor
- Sistema de lembretes para registro diário
- Autenticação de usuários

---

# Autores

Jair Sousa
Carlos
