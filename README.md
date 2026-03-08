# Fluidity

Aplicação web para registro e acompanhamento do humor diário do usuário.

O objetivo do projeto é permitir que o usuário registre como está se sentindo ao longo do tempo e acompanhe seu histórico emocional.

O **Fluidity** está sendo desenvolvido inicialmente como um **MVP (Minimum Viable Product)** com foco em validar a experiência de registro diário de humor e incentivar práticas simples de bem-estar.

---

# Objetivo do projeto

O Fluidity busca oferecer uma experiência simples e acessível para que usuários possam:

* registrar seu humor diariamente
* acompanhar padrões emocionais ao longo do tempo
* receber lembretes para manter a prática do registro
* acessar exercícios curtos de bem-estar

---

# Funcionalidades do MVP

As funcionalidades planejadas para o MVP incluem:

### Check-in diário de humor

O usuário pode registrar como está se sentindo no dia através de uma seleção de emoções representadas por emojis.

### Histórico de humor

O sistema armazena e apresenta o histórico de registros ordenado do mais recente para o mais antigo.

### Lembretes inteligentes simples

Notificações para incentivar o usuário a realizar o registro diário de humor.

### Biblioteca de exercícios

Coleção de exercícios curtos e simples voltados ao bem-estar emocional.

---

# Funcionalidades já implementadas

Atualmente o projeto já possui:

* Registro de humor diário
* Persistência de dados utilizando Supabase
* Histórico de registros de humor
* Ordenação automática do histórico
* Atualização reativa da interface após registro
* Prevenção de múltiplos registros no mesmo dia
* Gerenciamento de estado com hook customizado
* Arquitetura organizada em camadas

---

# Tecnologias utilizadas

Frontend:

* React
* TypeScript
* Vite

Estilização:

* Tailwind CSS

Backend / Banco de dados:

* Supabase (PostgreSQL + API)

Interface:

* Lucide React (biblioteca de ícones)

Qualidade de código:

* ESLint
* Prettier

---

# Arquitetura do projeto

A aplicação segue separação de responsabilidades em camadas.

```
src
 ├ components
 │   ├ MoodButton.tsx
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
 ├ lib
 │   ├ moods.ts
 │   └ utils.ts
 │
 └ pages
     └ Dashboard.tsx
```

Fluxo da aplicação:

```
components → hooks → services → Supabase
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

* Integração com layout oficial do UX
* Sistema de lembretes inteligentes
* Biblioteca de exercícios de bem-estar
* Visualização gráfica do histórico de humor
* Autenticação de usuários
* Evolução para PWA

---

# Autores

Jair Sousa
Carlos
