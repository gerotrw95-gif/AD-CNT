import "server-only";
import { prisma } from "./prisma";

export async function getDashboardMetrics() {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const [activeUsers, assets, overdueCalibrations, upcomingCalibrations, openWorkOrders, urgentWorkOrders, groups] = await Promise.all([
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.asset.count({ where: { status: { not: "RETIRED" } } }),
    prisma.asset.count({ where: { status: { not: "RETIRED" }, nextCalibrationAt: { lt: now } } }),
    prisma.asset.count({ where: { status: { not: "RETIRED" }, nextCalibrationAt: { gte: now, lte: in30Days } } }),
    prisma.workOrder.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_APPROVAL"] } } }),
    prisma.workOrder.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_APPROVAL"] }, priority: "URGENT" } }),
    prisma.chatGroup.count(),
  ]);
  return { activeUsers, assets, overdueCalibrations, upcomingCalibrations, openWorkOrders, urgentWorkOrders, groups };
}
