import "server-only";
import { prisma } from "./prisma";

export type DirectoryGroup = { name: string; description?: string | null; members: string[] };

const CHAT_GROUP_PREFIX = "AD:";

export async function syncDirectoryGroups(groups: DirectoryGroup[]) {
  let synced = 0;
  for (const directoryGroup of groups) {
    const users = await prisma.user.findMany({ where: { username: { in: directoryGroup.members } }, select: { id: true } });
    if (!users.length) continue;
    const groupName = `${CHAT_GROUP_PREFIX}${directoryGroup.name}`;
    const existing = await prisma.chatGroup.findFirst({ where: { name: groupName } });
    const chatGroup = existing ?? await prisma.chatGroup.create({ data: { name: groupName, description: directoryGroup.description ?? `گروه همگام‌شده از Active Directory: ${directoryGroup.name}`, isPrivate: true, creatorId: users[0].id } });
    const desired = new Set(users.map((u) => u.id));
    await prisma.chatMember.createMany({ data: users.filter((u) => !desired.has(u.id)).map((u) => ({ groupId: chatGroup.id, userId: u.id, role: "MEMBER" })), skipDuplicates: true });
    synced++;
  }
  return { synced };
}
