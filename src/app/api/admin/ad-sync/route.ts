import { NextRequest, NextResponse } from "next/server";
import { syncActiveDirectory } from "@/lib/ad-sync";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.AD_SYNC_SECRET;
  const suppliedSecret = request.headers.get("x-ad-sync-secret");
  if (!configuredSecret || suppliedSecret !== configuredSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await syncActiveDirectory();
    await prisma.auditLog.create({ data: { action: "SYNC", entityType: "ActiveDirectory", metadata: result } });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    await prisma.auditLog.create({ data: { action: "SYNC_FAILED", entityType: "ActiveDirectory", metadata: { message: error instanceof Error ? error.message : "Unknown error" } } });
    return NextResponse.json({ error: "AD synchronization failed" }, { status: 502 });
  }
}
