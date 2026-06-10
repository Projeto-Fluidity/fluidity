import fluidityLogo from "../assets/logos/fluidity-logo.svg";

import { Link, Navigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PasswordRequirements
  from "../components/auth/PasswordRequirements";

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
          <Link
            to="/login"
            className="
              inline-flex
              items-center
              gap-1
              text-sm
              font-medium
              text-[#008236]
            "
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        <div className="mb-8 mt-8 text-center">
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
            Criar conta
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
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
            leftIcon={<User size={18} />}
            placeholder="Como você gostaria de ser chamado?"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="E-mail"
            leftIcon={<Mail size={18} />}
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordRequirements />

          <Input
            label="Senha"
            type="password"
            leftIcon={<Lock size={18} />}
            placeholder="********"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirmar senha"
            type="password"
            leftIcon={<Lock size={18} />}
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
