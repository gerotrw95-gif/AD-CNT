import "server-only";

import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionValue } from "./session";
import type { AuthSession } from "./types";

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return value ? verifySessionValue(value) : null;
}

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}
