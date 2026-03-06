import type { MoodRecord } from "../types/moodRecord"

/**
 * Componente responsável por apresentar o histórico
 * de registros de humor armazenados no sistema.
 *
 * A lista é exibida do registro mais recente
 * para o mais antigo.
 */
type MoodHistoryProps = {
  records: MoodRecord[]
}

export default function MoodHistory({ records }: MoodHistoryProps) {

  if (records.length === 0) {
    return <p>Nenhum registro encontrado.</p>
  }

  return (
    <section>
      <h3>Histórico de humor</h3>

      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <strong>{record.mood}</strong> — {new Date(record.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </section>
  )
}
