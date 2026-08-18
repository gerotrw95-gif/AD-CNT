import "server-only";
import { prisma } from "./prisma";

export async function listAssets() {
  return prisma.asset.findMany({
    orderBy: { assetCode: "asc" },
    select: {
      id: true, assetCode: true, name: true, manufacturer: true,
      model: true, serialNumber: true, status: true, location: true,
      nextCalibrationAt: true,
      department: { select: { name: true } },
      custodian: { select: { displayName: true } },
    },
  });
}
