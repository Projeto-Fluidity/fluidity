import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import ReminderConfigSummary from "../components/reminders/ReminderConfigSummary";
import ReminderConfigItem from "../components/reminders/ReminderConfigItem";
import ReminderConfigForm, {
  type FrequencyConfig,
} from "../components/reminders/ReminderConfigForm";

/**
 * Limite maximo de lembretes permitidos.
 */
const MAX_REMINDERS = 10;

type ReminderConfigEntry = {
  id: string;
  label: string;
  time: string;
  frequency: FrequencyConfig;
  active: boolean;
};

const ALL_DAYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

const defaultReminders: ReminderConfigEntry[] = [
  { id: "1", label: "Hora de se hidratar", time: "14:30", frequency: { customDays: ALL_DAYS }, active: true },
  { id: "2", label: "Faca uma pausa", time: "15:00", frequency: { customDays: ALL_DAYS }, active: true },
  { id: "3", label: "Como esta seu humor?", time: "16:00", frequency: { customDays: ALL_DAYS }, active: true },
  { id: "4", label: "Hora de relaxar", time: "21:00", frequency: { customDays: ALL_DAYS }, active: true },
];

/**
 * ============================================================
 * Page: ReminderConfig
 * ============================================================
 *
 * Permite ao usuario configurar seus proprios lembretes,
 * definindo nome, horario e dias da semana desejados.
 *
 * Responsabilidades desta pagina:
 * - Orquestrar o estado da lista de lembretes
 * - Delegar renderizacao para componentes especializados
 * - Controlar visibilidade do formulario de adicao
 *
 * As acoes de persistencia serao implementadas futuramente.
 * ============================================================
 */
export default function ReminderConfig() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<ReminderConfigEntry[]>(defaultReminders);
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newFrequency, setNewFrequency] = useState<FrequencyConfig>({ customDays: [] });

  const activeCount = reminders.filter((r) => r.active).length;

  function handleToggle(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  }

  function handleDelete(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSave() {
    const entry: ReminderConfigEntry = {
      id: Date.now().toString(),
      label: newLabel.trim(),
      time: newTime,
      frequency: newFrequency,
      active: true,
    };

    setReminders((prev) => [...prev, entry]);
    setNewLabel("");
    setNewTime("08:00");
    setNewFrequency({ customDays: [] });
    setShowForm(false);
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] p-4">
        <div className="space-y-5">

          {/* Header */}
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
                  frequency={reminder.frequency}
                  active={reminder.active}
                  onToggle={() => handleToggle(reminder.id)}
                  onDelete={() => handleDelete(reminder.id)}
                />
              ))}
            </div>
          </div>

          {/* Formulario */}
          {showForm && (
            <ReminderConfigForm
              label={newLabel}
              time={newTime}
              frequency={newFrequency}
              onLabelChange={setNewLabel}
              onTimeChange={setNewTime}
              onFrequencyChange={setNewFrequency}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Botao adicionar */}
          {!showForm && reminders.length < MAX_REMINDERS && (
            <button
              onClick={() => setShowForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition"
              style={{
                backgroundColor: "#008236",
                boxShadow: "0px 4px 14px rgba(0,0,0,0.10)",
              }}
            >
              <Plus size={18} />
              Adicionar lembrete
            </button>
          )}

          {/* Card de dica */}
          <div
            className="rounded-2xl px-3 py-2 text-center"
            style={{
              backgroundColor: "#F0FDF4",
              border: "1.18px solid #B9F8CF",
            }}
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-bold">Dica:</span> Lembretes regulares ajudam a
              <br />
              criar habitos saudaveis e melhorar seu
              <br />
              bem-estar.
            </p>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}