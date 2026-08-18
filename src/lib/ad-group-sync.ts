import "server-only";
import { prisma } from "./prisma";

export type DirectoryGroup = { name: string; description?: string | null; members: string[] };

const CHAT_GROUP_PREFIX = "AD:";

export async function syncDirectoryGroups(groups: DirectoryGroup[]) {
  let synced = 0;
  for (const directoryGroup of groups) {
    const users = await prisma.user.findMany({
      where: { username: { in: directoryGroup.members } },
      select: { id: true },
    });
    if (!users.length) continue;

    const groupName = `${CHAT_GROUP_PREFIX}${directoryGroup.name}`;
    const existing = await prisma.chatGroup.findFirst({ where: { name: groupName } });
    const chatGroup = existing ?? await prisma.chatGroup.create({
      data: {
        name: groupName,
        description: directoryGroup.description ?? `گروه همگام‌شده از Active Directory: ${directoryGroup.name}`,
        isPrivate: true,
        creatorId: users[0].id,
      },
    });

    const current = await prisma.chatMember.findMany({ where: { groupId: chatGroup.id }, select: { userId: true } });
    const currentIds = new Set(current.map((m) => m.userId));
    const desiredIds = new Set(users.map((u) => u.id));

    await prisma.chatMember.createMany({
      data: users.filter((u) => !currentIds.has(u.id)).map((u) => ({ groupId: chatGroup.id, userId: u.id, role: "MEMBER" })),
      skipDuplicates: true,
    });

    const removedIds = current.filter((m) => !desiredIds.has(m.userId)).map((m) => m.userId);
    if (removedIds.length) {
      await prisma.chatMember.deleteMany({ where: { groupId: chatGroup.id, userId: { in: removedIds }, role: "MEMBER" } });
    }

    synced++;
  }
  return { synced };
}
