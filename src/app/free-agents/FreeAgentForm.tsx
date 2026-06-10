"use client";

import { useActionState } from "react";
import { divisions } from "@/lib/site";
import { createFreeAgentPost, type FormState } from "./actions";

const initialState: FormState = { status: "idle" };

const inputClasses =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40";

export default function FreeAgentForm() {
  const [state, formAction, pending] = useActionState(createFreeAgentPost, initialState);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Post to the board</h2>
      <p className="mt-1 text-sm text-slate-600">
        Your name and email will be visible so players can contact you.
      </p>

      {/* Honeypot field — hidden from real users, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input type="text" name="name" required maxLength={80} className={inputClasses} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" name="email" required maxLength={120} className={inputClasses} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Division
          <select name="division" required defaultValue="" className={inputClasses}>
            <option value="" disabled>
              Choose a division…
            </option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Date you want to play
          <input type="date" name="play_date" required className={inputClasses} />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Note <span className="font-normal text-slate-500">(optional — skill level, position, etc.)</span>
        <textarea name="note" rows={3} maxLength={500} className={inputClasses} />
      </label>

      {state.status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {state.message ?? "Posted!"}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Posting…" : "Post to the Board"}
      </button>
    </form>
  );
}
