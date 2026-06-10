import type { Metadata } from "next";
import {
  getSupabase,
  FREE_AGENT_COLUMNS,
  type FreeAgentPost,
  type Tournament,
} from "@/lib/supabase";
import { todayStr } from "@/lib/dates";
import FreeAgentForm from "./FreeAgentForm";
import BoardList from "./BoardList";

export const metadata: Metadata = {
  title: "Free Agent Board",
  description:
    "Looking for a partner or team for an SCV tournament? Post on the free agent board.",
};

// Always fetch fresh posts so new entries show up immediately.
export const dynamic = "force-dynamic";

async function getBoardData(): Promise<{
  posts: FreeAgentPost[];
  tournaments: Tournament[];
} | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const today = todayStr();
  const [postsRes, tournamentsRes] = await Promise.all([
    supabase
      .from("free_agents")
      .select(FREE_AGENT_COLUMNS)
      .gte("play_date", today)
      .order("play_date", { ascending: true })
      .limit(200),
    supabase
      .from("tournaments")
      .select("*")
      .gte("play_date", today)
      .order("play_date", { ascending: true }),
  ]);

  if (postsRes.error) console.error("free_agents fetch failed:", postsRes.error.message);
  if (tournamentsRes.error) console.error("tournaments fetch failed:", tournamentsRes.error.message);

  return {
    posts: (postsRes.data as FreeAgentPost[]) ?? [],
    tournaments: (tournamentsRes.data as Tournament[]) ?? [],
  };
}

export default async function FreeAgentsPage() {
  const data = await getBoardData();

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

      {/* Post form — collapsed by default so browsers get straight to the list */}
      <div className="mt-8">
        {data === null || data.tournaments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            {data === null
              ? "The board isn't connected to a database yet. Check back soon!"
              : "No upcoming tournament dates have been posted yet — check back soon!"}
          </div>
        ) : (
          <details className="group rounded-xl border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 select-none [&::-webkit-details-marker]:hidden">
              <span className="text-lg font-bold text-slate-900">
                Post to the board
                <span className="ml-2 text-sm font-normal text-slate-500">
                  — looking for a partner or team?
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="border-t border-slate-200 px-6 pb-6">
              <FreeAgentForm tournaments={data.tournaments} />
            </div>
          </details>
        )}
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-900">
        Players looking to be picked up
      </h2>

      {data === null ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          The board isn&apos;t connected to a database yet. Once Supabase is
          configured, posts will appear here.
        </div>
      ) : (
        <BoardList posts={data.posts} />
      )}
    </div>
  );
}
