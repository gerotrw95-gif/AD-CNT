import "server-only";
import { prisma } from "./prisma";

export async function listChatGroups(userId: string) {
  return prisma.chatGroup.findMany({
    where: { members: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, description: true, isPrivate: true, updatedAt: true, _count: { select: { members: true, messages: true } } },
  });
}

export async function listMessages(groupId: string, userId: string) {
  const member = await prisma.chatMember.findUnique({ where: { groupId_userId: { groupId, userId } } });
  if (!member) throw new Error("FORBIDDEN");
  return prisma.chatMessage.findMany({
    where: { groupId }, orderBy: { createdAt: "asc" }, take: 100,
    select: { id: true, body: true, createdAt: true, editedAt: true, sender: { select: { id: true, displayName: true, username: true } } },
  });
}
