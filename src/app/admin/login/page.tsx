"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const locked = Boolean(state.lockedSeconds && state.lockedSeconds > 0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-white p-8"
      >
        <h1 className="font-display text-2xl font-medium text-dark-text">Admin Login</h1>
        <label className="flex flex-col gap-1.5 text-sm text-brown">
          Password
          <input
            type="password"
            name="password"
            required
            autoFocus
            disabled={locked}
            className="rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel"
          />
        </label>
        {state.error ? (
          <p role="alert" className="text-sm text-error">
            {state.error}
            {locked ? ` Try again in ${state.lockedSeconds}s.` : ""}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending || locked}
          className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream transition-[background-color,filter] duration-200 hover:brightness-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
