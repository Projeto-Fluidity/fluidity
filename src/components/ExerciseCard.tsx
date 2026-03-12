/**
 * Props do componente ExerciseCard.
 */
type ExerciseCardProps = {
  title: string;
  duration: string;
};

/**
 * Card responsável por exibir um exercício
 * recomendado para o usuário.
 *
 * @param title Nome do exercício
 * @param duration Duração estimada
 */
export default function ExerciseCard({ title, duration }: ExerciseCardProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4 hover:bg-gray-100 transition">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{duration}</p>
      </div>

      <span className="text-gray-400">›</span>
    </div>
  );
}
