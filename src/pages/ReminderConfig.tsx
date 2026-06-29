import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Plus } from "lucide-react";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";

import { supabase } from "../services/supabaseClient";
import { getDeviceId } from "../lib/deviceId";

import {
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminder,
} from "../services/reminderConfigService";
import { ensureFixedReminders } from "../services/scheduledReminderService";

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
  type?: string; // importante
};

export default function ReminderConfig() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("08:00");
  const [editDays, setEditDays] = useState<string[]>([]);

  /**
   * ============================================================
   * LOAD REAL DO BANCO
   * ============================================================
   */
    useEffect(() => {
    async function init() {
      await ensureFixedReminders(); // garante dados

      const { data, error } = await supabase
        .from("scheduled_reminders")
        .select("*")
        .eq("device_id", getDeviceId());

      if (error) {
        console.error(error);
        return;
      }

      const mapped = (data ?? []).map((r) => ({
        id: r.id,
        label: r.label ?? "Hora do check-in",
        time:
          r.time ??
          `${String(r.hour).padStart(2, "0")}:${String(r.minute).padStart(2, "0")}`,
        customDays: r.days ?? ALL_DAYS,
        active: r.active ?? r.enabled ?? true,
        type: r.type,
      }));

      setReminders(mapped);
    }

    init();
  }, []);

  const activeCount = reminders.filter((r) => r.active).length;
  const isNew = editingId === "new";
  const editingReminder = reminders.find((r) => r.id === editingId);
  const modalTitle = isNew
    ? "Novo lembrete"
    : editingReminder?.label ?? "";

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

  /**
   * ============================================================
   * TOGGLE (com backend)
   * ============================================================
   */
  async function handleToggle(id: string) {
    const r = reminders.find((r) => r.id === id);
    if (!r) return;

    await toggleReminder(id, !r.active);

    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  }

  /**
   * ============================================================
   * DELETE (com proteção de FIXED)
   * ============================================================
   */
  async function handleDelete(id: string) {
    const r = reminders.find((r) => r.id === id);

    const isFixed =
      r?.type === "fixed_checkin" ||
      r?.type === "fixed_hydration";

    if (isFixed) {
      alert("Esse lembrete padrão não pode ser removido");
      return;
    }

    await deleteReminder(id);

    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function handleDayToggle(dayId: string) {
    setEditDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId]
    );
  }

  /**
   * ============================================================
   * SAVE (create + update)
   * ============================================================
   */
  async function handleSave() {
    if (isNew) {
      const created = await createReminder({
        label: "Hora de se hidratar",
        time: editTime,
        days: editDays,
        active: true,
      });

      setReminders((prev) => [
        ...prev,
        {
          id: created.id,
          label: created.label,
          time: created.time,
          customDays: created.days ?? ALL_DAYS,
          active: created.active ?? true,
          type: created.type,
        },
      ]);
    } else {
      await updateReminder(editingId!, {
        time: editTime,
        days: editDays,
      });

      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, time: editTime, customDays: editDays }
            : r
        )
      );
    }

    setEditingId(null);
  }

  function handleClose() {
    setEditingId(null);
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">

      {/* Modal */}
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

            <input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="border rounded-xl p-2 w-full"
            />

            <div className="flex gap-2 flex-wrap">
              {WEEK_DAYS.map((day) => {
                const selected = editDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    onClick={() => handleDayToggle(day.id)}
                    className={`px-3 py-2 rounded-full text-xs ${
                      selected ? "bg-green-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={handleClose} className="flex-1 border rounded-xl py-2">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 bg-green-600 text-white rounded-xl py-2">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h1 className="text-xl font-bold">Configurar Lembretes</h1>
      </div>

      <ReminderConfigSummary activeCount={activeCount} />

      <div className="space-y-3 mt-4">
        {reminders.map((reminder) => (
          <ReminderConfigItem
            key={reminder.id}
            label={reminder.label}
            time={reminder.time}
            customDays={reminder.customDays}
            active={reminder.active}
            onToggle={() => handleToggle(reminder.id)}
            onEdit={() => handleEdit(reminder.id)}
           onDelete={() => {
            if (
              reminder.type === "fixed_checkin" ||
              reminder.type === "fixed_hydration"
            ) {
              return; // bloqueia
            }

            handleDelete(reminder.id);
          }}
          />
        ))}
      </div>

      {reminders.length < MAX_REMINDERS && (
        <button
          onClick={handleNew}
          className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl flex justify-center gap-2"
        >
          <Plus /> Adicionar lembrete
        </button>
      )}
    </div>
  );
}
