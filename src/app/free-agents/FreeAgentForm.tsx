"use client";

import { useActionState, useState } from "react";
import { formatPlayDate } from "@/lib/dates";
import { divisionsForDate } from "@/lib/site";
import type { Tournament } from "@/lib/supabase";
import { createFreeAgentPost, type FormState } from "./actions";

const initialState: FormState = { status: "idle" };

const inputClasses =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:bg-slate-100 disabled:text-slate-400";

export default function FreeAgentForm({ tournaments }: { tournaments: Tournament[] }) {
  const [state, formAction, pending] = useActionState(createFreeAgentPost, initialState);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);

  // Divisions are determined by the day: Saturdays = Men's + Women's, Sundays = Revco.
  const divisionOptions = selectedDate ? divisionsForDate(selectedDate) : [];

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setSelectedDivisions([]);
  }

  function toggleDivision(division: string) {
    setSelectedDivisions((prev) => {
      if (prev.includes(division)) return prev.filter((d) => d !== division);
      if (prev.length >= 2) return prev;
      return [...prev, division];
    });
  }

  return (
    <form action={formAction}>
      <p className="mt-4 text-sm text-slate-600">
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input type="text" name="name" required maxLength={80} className={inputClasses} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" name="email" required maxLength={120} className={inputClasses} />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Passcode
        <input
          type="text"
          name="passcode"
          required
          minLength={4}
          maxLength={32}
          autoComplete="off"
          className={inputClasses}
        />
        <span className="mt-1 block text-xs font-normal text-slate-500">
          Use this code to delete your post once you&apos;ve found a partner or if
          you no longer want to be listed.
        </span>
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Tournament date
        <select
          name="play_date"
          required
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className={inputClasses}
        >
          <option value="" disabled>
            Choose a tournament date…
          </option>
          {tournaments.map((t) => (
            <option key={t.id} value={t.play_date}>
              {formatPlayDate(t.play_date)}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-slate-700">
          Divisions <span className="font-normal text-slate-500">(pick up to 2)</span>
        </legend>
        {selectedDate === "" ? (
          <p className="mt-2 text-sm text-slate-500">Pick a date first to see its divisions.</p>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {divisionOptions.map((d) => {
              const checked = selectedDivisions.includes(d);
              const maxed = !checked && selectedDivisions.length >= 2;
              return (
                <label
                  key={d}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    checked
                      ? "border-amber-400 bg-amber-50 text-slate-900"
                      : maxed
                        ? "border-slate-200 text-slate-400"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="divisions"
                    value={d}
                    checked={checked}
                    disabled={maxed}
                    onChange={() => toggleDivision(d)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  {d}
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

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
        disabled={pending || selectedDivisions.length === 0}
        className="mt-5 w-full rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Posting…" : "Post to the Board"}
      </button>
    </form>
  );
}
