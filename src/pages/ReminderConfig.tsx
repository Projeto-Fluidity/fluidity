import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";

import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderEditModal from "../components/reminders/ReminderEditModal";

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
      <ReminderEditModal
        open={!!editingId}
        title={modalTitle}
        time={editTime}
        days={editDays}
        weekDays={WEEK_DAYS}
        onTimeChange={setEditTime}
        onDayToggle={handleDayToggle}
        onSave={handleSave}
        onClose={handleClose}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h1 className="text-xl font-bold">Configurar Lembretes</h1>
      </div>

      <ReminderConfigSummary
        title={`${activeCount} ${
          activeCount === 1
            ? "lembrete ativo"
            : "lembretes ativos"
        }`}
        description="Você pode adicionar até 10 lembretes por dia."
      />

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
