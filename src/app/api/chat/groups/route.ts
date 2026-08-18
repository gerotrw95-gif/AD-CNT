import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { name?: string; description?: string; isPrivate?: boolean; memberIds?: string[] };
  const name = body.name?.trim();
  if (!name || name.length > 120) return NextResponse.json({ error: "Invalid group name" }, { status: 400 });
  const memberIds = [...new Set([session.user.id, ...(body.memberIds ?? [])])];
  const group = await prisma.chatGroup.create({ data: { name, description: body.description?.trim().slice(0, 500), isPrivate: body.isPrivate ?? true, creatorId: session.user.id, members: { create: memberIds.map((userId) => ({ userId, role: userId === session.user.id ? "OWNER" : "MEMBER" })) } }, select: { id: true, name: true, description: true, isPrivate: true } });
  return NextResponse.json({ group }, { status: 201 });
}
