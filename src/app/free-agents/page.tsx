import type { Metadata } from "next";
import { getSupabase, formatPlayDate, type FreeAgentPost } from "@/lib/supabase";
import FreeAgentForm from "./FreeAgentForm";

export const metadata: Metadata = {
  title: "Free Agent Board",
  description:
    "Looking for a partner or team for an SCV tournament? Post on the free agent board.",
};

// Always fetch fresh posts so new entries show up immediately.
export const dynamic = "force-dynamic";

async function getPosts(): Promise<FreeAgentPost[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Show posts for today and future dates, soonest first.
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("free_agents")
    .select("*")
    .gte("play_date", today)
    .order("play_date", { ascending: true })
    .limit(200);

  if (error) {
    console.error("free_agents fetch failed:", error.message);
    return [];
  }
  return data as FreeAgentPost[];
}

export default async function FreeAgentsPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        Free Agent Board
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Need a partner or a team for an upcoming tournament? Post below with the
        division and date you want to play. Browsing for a teammate? Reach out
        directly to anyone on the board.
      </p>

      <div className="mt-10">
        <FreeAgentForm />
      </div>

      <h2 className="mt-14 text-2xl font-bold text-slate-900">
        Players looking to be picked up
      </h2>

      {posts === null ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          The board isn&apos;t connected to a database yet. Once Supabase is
          configured, posts will appear here.
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No free agents on the board right now. Be the first to post!
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{post.name}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800">
                      {post.division}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    Wants to play: {formatPlayDate(post.play_date)}
                  </p>
                  {post.note && (
                    <p className="mt-2 text-sm text-slate-700">{post.note}</p>
                  )}
                </div>
                <a
                  href={`mailto:${post.email}?subject=${encodeURIComponent(
                    `SCV Free Agent Board — ${post.division}`
                  )}`}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Contact
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
