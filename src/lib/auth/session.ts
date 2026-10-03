import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
  failedAttempts: number;
  lockedUntil?: number;
  lastAttemptAt?: number;
}

const defaultSession: SessionData = {
  isLoggedIn: false,
  failedAttempts: 0,
};

export const sessionOptions: SessionOptions = {
  password: requireEnv("SESSION_SECRET"),
  cookieName: "wc-admin-session",
  ttl: 60 * 60 * 24 * 30, // 30 days
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set`);
  if (name === "SESSION_SECRET" && value.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return value;
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (session.isLoggedIn === undefined) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.failedAttempts = defaultSession.failedAttempts;
  }
  return session;
}

// Defense-in-depth: middleware.ts is the primary gate for /admin/*, but it is
// a deprecated Next 16 convention. Every admin Server Action calls this
// explicitly so mutations stay authenticated even if middleware.ts is ever
// dropped or stops being honored.
export async function requireAdmin(): Promise<{ ok: false; error: string } | null> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return { ok: false, error: "Session expired. Please log in again." };
  }
  return null;
}

const LOCKOUT_MS = 60 * 1000;
const ATTEMPT_RESET_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function isLockedOut(session: SessionData): boolean {
  return Boolean(session.lockedUntil && session.lockedUntil > Date.now());
}

export function lockoutRemainingSeconds(session: SessionData): number {
  if (!session.lockedUntil) return 0;
  return Math.max(0, Math.ceil((session.lockedUntil - Date.now()) / 1000));
}

export function recordFailedAttempt(session: SessionData): void {
  const now = Date.now();
  if (session.lastAttemptAt && now - session.lastAttemptAt > ATTEMPT_RESET_MS) {
    session.failedAttempts = 0;
  }
  session.failedAttempts += 1;
  session.lastAttemptAt = now;
  if (session.failedAttempts >= MAX_ATTEMPTS) {
    session.lockedUntil = now + LOCKOUT_MS;
    session.failedAttempts = 0;
  }
}

export function resetAttempts(session: SessionData): void {
  session.failedAttempts = 0;
  session.lockedUntil = undefined;
  session.lastAttemptAt = undefined;
}
