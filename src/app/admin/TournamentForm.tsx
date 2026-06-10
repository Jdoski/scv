"use client";

import { useActionState } from "react";
import { addTournament, type AdminFormState } from "./actions";

const initialState: AdminFormState = { status: "idle" };

export default function TournamentForm() {
  const [state, formAction, pending] = useActionState(addTournament, initialState);

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <label className="block text-sm font-medium text-slate-700">
          Tournament date
          <input
            type="date"
            name="play_date"
            required
            className="mt-1 block rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? "Adding…" : "+ Add Date"}
        </button>
      </form>
      <p className="mt-2 text-sm text-slate-500">
        Divisions are applied automatically: Saturdays run Men&apos;s + Women&apos;s,
        Sundays run Revco.
      </p>

      {state.status === "error" && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {state.message}
        </p>
      )}
    </div>
  );
}
