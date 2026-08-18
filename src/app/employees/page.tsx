import { listEmployees } from "@/lib/employees";
import { permissions } from "@/lib/rbac";
import { requirePermission } from "@/lib/auth/authorization";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "مدیر ارشد",
  ADMIN: "مدیر سامانه",
  IT: "فناوری اطلاعات",
  CALIBRATION_MANAGER: "مدیر کالیبراسیون",
  CALIBRATION_TECHNICIAN: "کارشناس کالیبراسیون",
  HR: "منابع انسانی",
  EMPLOYEE: "کارمند",
  VIEWER: "مشاهده",
};

export default async function EmployeesPage() {
  await requirePermission(permissions.usersView);
  const employees = await listEmployees();

  return (
    <main style={{ padding: 32 }}>
      <div className="eyebrow">منابع انسانی</div>
      <h1>کارکنان سازمان</h1>
      <p className="muted">فهرست کاربران سامانه. در مرحله بعد این فهرست با Active Directory همگام می‌شود.</p>
      <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th style={{ textAlign: "right", padding: 12 }}>نام</th><th style={{ textAlign: "right", padding: 12 }}>نام کاربری</th><th style={{ textAlign: "right", padding: 12 }}>واحد</th><th style={{ textAlign: "right", padding: 12 }}>نقش</th><th style={{ textAlign: "right", padding: 12 }}>وضعیت</th></tr></thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: 12 }}>{employee.displayName}</td>
                <td style={{ padding: 12 }} dir="ltr">{employee.username}</td>
                <td style={{ padding: 12 }}>{employee.department?.name ?? "بدون واحد"}</td>
                <td style={{ padding: 12 }}>{employee.roles.map(({ role }) => roleLabels[role.name] ?? role.name).join("، ") || "بدون نقش"}</td>
                <td style={{ padding: 12 }}><span className="badge">{employee.status === "ACTIVE" ? "فعال" : employee.status === "SUSPENDED" ? "معلق" : "غیرفعال"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <p className="muted">هنوز کاربری در پایگاه داده ثبت نشده است.</p>}
      </div>
    </main>
  );
}
