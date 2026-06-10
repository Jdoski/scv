"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { divisions, type Division } from "@/lib/site";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createFreeAgentPost(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot: hidden field real users never fill in — silently drop bots.
  if (formData.get("website")) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const division = String(formData.get("division") ?? "").trim();
  const playDate = String(formData.get("play_date") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name || name.length > 80) {
    return { status: "error", message: "Please enter your name (80 characters max)." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (!divisions.includes(division as Division)) {
    return { status: "error", message: "Please choose a division." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(playDate)) {
    return { status: "error", message: "Please pick the date you want to play." };
  }
  if (note.length > 500) {
    return { status: "error", message: "Note is too long (500 characters max)." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      status: "error",
      message: "The board isn't connected to a database yet. Check back soon!",
    };
  }

  const { error } = await supabase.from("free_agents").insert({
    name,
    email,
    division,
    play_date: playDate,
    note: note || null,
  });

  if (error) {
    console.error("free_agents insert failed:", error.message);
    return {
      status: "error",
      message: "Something went wrong saving your post. Please try again.",
    };
  }

  revalidatePath("/free-agents");
  return {
    status: "success",
    message: "You're on the board! Players can now see your post and reach out.",
  };
}
