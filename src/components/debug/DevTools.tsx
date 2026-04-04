/**
 * ============================================================
 * DEV TOOLS (Painel de Debug)
 * ============================================================
 *
 * Permite alterar a fonte de dados da aplicação em tempo real.
 *
 * Funcionalidades:
 *
 * - Alternar fonte de dados (seed / storage / api)
 * - Resetar configuração (remover override)
 *
 * IMPORTANTE:
 * Só aparece em ambiente de desenvolvimento.
 */

export default function DevTools() {
  if (!import.meta.env.DEV) return null;

  const currentMood = localStorage.getItem("debug:moodSource");
  const currentReminder = localStorage.getItem("debug:reminderSource");

  function setMoodSource(value: "seed" | "storage" | "api") {
    localStorage.setItem("debug:moodSource", value);
    window.location.reload();
  }

  function setReminderSource(value: "seed" | "storage") {
    localStorage.setItem("debug:reminderSource", value);
    window.location.reload();
  }

  function clearOverrides() {
    localStorage.removeItem("debug:moodSource");
    localStorage.removeItem("debug:reminderSource");
    window.location.reload();
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-xl text-xs space-y-4 z-50 w-48 shadow-lg">
      <p className="font-bold text-sm">Dev Tools</p>

      {/* MOOD */}
      <div>
        <p className="text-gray-400 mb-1">Mood Source</p>
        <p className="text-[10px] text-gray-500 mb-2">
          atual: {currentMood ?? "env"}
        </p>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setMoodSource("seed")}
            className="px-2 py-1 bg-gray-800 border border-gray-500 rounded hover:bg-gray-700"
          >
            Seed
          </button>

          <button
            onClick={() => setMoodSource("storage")}
            className="px-2 py-1 bg-gray-800 border border-gray-500 rounded hover:bg-gray-700"
          >
            Storage
          </button>

          <button
            onClick={() => setMoodSource("api")}
            className="px-2 py-1 bg-gray-800 border border-gray-500 rounded hover:bg-gray-700"
          >
            API
          </button>
        </div>
      </div>

      {/* REMINDER */}
      <div>
        <p className="text-gray-400 mb-1">Reminder Source</p>
        <p className="text-[10px] text-gray-500 mb-2">
          atual: {currentReminder ?? "env"}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setReminderSource("seed")}
            className="px-2 py-1 bg-gray-800 border border-gray-500 rounded hover:bg-gray-700"
          >
            Seed
          </button>

          <button
            onClick={() => setReminderSource("storage")}
            className="px-2 py-1 bg-gray-800 border border-gray-500 rounded hover:bg-gray-700"
          >
            Storage
          </button>
        </div>
      </div>

      {/* CLEAR CONFIG */}
      <button
        onClick={clearOverrides}
        className="text-red-400 hover:text-red-300 text-xs"
      >
        Reset Config
      </button>
    </div>
  );
}
