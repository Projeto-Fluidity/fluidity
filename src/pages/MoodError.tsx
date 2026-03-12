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
      <div className="flex flex-col items-center justify-center text-center space-y-6">

        <div className="text-red-500 text-5xl">
          !
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          Ops! Algo deu errado
        </h1>

        <p className="text-gray-500">
          Parece que você já registrou seu humor hoje.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Tentar novamente
        </button>

      </div>
    </AppLayout>
  );
}
