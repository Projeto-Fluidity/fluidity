import type { MoodType } from "../types/mood";
import { getMoodDefinition } from "../lib/moods";

type Props = {
  mood: MoodType | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function MoodConfirmModal({ mood, onConfirm, onCancel }: Props) {
  if (!mood) return null;

  const moodData = getMoodDefinition(mood);

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[3px] flex items-center justify-center z-50">
      
      <div className="w-[330px] rounded-[32px] p-7 text-center bg-[#F9FAFB] border border-green-500 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        
        {/* Ícone */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
            
            <div className="w-16 h-16 rounded-full border-[6px] border-green-700 flex items-center justify-center">
              <span className="text-green-700 text-3xl font-extrabold">✓</span>
            </div>

          </div>
        </div>

        {/* Texto */}
        <h2 className="mt-6 text-lg font-semibold text-gray-800">
          Confirmar seu humor?
        </h2>

        <p className="text-base text-gray-600 mt-1 font-medium">
          {moodData?.label}
        </p>

        {/* Botão confirmar */}
        <button
          onClick={onConfirm}
          className="mt-6 w-full py-3 rounded-full bg-green-700 text-white font-medium flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-green-800 transition"
        >
          <span className="text-lg font-bold">✓</span>
          Sim, confirmar
        </button>

        {/* Botão secundário */}
        <button
          onClick={onCancel}
          className="mt-4 w-full py-3 rounded-full bg-gray-200 text-gray-700 font-medium shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:bg-gray-300 transition"
        >
          Escolher outro
        </button>

      </div>
    </div>
  );
}