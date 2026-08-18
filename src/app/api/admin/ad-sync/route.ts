import { NextResponse } from "next/server";
import { syncActiveDirectory } from "@/lib/ad-sync";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac-server";
import { permissions } from "@/lib/rbac";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await requirePermission(permissions.adSync);
    const result = await syncActiveDirectory();
    await prisma.auditLog.create({ data: { userId: session.user.id, action: "SYNC", entityType: "ActiveDirectory", metadata: result } });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden: ad.sync permission required" }, { status: 403 });
    await prisma.auditLog.create({ data: { action: "SYNC_FAILED", entityType: "ActiveDirectory", metadata: { message } } });
    return NextResponse.json({ error: "AD synchronization failed" }, { status: 502 });
  }
}
