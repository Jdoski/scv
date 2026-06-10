"use client";

import { useActionState } from "react";
import { login, type AdminFormState } from "./actions";

const initialState: AdminFormState = { status: "idle" };

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="mx-auto mt-10 max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Admin sign in</h2>
      <label className="mt-4 block text-sm font-medium text-slate-700">
        Password
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
        />
      </label>

      {state.status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
