import "server-only";
import { prisma } from "./prisma";

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { displayName: "asc" }, select: { id: true, username: true, displayName: true, email: true, status: true, department: { select: { name: true } }, roles: { select: { role: { select: { name: true } } } } } });
}
