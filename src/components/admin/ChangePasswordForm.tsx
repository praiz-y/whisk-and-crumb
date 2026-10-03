"use client";

import { useState } from "react";
import { changePassword } from "@/app/admin/(dashboard)/settings/actions";
import { useActionComplete } from "@/lib/admin/use-action-complete";

export function ChangePasswordForm() {
  const [savedMessage, setSavedMessage] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { state, formAction, isPending } = useActionComplete(changePassword, () => {
    setSavedMessage(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  });

  const inputClass =
    "rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel";
  const labelClass = "flex flex-col gap-1.5 text-sm text-brown";

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4 rounded-xl border border-border bg-white p-6">
      <h2 className="font-display text-lg font-medium text-dark-text">Change password</h2>

      <label className={labelClass}>
        Current password
        <input
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        New password
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Confirm new password
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>

      {!state.ok ? (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      ) : null}
      {state.ok && savedMessage ? <p className="text-sm text-success">Password changed.</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
