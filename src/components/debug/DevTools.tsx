/**
 * ============================================================
 * DEV TOOLS (Painel de Debug)
 * ============================================================
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

  // ✅ Helper de estilo (botão ativo vs inativo)
  function getButtonClass(active: boolean) {
    return `
      px-2 py-1 rounded border text-xs transition
      ${
        active
          ? "bg-green-600 border-green-500 text-white"
          : "bg-gray-800 border-gray-500 text-gray-300 hover:bg-gray-700"
      }
    `;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-xl text-xs space-y-4 z-50 w-52 shadow-lg">
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
            className={getButtonClass(currentMood === "seed")}
          >
            Seed
          </button>

          <button
            onClick={() => setMoodSource("storage")}
            className={getButtonClass(currentMood === "storage")}
          >
            Storage
          </button>

          <button
            onClick={() => setMoodSource("api")}
            className={getButtonClass(currentMood === "api")}
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
            className={getButtonClass(currentReminder === "seed")}
          >
            Seed
          </button>

          <button
            onClick={() => setReminderSource("storage")}
            className={getButtonClass(currentReminder === "storage")}
          >
            Storage
          </button>
        </div>
      </div>

      {/* RESET */}
      <button
        onClick={clearOverrides}
        className="text-red-400 hover:text-red-300 text-xs"
      >
        Reset Config
      </button>
    </div>
  );
}
