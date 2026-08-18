import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { listMessages } from "@/lib/chat";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const groupId = request.nextUrl.searchParams.get("groupId");
  if (!groupId) return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  try { return NextResponse.json({ messages: await listMessages(groupId, session.user.id) }); }
  catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { groupId?: string; message?: string };
  const message = body.message?.trim();
  if (!body.groupId || !message || message.length > 4000) return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  const member = await prisma.chatMember.findUnique({ where: { groupId_userId: { groupId: body.groupId, userId: session.user.id } } });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const created = await prisma.chatMessage.create({ data: { groupId: body.groupId, senderId: session.user.id, body: message }, select: { id: true, body: true, createdAt: true, sender: { select: { id: true, displayName: true, username: true } } } });
  await prisma.chatGroup.update({ where: { id: body.groupId }, data: { updatedAt: new Date() } });
  return NextResponse.json({ message: created }, { status: 201 });
}
