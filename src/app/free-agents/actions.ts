"use server";

import { revalidatePath } from "next/cache";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { containsProfanity } from "@/lib/profanity";
import { todayStr } from "@/lib/dates";
import { divisionsForDate } from "@/lib/site";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Passcodes are stored as "salt:sha256(salt:passcode)" — never plain text.
function hashPasscode(passcode: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${passcode}`).digest("hex");
}

function verifyPasscode(passcode: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = Buffer.from(hashPasscode(passcode, salt));
  const expected = Buffer.from(hash);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export async function createFreeAgentPost(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot: hidden field real users never fill in — silently drop bots.
  if (formData.get("website")) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const passcode = String(formData.get("passcode") ?? "").trim();
  const playDate = String(formData.get("play_date") ?? "").trim();
  const chosenDivisions = [
    ...new Set(
      formData
        .getAll("divisions")
        .map((d) => String(d).trim())
        .filter(Boolean)
    ),
  ];

  if (!name || name.length > 80) {
    return { status: "error", message: "Please enter your name (80 characters max)." };
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (containsProfanity(name) || containsProfanity(email)) {
    return {
      status: "error",
      message: "Please keep it clean — your post wasn't submitted.",
    };
  }
  if (passcode.length < 4 || passcode.length > 32) {
    return { status: "error", message: "Please choose a passcode between 4 and 32 characters." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(playDate)) {
    return { status: "error", message: "Please pick a tournament date." };
  }
  if (chosenDivisions.length < 1 || chosenDivisions.length > 2) {
    return { status: "error", message: "Please select one or two divisions." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      status: "error",
      message: "The board isn't connected to a database yet. Check back soon!",
    };
  }

  // The date must be an upcoming tournament, and every chosen division must
  // be offered on that day (Saturdays = Men's + Women's, Sundays = Revco).
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("play_date")
    .eq("play_date", playDate)
    .gte("play_date", todayStr())
    .maybeSingle();

  if (!tournament) {
    return { status: "error", message: "Please choose one of the listed tournament dates." };
  }
  const offered = divisionsForDate(playDate);
  if (!chosenDivisions.every((d) => offered.includes(d))) {
    return { status: "error", message: "One of those divisions isn't offered on the selected date." };
  }

  const salt = randomBytes(16).toString("hex");
  const { error } = await supabase.from("free_agents").insert({
    name,
    email,
    divisions: chosenDivisions,
    play_date: playDate,
    passcode_hash: `${salt}:${hashPasscode(passcode, salt)}`,
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
    message:
      "You're on the board! Players can now see your post and reach out. Found a partner? Use your passcode to remove your post anytime.",
  };
}

// Lets a poster take down their own entry by entering the passcode they
// chose when posting.
export async function removeOwnPost(
  id: string,
  passcode: string
): Promise<{ ok: boolean; message?: string }> {
  const trimmed = passcode.trim();
  if (!id || !trimmed) return { ok: false, message: "Please enter your passcode." };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, message: "Removal isn't available right now — contact us and we'll take it down." };
  }

  const { data: post } = await supabase
    .from("free_agents")
    .select("passcode_hash")
    .eq("id", id)
    .maybeSingle();

  // Already gone — treat as success.
  if (!post) {
    revalidatePath("/free-agents");
    return { ok: true };
  }
  if (!verifyPasscode(trimmed, post.passcode_hash)) {
    return { ok: false, message: "That passcode doesn't match this post." };
  }

  const { error } = await supabase.from("free_agents").delete().eq("id", id);
  if (error) {
    console.error("own-post delete failed:", error.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  revalidatePath("/free-agents");
  return { ok: true };
}
