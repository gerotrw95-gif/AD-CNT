import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [users, activeUsers, groups, lastSync] = await Promise.all([
    prisma.user.count({ where: { source: "ACTIVE_DIRECTORY" } }),
    prisma.user.count({ where: { source: "ACTIVE_DIRECTORY", status: "ACTIVE" } }),
    prisma.chatGroup.count({ where: { name: { startsWith: "AD:" } } }),
    prisma.auditLog.findFirst({ where: { action: { in: ["SYNC", "SYNC_FAILED"] }, entityType: "ActiveDirectory" }, orderBy: { createdAt: "desc" }, select: { action: true, createdAt: true, metadata: true } }),
  ]);
  return NextResponse.json({ users, activeUsers, groups, lastSync });
}
