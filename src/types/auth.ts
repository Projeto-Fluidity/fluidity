/**
 * ============================================================
 * AUTH USER
 * ============================================================
 *
 * Representa o usuário autenticado utilizado
 * pela aplicação.
 *
 * Este tipo abstrai o modelo retornado pelo
 * Supabase Auth, evitando acoplamento direto
 * com a biblioteca.
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

/**
 * ============================================================
 * LOGIN PAYLOAD
 * ============================================================
 *
 * Dados necessários para autenticação.
 */
export type LoginPayload = {
  email: string;
  password: string;
};

/**
 * ============================================================
 * REGISTER PAYLOAD
 * ============================================================
 *
 * Dados necessários para criação de conta.
 */
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

/**
 * ============================================================
 * RESET PASSWORD PAYLOAD
 * ============================================================
 *
 * Dados utilizados para solicitar
 * recuperação de senha.
 */
export type ResetPasswordPayload = {
  email: string;
};

/**
 * ============================================================
 * AUTH STATE
 * ============================================================
 *
 * Estado compartilhado pelo contexto
 * de autenticação.
 */
export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

/**
 * ============================================================
 * AUTH CONTEXT VALUE
 * ============================================================
 *
 * Contrato utilizado pelo AuthProvider
 * e consumido através do hook useAuth.
 */
export type AuthContextValue = AuthState & {
  login: (
    payload: LoginPayload
  ) => Promise<void>;

  register: (
    payload: RegisterPayload
  ) => Promise<void>;

  logout: () => Promise<void>;

  resetPassword: (
    payload: ResetPasswordPayload
  ) => Promise<void>;

  refreshUser: () => Promise<void>;
};
