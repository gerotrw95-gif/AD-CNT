import "server-only";

import { prisma } from "./prisma";

export async function listEmployees() {
  return prisma.user.findMany({
    orderBy: [{ status: "asc" }, { displayName: "asc" }],
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      status: true,
      department: { select: { id: true, name: true } },
      roles: { select: { role: { select: { name: true, description: true } } } },
    },
  });
}
