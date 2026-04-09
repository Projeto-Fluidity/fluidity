import { useState, useRef, useEffect } from "react";

export default function DevTools() {
  /**
   * ⚠️ IMPORTANTE:
   * Hooks devem SEMPRE vir antes de qualquer return condicional
   */

  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const currentMood = localStorage.getItem("debug:moodSource");
  const currentReminder = localStorage.getItem("debug:reminderSource");

  /**
   * Eventos globais (drag)
   */
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!dragging.current) return;

      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }

    function handleMouseUp() {
      dragging.current = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /**
   * 👉 AGORA SIM pode fazer retorno condicional
   */
  if (!import.meta.env.DEV) return null;

  function handleMouseDown(e: React.MouseEvent) {
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }

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
    <div
      className="fixed z-50 text-white text-xs"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="bg-black rounded-xl shadow-lg w-56">
        {/* HEADER */}
        <div
          onMouseDown={handleMouseDown}
          className="cursor-move bg-gray-900 px-3 py-2 rounded-t-xl flex justify-between items-center"
        >
          <span className="font-bold text-sm">Dev Tools</span>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xs text-gray-400 hover:text-white"
          >
            {isOpen ? "–" : "+"}
          </button>
        </div>

        {/* CONTEÚDO */}
        {isOpen && (
          <div className="p-3 space-y-4">
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

            <button
              onClick={clearOverrides}
              className="text-red-400 hover:text-red-300 text-xs"
            >
              Reset Config
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
