import { createClient } from "@supabase/supabase-js";

// Returns null when Supabase env vars aren't configured so the site
// still builds and runs before the database is hooked up.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Public column list for free_agents — deliberately excludes delete_token,
// which the database also blocks from public reads.
export const FREE_AGENT_COLUMNS = "id, created_at, name, email, divisions, play_date";

export type FreeAgentPost = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  divisions: string[];
  play_date: string;
};

export type Tournament = {
  id: string;
  created_at: string;
  play_date: string;
};
