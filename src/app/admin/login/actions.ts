"use server";

import { redirect } from "next/navigation";
import { getSession, isLockedOut, lockoutRemainingSeconds, recordFailedAttempt, resetAttempts } from "@/lib/auth/session";
import { getAdminPasswordHash } from "@/lib/auth/credentials";
import { verifyPasswordHash } from "@/lib/auth/password";

export interface LoginState {
  error?: string;
  lockedSeconds?: number;
}

async function verifyPassword(password: string): Promise<boolean> {
  const stored = await getAdminPasswordHash();
  return verifyPasswordHash(password, stored);
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const session = await getSession();

  if (isLockedOut(session)) {
    return { error: "Too many attempts.", lockedSeconds: lockoutRemainingSeconds(session) };
  }

  const password = String(formData.get("password") ?? "");

  if (!password || !(await verifyPassword(password))) {
    recordFailedAttempt(session);
    await session.save();
    if (isLockedOut(session)) {
      return { error: "Too many attempts.", lockedSeconds: lockoutRemainingSeconds(session) };
    }
    return { error: "Incorrect password." };
  }

  resetAttempts(session);
  session.isLoggedIn = true;
  await session.save();
  redirect("/admin");
}
