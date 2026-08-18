import { NextRequest, NextResponse } from "next/server";
import { syncDirectoryUsers, type DirectoryUser } from "@/lib/ad-sync";

export async function POST(request: NextRequest) {
  const expected = process.env.AD_CNT_SYNC_TOKEN;
  const provided = request.headers.get("x-ad-sync-token");

  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { users?: DirectoryUser[] };
  if (!Array.isArray(body.users)) {
    return NextResponse.json({ error: "users must be an array" }, { status: 400 });
  }

  const result = await syncDirectoryUsers(body.users);
  return NextResponse.json({ ok: true, ...result });
}
