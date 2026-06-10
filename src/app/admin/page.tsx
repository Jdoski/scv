import type { Metadata } from "next";
import { isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getSupabase,
  FREE_AGENT_COLUMNS,
  type FreeAgentPost,
  type Tournament,
} from "@/lib/supabase";
import { formatPlayDate } from "@/lib/dates";
import { divisionsForDate } from "@/lib/site";
import AdminLoginForm from "./AdminLoginForm";
import TournamentForm from "./TournamentForm";
import { deletePost, deleteTournament, logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function getAdminData(): Promise<{
  posts: FreeAgentPost[];
  tournaments: Tournament[];
} | null> {
  // Reads work with either client; prefer service role if present.
  const supabase = getSupabaseAdmin() ?? getSupabase();
  if (!supabase) return null;

  const [postsRes, tournamentsRes] = await Promise.all([
    supabase
      .from("free_agents")
      .select(FREE_AGENT_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("tournaments").select("*").order("play_date", { ascending: true }),
  ]);

  return {
    posts: (postsRes.data as FreeAgentPost[]) ?? [],
    tournaments: (tournamentsRes.data as Tournament[]) ?? [],
  };
}

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          SCV Admin
        </h1>
        <AdminLoginForm />
      </div>
    );
  }

  const data = await getAdminData();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          SCV Admin
        </h1>
        <form action={logout}>
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
            Sign Out
          </button>
        </form>
      </div>

      {data === null ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          Supabase isn&apos;t configured yet — add the env vars from .env.example,
          then tournaments and posts will show up here.
        </div>
      ) : (
        <>
          {/* Tournament list */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Tournament list ({data.tournaments.length})
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Free agents can only post for the dates and divisions listed here.
            </p>

            <div className="mt-5">
              <TournamentForm />
            </div>

            {data.tournaments.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                No tournament dates yet — add one above.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {data.tournaments.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-lg font-bold text-slate-900">
                        {formatPlayDate(t.play_date)}
                      </p>
                      <form action={deleteTournament.bind(null, t.id)}>
                        <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                          Delete Date
                        </button>
                      </form>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {divisionsForDate(t.play_date).map((d) => (
                        <span
                          key={d}
                          className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Posts */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-slate-900">
              Free agent posts ({data.posts.length})
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              All posts, newest first — including past dates that no longer show
              on the public board.
            </p>
            {data.posts.length === 0 ? (
              <p className="mt-3 text-slate-600">No posts yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.posts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900">{post.name}</span>
                        {post.divisions?.map((d) => (
                          <span
                            key={d}
                            className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {post.email} · plays {formatPlayDate(post.play_date)}
                      </p>
                    </div>
                    <form action={deletePost.bind(null, post.id)}>
                      <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                        Remove
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
