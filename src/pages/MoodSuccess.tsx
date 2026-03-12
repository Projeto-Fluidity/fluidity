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
      <div className="flex flex-col items-center justify-center text-center space-y-6">

        <div className="text-green-500 text-5xl">
          ✔
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          Humor registrado!
        </h1>

        <p className="text-gray-500">
          Que bom que você registrou seu humor hoje.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Ir para Home
        </button>

      </div>
    </AppLayout>
  );
}
