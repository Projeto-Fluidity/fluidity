import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Check, Plus } from "lucide-react";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";

const WEEK_DAYS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sab" },
  { id: "dom", label: "Dom" },
];

const ALL_DAYS = WEEK_DAYS.map((d) => d.id);
const MAX_REMINDERS = 10;

type Reminder = {
  id: string;
  label: string;
  time: string;
  customDays: string[];
  active: boolean;
};

/**
 * ============================================================
 * Page: ReminderConfig
 * ============================================================
 *
 * Exibe os lembretes configurados pelo usuario.
 * Permite editar, adicionar (limite 10), excluir e ativar/desativar.
 * Novos lembretes tem nome fixo "Novo lembrete".
 * Exibe popup de confirmacao ao salvar.
 * ============================================================
 */
export default function ReminderConfig() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", label: "Hora de se hidratar", time: "14:30", customDays: ALL_DAYS, active: true },
    { id: "2", label: "Como esta seu humor?", time: "16:00", customDays: ALL_DAYS, active: true },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("08:00");
  const [editDays, setEditDays] = useState<string[]>([]);
  const [showActivated, setShowActivated] = useState(false);

  const activeCount = reminders.filter((r) => r.active).length;
  const isNew = editingId === "new";
  const editingReminder = reminders.find((r) => r.id === editingId);
  const modalTitle = isNew ? "Hora de se hidratar" : (editingReminder?.label ?? "");

  function handleEdit(id: string) {
    const r = reminders.find((r) => r.id === id);
    if (!r) return;
    setEditingId(id);
    setEditTime(r.time);
    setEditDays(r.customDays);
  }

  function handleNew() {
    setEditingId("new");
    setEditTime("08:00");
    setEditDays(ALL_DAYS);
  }

  function handleToggle(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }

  function handleDelete(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function handleDayToggle(dayId: string) {
    setEditDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId]
    );
  }

  function handleSave() {
    if (isNew) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        label: "Hora de se hidratar",
        time: editTime,
        customDays: editDays,
        active: true,
      };
      setReminders((prev) => [...prev, newReminder]);
    } else {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, time: editTime, customDays: editDays }
            : r
        )
      );
    }

    setEditingId(null);
    setShowActivated(true);
  }

  function handleClose() {
    setEditingId(null);
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">

      {/* Modal de edicao / adicao */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-xl space-y-5">

            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <X size={14} />
            </button>

            <p className="text-base font-semibold text-gray-800">{modalTitle}</p>

            {/* Horario */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Horario</label>
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                style={{
                  border: "1.5px solid #008236",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 14,
                  color: "#374151",
                  backgroundColor: "white",
                  outline: "none",
                  display: "block",
                }}
              />
            </div>

            {/* Dias da semana */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Dias da semana</label>
              <div className="flex gap-2 flex-wrap">
                {WEEK_DAYS.map((day) => {
                  const selected = editDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      onClick={() => handleDayToggle(day.id)}
                      className="rounded-full text-xs font-semibold transition px-3 py-2"
                      style={{
                        backgroundColor: selected ? "#008236" : "#F3F4F6",
                        color: selected ? "#fff" : "#374151",
                        border: `1px solid ${selected ? "#008236" : "#E5E7EB"}`,
                      }}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acoes */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl py-2 text-sm font-semibold text-white transition"
                style={{ background: "linear-gradient(to bottom, #00A63E, #008236)" }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup lembrete ativado */}
      {showActivated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowActivated(false)}
          />
          <div className="relative z-10 w-full max-w-xs rounded-3xl bg-white px-6 py-8 shadow-xl text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#05DF72] to-[#00A63E] shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white">
                  <div className="text-white">
                    <Check size={20} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-800">Lembrete ativado</p>
            <button
              onClick={() => setShowActivated(false)}
              className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition"
              style={{ background: "linear-gradient(to bottom, #00A63E, #008236)" }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5">

        {/* Header — navigate(-1) para sempre voltar para a tela anterior */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Configurar Lembretes</h1>
            <p className="text-sm text-gray-500">Personalize seus alertas</p>
          </div>
        </div>

        {/* Resumo */}
        <ReminderConfigSummary activeCount={activeCount} />

        {/* Lista */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Seus lembretes
          </p>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <ReminderConfigItem
                key={reminder.id}
                label={reminder.label}
                time={reminder.time}
                customDays={reminder.customDays}
                active={reminder.active}
                onToggle={() => handleToggle(reminder.id)}
                onEdit={() => handleEdit(reminder.id)}
                onDelete={() => handleDelete(reminder.id)}
              />
            ))}
          </div>
        </div>

        {/* Botao adicionar — oculto ao atingir limite */}
        {reminders.length < MAX_REMINDERS && (
          <button
            onClick={handleNew}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition"
            style={{
              background: "linear-gradient(to bottom, #00A63E, #008236)",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.10)",
            }}
          >
            <Plus size={18} />
            Adicionar lembrete
          </button>
        )}

      </div>
    </div>
  );
}