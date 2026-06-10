import { createClient } from "@supabase/supabase-js";

// Service-role client for admin operations (delete posts, manage tournaments).
// The service role key bypasses row level security — it must only ever be
// used server-side and never exposed with a NEXT_PUBLIC_ prefix.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
