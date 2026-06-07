import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useAuth } from "../hooks/useAuth";

import {
  updatePasswordSchema,
  type UpdatePasswordFormData,
} from "../lib/validation/authSchemas";

/**
 * ============================================================
 * RESET PASSWORD
 * ============================================================
 *
 * Responsável por:
 *
 * - validar nova senha;
 * - validar confirmação;
 * - atualizar senha no Supabase;
 * - exibir feedback ao usuário;
 * - redirecionar para login após sucesso.
 *
 * Fluxo:
 *
 * Usuário
 *      ↓
 * Nova senha
 *      ↓
 * Confirmar senha
 *      ↓
 * updatePassword()
 *      ↓
 * Supabase Auth
 *      ↓
 * Senha atualizada
 *      ↓
 * Login
 */
export default function ResetPassword() {
  const navigate = useNavigate();

  const { updatePassword, logout } = useAuth();

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [serverError, setServerError] =
    useState<string | null>(null);

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
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(
      updatePasswordSchema
    ),
  });

  /**
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */
    async function onSubmit(
      data: UpdatePasswordFormData
    ) {
      setServerError(null);
      setSuccessMessage(null);

      try {

    await updatePassword(
      data.password
    );

    setSuccessMessage(
      "Sua senha foi atualizada com sucesso. Você será redirecionado para o login."
    );

    setTimeout(async () => {
      await logout();

      navigate("/login");
    }, 5000);

  } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Erro ao atualizar senha";

      if (
        message.includes(
          "Auth session missing"
        )
      ) {
        setServerError(
          "Este link de recuperação expirou. Solicite um novo e-mail para redefinir sua senha."
        );

        return;
      }

      setServerError(message);
    }
  } // fecha onSubmit

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EAF5EC] px-6">
      <div className="w-full max-w-md">
        {/* ====================================================
            CABEÇALHO
           ==================================================== */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Redefinir senha
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Informe sua nova senha para
            continuar utilizando sua conta.
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
            label="Nova senha"
            type="password"
            placeholder="********"
            error={
              errors.password?.message
            }
            {...register("password")}
          />

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="********"
            error={
              errors.confirmPassword
                ?.message
            }
            {...register(
              "confirmPassword"
            )}
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
              ? "Atualizando..."
              : "Atualizar senha"}
          </Button>
        </form>

        {/* ====================================================
            LOGIN
           ==================================================== */}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="font-semibold text-green-700"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </main>
  );
}
