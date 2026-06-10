"use client";

import { Fragment, useState } from "react";
import { formatPlayDate } from "@/lib/dates";
import type { FreeAgentPost } from "@/lib/supabase";
import { removeOwnPost } from "./actions";

const selectClasses =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40";

function ContactButton({ post }: { post: FreeAgentPost }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
      >
        Contact
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${post.email}?subject=${encodeURIComponent(
          `SCV Free Agent Board — ${post.divisions?.join(", ") ?? ""}`
        )}`}
        className="text-sm font-semibold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-2 hover:text-amber-600"
      >
        {post.email}
      </a>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(post.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Clipboard unavailable (e.g. non-HTTPS) — the email is visible to copy manually.
          }
        }}
        className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function RemovePanel({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove() {
    setBusy(true);
    setError(null);
    const result = await removeOwnPost(postId, passcode);
    if (!result.ok) {
      setError(result.message ?? "Couldn't remove the post.");
      setBusy(false);
    }
    // On success the board refreshes and this row disappears.
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-600">
          Enter the passcode you chose when posting:
        </span>
        <input
          type="text"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Your passcode"
          maxLength={32}
          autoComplete="off"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-300/40"
        />
        <button
          onClick={handleRemove}
          disabled={busy || passcode.trim().length === 0}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          {busy ? "Removing…" : "Remove Post"}
        </button>
        <button
          onClick={onClose}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export default function BoardList({ posts }: { posts: FreeAgentPost[] }) {
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [removeOpenId, setRemoveOpenId] = useState<string | null>(null);

  const divisionOptions = [...new Set(posts.flatMap((p) => p.divisions ?? []))].sort();
  const dateOptions = [...new Set(posts.map((p) => p.play_date))].sort();

  const filtered = posts.filter(
    (p) =>
      (divisionFilter === "all" || p.divisions?.includes(divisionFilter)) &&
      (dateFilter === "all" || p.play_date === dateFilter)
  );

  if (posts.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        No free agents on the board right now. Be the first to post!
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          Division
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className={selectClasses}
          >
            <option value="all">All divisions</option>
            {divisionOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          Date
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={selectClasses}
          >
            <option value="all">All dates</option>
            {dateOptions.map((d) => (
              <option key={d} value={d}>
                {formatPlayDate(d)}
              </option>
            ))}
          </select>
        </label>
        <span className="text-sm text-slate-500">
          {filtered.length} of {posts.length} player{posts.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No players match those filters.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Player</th>
                <th className="px-4 py-3 font-semibold">Divisions</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((post) => (
                <Fragment key={post.id}>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {post.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {post.divisions?.map((d) => (
                          <span
                            key={d}
                            className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-amber-800"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {formatPlayDate(post.play_date)}
                    </td>
                    <td className="px-4 py-3">
                      <ContactButton post={post} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setRemoveOpenId(removeOpenId === post.id ? null : post.id)
                        }
                        title="Posted by you? Remove your listing"
                        className="text-xs font-medium whitespace-nowrap text-slate-400 transition-colors hover:text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  {removeOpenId === post.id && (
                    <tr className="bg-red-50/50">
                      <td colSpan={5} className="px-4 py-3">
                        <RemovePanel
                          postId={post.id}
                          onClose={() => setRemoveOpenId(null)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
