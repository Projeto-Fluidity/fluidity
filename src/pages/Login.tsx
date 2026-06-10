import fluidityLogo from "../assets/logos/fluidity-logo.svg";

import { Link, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useAuth } from "../hooks/useAuth";

import {
  loginSchema,
  type LoginFormData,
} from "../lib/validation/authSchemas";

/**
 * ============================================================
 * LOGIN
 * ============================================================
 *
 * Responsável por:
 *
 * - autenticar usuários;
 * - validar formulário;
 * - exibir feedback de erro;
 * - redirecionar após login.
 */
export default function Login() {
  const {
    login,
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * ==========================================================
   * REDIRECT
   * ==========================================================
   *
   * Caso o usuário já esteja autenticado.
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
    data: LoginFormData
  ) {
    await login({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4]">
      <div
        className="
          mx-auto
          w-full
          max-w-[321px]
          px-5
          pt-10
          pb-8
        "
      >
        {/* ====================================================
            LOGO
           ==================================================== */}

          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-[#008236]
                "
              >
                <img
                  src={fluidityLogo}
                  alt="Fluidity"
                  className="h-24 w-24"
                />
              </div>
            </div>

            <h1 className="text-[30px] font-semibold leading-[36px] text-[#1E293B]">
              Bem-vindo!
            </h1>

            <p className="mt-2 text-sm text-[#64748B]">
              Entre para acompanhar seu humor
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
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="********"
            leftIcon={<Lock size={18} />}
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-green-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={
              isSubmitting || loading
            }
          >
            {isSubmitting || loading
              ? "Entrando..."
              : "Entrar"}
          </Button>
        </form>

        {/* ====================================================
            CADASTRO
           ==================================================== */}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?
          </p>

          <Link
            to="/signup"
            className="font-semibold text-green-700"
          >
            Cadastre-se
          </Link>
        </div>
       </div> {/* fecha max-w-[321px] */}
    </main>
  );
}
