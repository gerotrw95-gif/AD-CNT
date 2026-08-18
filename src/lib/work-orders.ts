import "server-only";
import { prisma } from "./prisma";

export async function listWorkOrders() {
  return prisma.workOrder.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, code: true, title: true, status: true, priority: true, dueAt: true,
      assignee: { select: { displayName: true } },
      department: { select: { name: true } },
      asset: { select: { assetCode: true, name: true } },
    },
  });
}
