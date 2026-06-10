"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin, sessionToken, verifyPassword } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type AdminFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function login(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD) {
    return {
      status: "error",
      message: "ADMIN_PASSWORD isn't set on the server yet — add it to .env.local (or Vercel env vars).",
    };
  }
  if (!verifyPassword(password)) {
    return { status: "error", message: "Incorrect password." };
  }

  (await cookies()).set(ADMIN_COOKIE, sessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  revalidatePath("/admin");
  return { status: "success" };
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

function revalidateBoard() {
  revalidatePath("/admin");
  revalidatePath("/free-agents");
}

export async function addTournament(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  if (!(await isAdmin())) {
    return { status: "error", message: "You're not signed in." };
  }

  const playDate = String(formData.get("play_date") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(playDate)) {
    return { status: "error", message: "Please pick a date." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      status: "error",
      message: "SUPABASE_SERVICE_ROLE_KEY isn't configured — add it to .env.local (or Vercel env vars).",
    };
  }

  const { error } = await supabase
    .from("tournaments")
    .insert({ play_date: playDate });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "That date is already on the list." };
    }
    console.error("tournaments insert failed:", error.message);
    return { status: "error", message: "Something went wrong adding the date." };
  }

  revalidateBoard();
  return { status: "success", message: "Tournament date added." };
}

export async function deleteTournament(id: string) {
  if (!(await isAdmin())) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from("tournaments").delete().eq("id", id);
  if (error) console.error("tournament delete failed:", error.message);
  revalidateBoard();
}

export async function deletePost(id: string) {
  if (!(await isAdmin())) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from("free_agents").delete().eq("id", id);
  if (error) console.error("post delete failed:", error.message);
  revalidateBoard();
}
