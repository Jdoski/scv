// Server-only helpers for the admin session.
// The admin password lives in the ADMIN_PASSWORD env var; the session cookie
// stores an HMAC derived from it, so changing the password logs everyone out.
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "scv_admin";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("scv-admin-session-v1").digest("hex");
}

export function verifyPassword(password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw && safeEqual(password, pw));
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const expected = sessionToken();
  return Boolean(token && expected && safeEqual(token, expected));
}
