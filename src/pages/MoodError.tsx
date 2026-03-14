import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";

/**
 * Tela exibida quando ocorre erro
 * ao registrar o humor.
 */
export default function MoodError() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="text-5xl text-red-500">!</div>

        <h1 className="text-xl font-semibold text-gray-800">
          Ops! Algo deu errado
        </h1>

        <p className="text-gray-500">
          Parece que você já registrou seu humor hoje.
        </p>

        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-red-500 px-6 py-3 text-white"
        >
          Tentar novamente
        </button>
      </div>
    </AppLayout>
  );
}
