import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";

/**
 * Tela exibida quando o humor
 * é registrado com sucesso.
 */
export default function MoodSuccess() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="text-5xl text-green-500">✔</div>

        <h1 className="text-xl font-semibold text-gray-800">
          Humor registrado!
        </h1>

        <p className="text-gray-500">
          Que bom que você registrou seu humor hoje.
        </p>

        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-green-600 px-6 py-3 text-white"
        >
          Ir para Home
        </button>
      </div>
    </AppLayout>
  );
}
