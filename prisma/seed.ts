import { PrismaClient, RoleName } from "@prisma/client";

const prisma = new PrismaClient();

const permissions = [
  ["dashboard.view", "مشاهده داشبورد"],
  ["users.view", "مشاهده کارکنان"],
  ["users.manage", "مدیریت کارکنان"],
  ["departments.view", "مشاهده واحدها"],
  ["departments.manage", "مدیریت واحدها"],
  ["assets.view", "مشاهده منابع و تجهیزات"],
  ["assets.manage", "مدیریت منابع و تجهیزات"],
  ["calibration.view", "مشاهده کالیبراسیون"],
  ["calibration.manage", "مدیریت کالیبراسیون"],
  ["reports.view", "مشاهده گزارش‌ها"],
  ["reports.create", "ایجاد گزارش کار"],
  ["reports.manage", "مدیریت گزارش‌های کار"],
  ["chat.view", "دسترسی به چت"],
  ["chat.manage", "مدیریت چت"],
  ["audit.view", "مشاهده رویدادهای امنیتی"],
  ["settings.manage", "مدیریت تنظیمات"],
] as const;

const roles: Record<RoleName, string> = {
  SUPER_ADMIN: "مدیر ارشد سامانه",
  ADMIN: "مدیر سامانه",
  IT: "واحد فناوری اطلاعات",
  CALIBRATION_MANAGER: "مدیر کالیبراسیون",
  CALIBRATION_TECHNICIAN: "کارشناس کالیبراسیون",
  HR: "منابع انسانی",
  EMPLOYEE: "کارمند",
  VIEWER: "فقط مشاهده",
};

async function main() {
  const permissionRecords = new Map<string, string>();
  for (const [key, description] of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: { description },
      create: { key, description },
    });
    permissionRecords.set(key, permission.id);
  }

  const allPermissionIds = [...permissionRecords.values()];
  for (const [name, description] of Object.entries(roles) as [RoleName, string][]) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description },
      create: { name, description },
    });

    if (name === "SUPER_ADMIN") {
      for (const permissionId of allPermissionIds) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId } },
          update: {},
          create: { roleId: role.id, permissionId },
        });
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
