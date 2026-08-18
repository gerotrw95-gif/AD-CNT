import "server-only";

import { prisma } from "./prisma";

export type DirectoryUser = {
  username: string;
  displayName: string;
  email?: string | null;
  enabled: boolean;
  department?: string | null;
};

/**
 * Upserts directory identities into the application database.
 * This function deliberately does not write to Active Directory.
 */
export async function syncDirectoryUsers(users: DirectoryUser[]) {
  let synced = 0;

  for (const directoryUser of users) {
    const department = directoryUser.department
      ? await prisma.department.upsert({
          where: { name: directoryUser.department },
          update: {},
          create: { name: directoryUser.department },
        })
      : null;

    await prisma.user.upsert({
      where: { username: directoryUser.username },
      update: {
        displayName: directoryUser.displayName,
        email: directoryUser.email ?? null,
        status: directoryUser.enabled ? "ACTIVE" : "INACTIVE",
        departmentId: department?.id ?? null,
      },
      create: {
        username: directoryUser.username,
        displayName: directoryUser.displayName,
        email: directoryUser.email ?? null,
        status: directoryUser.enabled ? "ACTIVE" : "INACTIVE",
        departmentId: department?.id ?? null,
      },
    });

    synced += 1;
  }

  return { synced };
}
