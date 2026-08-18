export const permissions = {
  dashboardView: "dashboard.view",
  usersView: "users.view",
  usersManage: "users.manage",
  departmentsView: "departments.view",
  departmentsManage: "departments.manage",
  assetsView: "assets.view",
  assetsManage: "assets.manage",
  calibrationView: "calibration.view",
  calibrationManage: "calibration.manage",
  reportsView: "reports.view",
  reportsCreate: "reports.create",
  reportsManage: "reports.manage",
  chatView: "chat.view",
  chatManage: "chat.manage",
  auditView: "audit.view",
  adSync: "ad.sync",
  settingsManage: "settings.manage",
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];

export const rolePermissions: Record<string, Permission[]> = {
  SUPER_ADMIN: Object.values(permissions),
  ADMIN: Object.values(permissions).filter((p) => p !== permissions.settingsManage),
  IT: [permissions.dashboardView, permissions.usersView, permissions.usersManage, permissions.departmentsView, permissions.assetsView, permissions.assetsManage, permissions.auditView, permissions.adSync],
  CALIBRATION_MANAGER: [permissions.dashboardView, permissions.assetsView, permissions.calibrationView, permissions.calibrationManage, permissions.reportsView, permissions.reportsCreate, permissions.reportsManage, permissions.chatView],
  CALIBRATION_TECHNICIAN: [permissions.dashboardView, permissions.assetsView, permissions.calibrationView, permissions.reportsView, permissions.reportsCreate, permissions.chatView],
  HR: [permissions.dashboardView, permissions.usersView, permissions.departmentsView, permissions.reportsView, permissions.chatView],
  EMPLOYEE: [permissions.dashboardView, permissions.reportsView, permissions.reportsCreate, permissions.chatView],
  VIEWER: [permissions.dashboardView, permissions.usersView, permissions.departmentsView, permissions.assetsView, permissions.calibrationView, permissions.reportsView],
};

export function hasPermission(userPermissions: string[], required: Permission) {
  return userPermissions.includes(required);
}
