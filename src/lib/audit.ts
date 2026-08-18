import "server-only";
import { prisma } from "./prisma";

export async function listAuditLogs(limit = 200) {
  return prisma.auditLog.findMany({ take: Math.min(Math.max(limit, 1), 500), orderBy: { createdAt: "desc" }, select: { id: true, action: true, entityType: true, entityId: true, metadata: true, ipAddress: true, createdAt: true, user: { select: { displayName: true, username: true } } } });
}
