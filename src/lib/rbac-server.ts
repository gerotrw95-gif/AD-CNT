import "server-only";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { rolePermissions, type Permission } from "@/lib/rbac";

export async function requirePermission(permission: Permission) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  const roles = await prisma.userRole.findMany({ where: { userId: session.user.id }, select: { role: { select: { name: true } } } });
  const allowed = roles.some(({ role }) => rolePermissions[role.name]?.includes(permission));
  if (!allowed) throw new Error("FORBIDDEN");
  return session;
}
