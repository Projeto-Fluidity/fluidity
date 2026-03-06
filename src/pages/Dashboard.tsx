import MoodSelector from "../components/MoodSelector"
import MoodHistory from "../components/MoodHistory"
import { useMood } from "../hooks/useMood.ts"

/**
 * Página principal da aplicação.
 *
 * Responsável por orquestrar os principais componentes
 * relacionados ao registro e visualização de humor.
 */
export default function Dashboard() {

  const { history, loading } = useMood()

  if (loading) {
    return <p>Carregando dados...</p>
  }

  return (
    <main>

      <header>
        <h1>Dashboard</h1>
        <p>Registro diário de humor</p>
      </header>

      <section>
        <MoodSelector />
      </section>

      <section>
        <MoodHistory records={history} />
      </section>

    </main>
  )
}
