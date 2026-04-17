/**
 * DevTools de desenvolvimento.
 *
 * Permite:
 * - trocar fonte de dados
 * - resetar estado
 * - simular cenários de QA
 */

import { useState, useRef, useEffect } from "react";

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const currentMode = localStorage.getItem("debug:dataMode");
  const currentReminder = localStorage.getItem("debug:reminderSource");

  /**
   * Drag
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

  if (!import.meta.env.DEV) return null;

  function handleMouseDown(e: React.MouseEvent) {
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }

  /**
   * DATA MODE
   */
  function setDataMode(value: "seed" | "storage" | "api") {
    localStorage.setItem("debug:dataMode", value);
    window.location.reload();
  }

  /**
   * REMINDER SOURCE
   */
  function setReminderSource(value: "seed" | "storage") {
    localStorage.setItem("debug:reminderSource", value);
    window.location.reload();
  }

  /**
   *  RESET COMPLETO QA 
   */
  function clearOverrides() {
    // Configurações
    localStorage.removeItem("debug:dataMode");
    localStorage.removeItem("debug:reminderSource");

    // Dados
    localStorage.removeItem("fluidity:mood_mock");

    // Flags QA
    localStorage.removeItem("debug:forceError");

    console.log("[QA] Reset completo aplicado");

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
            {/* DATA MODE */}
            <div>
              <p className="text-gray-400 mb-1">Data Mode</p>
              <p className="text-[10px] text-gray-500 mb-2">
                atual: {currentMode ?? "env"}
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setDataMode("seed")}
                  className={getButtonClass(currentMode === "seed")}
                >
                  Seed
                </button>

                <button
                  onClick={() => setDataMode("storage")}
                  className={getButtonClass(currentMode === "storage")}
                >
                  Storage
                </button>

                <button
                  onClick={() => setDataMode("api")}
                  className={getButtonClass(currentMode === "api")}
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
              Reset QA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
