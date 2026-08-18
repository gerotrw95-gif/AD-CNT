import "server-only";

import { getSession } from "./server";
import type { Permission } from "../rbac";

export async function hasPermission(required: Permission) {
  const session = await getSession();
  return Boolean(session?.user.permissions.includes(required));
}

export async function requirePermission(required: Permission) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  if (!session.user.permissions.includes(required)) throw new Error("FORBIDDEN");
  return session;
}
