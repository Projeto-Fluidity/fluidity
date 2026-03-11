import AppLayout from "../components/layout/AppLayout";
import MoodSelector from "../components/MoodSelector";
import { useMood } from "../hooks/useMood";

/**
 * Tela principal onde o usuário registra
 * como está se sentindo no dia.
 */
export default function Emotion() {

  const { registerMood } = useMood();

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Olá, Mariana!
          </h1>

          <p className="text-gray-500 mt-1">
            Como você está?
          </p>
        </div>

        {/* Mood Selector */}
        <MoodSelector registerMood={registerMood} />

      </div>
    </AppLayout>
  );
}
