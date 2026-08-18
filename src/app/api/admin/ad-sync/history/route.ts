import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac-server";
import { permissions } from "@/lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requirePermission(permissions.adSync);
    const runs = await prisma.aDSyncRun.findMany({ orderBy: { createdAt: "desc" }, take: 50, select: { id: true, status: true, users: true, groups: true, addedUsers: true, reactivatedUsers: true, deactivatedUsers: true, syncedGroups: true, errors: true, startedAt: true, finishedAt: true, durationMs: true, createdAt: true, triggeredBy: { select: { displayName: true, username: true } } } });
    return NextResponse.json({ runs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Failed to load sync history" }, { status: 500 });
  }
}
