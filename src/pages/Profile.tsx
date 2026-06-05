/**

* ============================================================
* Page: Profile
* ============================================================
*
* Descrição:
* Tela responsável por exibir as informações básicas
* do usuário autenticado.
*
* Aqui o usuário pode:
*
* * visualizar seu nome;
* * visualizar seu e-mail;
* * identificar sua conta ativa;
* * encerrar a sessão atual (logout).
*
* ---
* Fluxo principal:
*
* 1. Usuário acessa o perfil
* 2. Dados são obtidos via AuthContext
* 3. Informações são exibidas na interface
* 4. Usuário pode realizar logout
* 5. Sessão é encerrada
* 6. Aplicação retorna para a Home
*
* ---
* Estrutura de responsabilidades:
*
* * UI: este componente
* * Estado global: AuthContext
* * Navegação: react-router
* * Autenticação: useAuth
*
* ---
* Evoluções futuras:
*
* * edição de perfil;
* * alteração de avatar;
* * alteração de senha;
* * exclusão de conta;
* * preferências do usuário.
*
* ============================================================
  */

import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";

import { useAuth } from "../hooks/useAuth";

export default function Profile() {
/**

  * ==========================================================
  * NAVIGATION
  * ==========================================================
  */
  const navigate = useNavigate();

  /**

  * ==========================================================
  * AUTH CONTEXT
  * ==========================================================
  */
  const {
  user,
  logout,
  } = useAuth();

  /**

  * ==========================================================
  * LOGOUT
  * ==========================================================
  *
  * Encerra a sessão atual
  * e retorna para a Home.
  */
  async function handleLogout() {
  try {
  await logout();

  navigate("/");
  } catch (error) {
  console.error(
  "Erro ao realizar logout:",
  error
  );
  }
  }

  return ( <div className="flex flex-1 flex-col bg-[#EAF5EC] p-6"> <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
  {/* ====================================================
  HEADER
  ==================================================== */}


    <h1 className="mb-8 text-2xl font-bold text-gray-900">
      Perfil
    </h1>

    {/* ====================================================
        USER INFO
       ==================================================== */}

    <div className="mb-8 flex flex-col items-center">
      <div
        className="
          mb-4 flex h-24 w-24
          items-center justify-center
          rounded-full bg-white
          text-3xl font-bold
          text-green-700 shadow-sm
        "
      >
        {user?.name
          ?.charAt(0)
          .toUpperCase()}
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        {user?.name}
      </h2>

      <p className="mt-1 text-gray-500">
        {user?.email}
      </p>
    </div>

    {/* ====================================================
        ACTIONS
       ==================================================== */}

    <div className="mt-auto">
      <Button
        fullWidth
        onClick={handleLogout}
      >
        Sair
      </Button>
    </div>
  </div>
</div>

);
}
