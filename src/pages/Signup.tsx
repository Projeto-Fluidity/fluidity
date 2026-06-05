import { Link, Navigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useAuth } from "../hooks/useAuth";

import {
  registerSchema,
  type RegisterFormData,
} from "../lib/validation/authSchemas";

/**
 * ============================================================
 * SIGNUP
 * ============================================================
 *
 * Responsável por:
 *
 * - criar contas;
 * - validar formulário;
 * - exibir feedback de erro;
 * - redirecionar após autenticação.
 */
export default function Signup() {
  const {
    register: registerUser,
    user,
    loading,
    error,
  } = useAuth();

  /**
   * ==========================================================
   * FORM
   * ==========================================================
   */
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  /**
   * ==========================================================
   * REDIRECT
   * ==========================================================
   *
   * Usuário já autenticado.
   */
  if (user) {
    return <Navigate to="/" replace />;
  }

  /**
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */
  async function onSubmit(
    data: RegisterFormData
  ) {
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EAF5EC] px-6">
      <div className="w-full max-w-md">
        {/* ====================================================
            LOGO
           ==================================================== */}

        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-700 text-white">
              🌿
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Criar conta
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Comece a acompanhar seu humor hoje
          </p>
        </div>

        {/* ====================================================
            FORMULÁRIO
           ==================================================== */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Input
            label="Nome"
            placeholder="Como você gostaria de ser chamado?"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="********"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="********"
            error={
              errors.confirmPassword?.message
            }
            {...register("confirmPassword")}
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={
              loading || isSubmitting
            }
          >
            {loading || isSubmitting
              ? "Criando conta..."
              : "Criar conta"}
          </Button>
        </form>

        {/* ====================================================
            LOGIN
           ==================================================== */}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já possui uma conta?
          </p>

          <Link
            to="/login"
            className="font-semibold text-green-700"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
