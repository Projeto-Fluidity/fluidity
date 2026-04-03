import { useState } from "react";

/**
 * Dias da semana disponiveis para selecao.
 */
const WEEK_DAYS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sab" },
  { id: "dom", label: "Dom" },
];

/**
 * Estrutura de frequencia de um lembrete.
 * Representa os dias da semana selecionados pelo usuario.
 */
export type FrequencyConfig = {
  customDays: string[];
};

/**
 * Props do formulario de criacao de lembrete.
 */
type ReminderConfigFormProps = {
  label: string;
  time: string;
  frequency: FrequencyConfig;
  onLabelChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onFrequencyChange: (value: FrequencyConfig) => void;
  onSave: () => void;
  onCancel: () => void;
};

/**
 * Formulario para criacao de um novo lembrete.
 *
 * Permite ao usuario definir o nome, horario e os dias
 * da semana em que o lembrete deve ser ativado.
 *
 * Validacoes:
 * - Nome e obrigatorio para salvar
 * - Ao menos um dia da semana deve ser selecionado
 */
export default function ReminderConfigForm({
  label,
  time,
  frequency,
  onLabelChange,
  onTimeChange,
  onFrequencyChange,
  onSave,
  onCancel,
}: ReminderConfigFormProps) {
  const [labelError, setLabelError] = useState("");
  const [daysError, setDaysError] = useState("");

  /**
   * Alterna a selecao de um dia individual.
   */
  function handleDayToggle(dayId: string) {
    setDaysError("");
    const already = frequency.customDays.includes(dayId);
    const updated = already
      ? frequency.customDays.filter((d) => d !== dayId)
      : [...frequency.customDays, dayId];
    onFrequencyChange({ customDays: updated });
  }

  /**
   * Valida os campos antes de chamar o callback de salvar.
   */
  function handleSave() {
    let valid = true;

    if (!label.trim()) {
      setLabelError("O nome do lembrete e obrigatório.");
      valid = false;
    } else {
      setLabelError("");
    }

    if (frequency.customDays.length === 0) {
      setDaysError("Selecione ao menos um dia da semana.");
      valid = false;
    } else {
      setDaysError("");
    }

    if (!valid) return;
    onSave();
  }

  return (
    <div
      className="rounded-2xl bg-white px-4 py-4 space-y-3"
      style={{
        border: "1.18px solid #B9F8CF",
        boxShadow: "0px 4px 14px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <p className="text-sm font-semibold text-gray-700">Novo lembrete</p>

      {/* Campo: nome */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Nome</label>
        <input
          type="text"
          placeholder="Ex: Beber água"
          value={label}
          onChange={(e) => {
            onLabelChange(e.target.value);
            if (e.target.value.trim()) setLabelError("");
          }}
          className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 focus:outline-none transition ${
            labelError
              ? "border-red-400 focus:border-red-400"
              : "border-gray-200 focus:border-green-400"
          }`}
        />
        {labelError && (
          <p className="text-xs text-red-500">{labelError}</p>
        )}
      </div>

      {/* Campo: horario */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Horário</label>
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-green-400 focus:outline-none"
        />
      </div>

      {/* Campo: dias da semana */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500">Dias da semana</label>
        <div className="flex gap-1 flex-wrap">
          {WEEK_DAYS.map((day) => {
            const selected = frequency.customDays.includes(day.id);
            return (
              <button
                key={day.id}
                onClick={() => handleDayToggle(day.id)}
                className="h-9 w-9 rounded-full text-xs font-semibold transition"
                style={{
                  backgroundColor: selected ? "#008236" : "#F0FDF4",
                  color: selected ? "#fff" : "#374151",
                  border: `1px solid ${selected ? "#008236" : "#B9F8CF"}`,
                }}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        {daysError && (
          <p className="text-xs text-red-500">{daysError}</p>
        )}
      </div>

      {/* Acoes do formulario */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex-1 rounded-xl py-2 text-sm font-semibold text-white transition"
          style={{ backgroundColor: "#008236" }}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}