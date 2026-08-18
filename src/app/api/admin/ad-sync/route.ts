import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncActiveDirectory } from "@/lib/ad-sync";
import { requirePermission } from "@/lib/rbac-server";
import { permissions } from "@/lib/rbac";

export const runtime = "nodejs";

export async function POST() {
  let session;
  try { session = await requirePermission(permissions.adSync); }
  catch (error) { const message = error instanceof Error ? error.message : "Unknown error"; if(message === "UNAUTHENTICATED") return NextResponse.json({error:"Unauthorized"},{status:401}); if(message === "FORBIDDEN") return NextResponse.json({error:"Forbidden: ad.sync permission required"},{status:403}); return NextResponse.json({error:"Authorization failed"},{status:500}); }

  const run = await prisma.aDSyncRun.create({ data: { status: "RUNNING", triggeredById: session.user.id, startedAt: new Date() } });
  try {
    const result = await syncActiveDirectory();
    await prisma.aDSyncRun.update({ where: { id: run.id }, data: { status: result.errors.length ? "COMPLETED_WITH_ERRORS" : "SUCCESS", users: result.users, groups: result.groups, addedUsers: result.addedUsers, reactivatedUsers: result.reactivatedUsers, deactivatedUsers: result.deactivatedUsers, syncedGroups: result.syncedGroups, errors: result.errors, startedAt: new Date(result.startedAt), finishedAt: new Date(result.finishedAt), durationMs: result.durationMs } });
    await prisma.auditLog.create({ data: { userId: session.user.id, action: "SYNC", entityType: "ActiveDirectory", entityId: run.id, metadata: result } });
    return NextResponse.json({ ok: true, result, runId: run.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await prisma.aDSyncRun.update({ where: { id: run.id }, data: { status: "FAILED", errors: [message], finishedAt: new Date(), durationMs: Date.now() - run.startedAt.getTime() } });
    await prisma.auditLog.create({ data: { userId: session.user.id, action: "SYNC_FAILED", entityType: "ActiveDirectory", entityId: run.id, metadata: { message } } });
    return NextResponse.json({ error: "AD synchronization failed", runId: run.id }, { status: 502 });
  }
}
