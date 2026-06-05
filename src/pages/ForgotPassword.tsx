import { useState } from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useAuth } from "../hooks/useAuth";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../lib/validation/authSchemas";
import fluidityLogo from "../assets/logos/fluidity-logo.svg";

/**
 * ============================================================
 * FORGOT PASSWORD
 * ============================================================
 *
 * Responsável por:
 *
 * - validar e-mail;
 * - solicitar recuperação de senha;
 * - exibir feedback ao usuário.
 *
 * Fluxo:
 *
 * Usuário
 *      ↓
 * Formulário
 *      ↓
 * useAuth.resetPassword()
 *      ↓
 * Supabase Auth
 *      ↓
 * E-mail de recuperação
 */
export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(
      resetPasswordSchema
    ),
  });

  /**
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */
  async function onSubmit(
    data: ResetPasswordFormData
  ) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await resetPassword({
        email: data.email,
      });

      setSuccessMessage(
        "Se existir uma conta para este e-mail, você receberá instruções para redefinir sua senha."
      );
    } catch (error) {
      console.error(error);

      setServerError(
        error instanceof Error
          ? error.message
          : "Erro ao solicitar recuperação de senha"
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EAF5EC] px-6">
      <div className="w-full max-w-md">
        {/* ======================================================
            CABEÇALHO
           ====================================================== */}
        <Link
          to="/login"
          className="mb-6 inline-flex items-center text-[#008236]"
        >
          ← Voltar
        </Link>

        <div className="mb-6 flex justify-center">
        <div
          className="
            flex
            h-[88px]
            w-[88px]
            items-center
            justify-center
            rounded-full
            bg-[#008236]
          "
        >
            <img
              src={fluidityLogo}
              alt="Fluidity"
              className="h-34 w-24 scale-150"
            />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Esqueci senha
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Digite seu e-mail para recuperar sua conta.
          </p>
        </div>

        {/* ======================================================
            FORMULÁRIO
           ====================================================== */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Input
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Enviando..."
              : "Enviar recuperação"}
          </Button>
        </form>

        {/* ======================================================
            NAVEGAÇÃO
           ====================================================== */}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-primary"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}

