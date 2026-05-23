import { supabase } from "./supabaseClient";
import { getDeviceId } from "../lib/deviceId";

/**
 * ============================================================
 * CREATE
 * ============================================================
 */
export async function createReminder(data: {
    
  label: string;
  time: string;
  days: string[];
  active: boolean;
}) {
  const deviceId = getDeviceId();

  const [hour, minute] = data.time.split(":").map(Number);

  const { data: res, error } = await supabase
  
    .from("scheduled_reminders")
    .insert({
      device_id: deviceId,
      type: "custom",
      hour,
      minute,
      label: data.label,
      time: data.time,
      days: data.days,
      active: data.active,
    })
    .select()
    .single();

  if (error) throw error;

  return res;
}

/**
 * ============================================================
 * UPDATE
 * ============================================================
 */
export async function updateReminder(id: string, data: {
  time: string;
  days: string[];
}) {
  const [hour, minute] = data.time.split(":").map(Number);

  const { error } = await supabase
    .from("scheduled_reminders")
    .update({
      hour,
      minute,
      time: data.time,
      days: data.days,
    })
    .eq("id", id);

  if (error) throw error;
}

/**
 * ============================================================
 * DELETE
 * ============================================================
 */
export async function deleteReminder(id: string) {
  const { error } = await supabase
    .from("scheduled_reminders")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * ============================================================
 * TOGGLE
 * ============================================================
 */
export async function toggleReminder(id: string, active: boolean) {
  const { error } = await supabase
    .from("scheduled_reminders")
    .update({ active })
    .eq("id", id);

  if (error) throw error;
}

