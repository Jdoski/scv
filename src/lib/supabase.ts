import { createClient } from "@supabase/supabase-js";

// Returns null when Supabase env vars aren't configured so the site
// still builds and runs before the database is hooked up.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export type FreeAgentPost = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  division: string;
  play_date: string;
  note: string | null;
};

// Formats a "YYYY-MM-DD" date string without timezone surprises.
export function formatPlayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
