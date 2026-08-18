import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { permissions, rolePermissions } from "@/lib/rbac";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ allowed: false }, { status: 401 });
  const roles = await prisma.userRole.findMany({ where: { userId: session.user.id }, select: { role: { select: { name: true } } } });
  const allowed = roles.some(({ role }) => rolePermissions[role.name]?.includes(permissions.adSync));
  return NextResponse.json({ allowed });
}
