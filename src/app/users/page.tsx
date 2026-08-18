import { listUsers } from "@/lib/users";

const status: Record<string, string> = { ACTIVE: "فعال", INACTIVE: "غیرفعال", SUSPENDED: "معلق" };
const role: Record<string, string> = { SUPER_ADMIN: "مدیر ارشد", ADMIN: "مدیر", IT: "IT", CALIBRATION_MANAGER: "مدیر کالیبراسیون", CALIBRATION_TECHNICIAN: "کارشناس کالیبراسیون", HR: "منابع انسانی", EMPLOYEE: "کارمند", VIEWER: "مشاهده‌گر" };

export default async function UsersPage() {
  const users = await listUsers();
  return <main style={{ padding: 32 }} dir="rtl"><div className="eyebrow">مدیریت دسترسی</div><h1>کاربران سازمان</h1><p className="muted">کاربران، واحد سازمانی، وضعیت حساب و نقش‌های سامانه.</p><div className="card" style={{ marginTop: 20, overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{["نام", "نام کاربری", "ایمیل", "واحد", "وضعیت", "نقش‌ها"].map((h) => <th key={h} style={{ textAlign: "right", padding: 12 }}>{h}</th>)}</tr></thead><tbody>{users.map((u) => <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}><td style={{ padding: 12, fontWeight: 700 }}>{u.displayName}</td><td style={{ padding: 12 }} dir="ltr">{u.username}</td><td style={{ padding: 12 }} dir="ltr">{u.email || "—"}</td><td style={{ padding: 12 }}>{u.department?.name || "—"}</td><td style={{ padding: 12 }}><span className="badge">{status[u.status] || u.status}</span></td><td style={{ padding: 12 }}>{u.roles.length ? u.roles.map((r) => role[r.role.name] || r.role.name).join("، ") : "بدون نقش"}</td></tr>)}</tbody></table>{users.length === 0 && <p className="muted">کاربری ثبت نشده است.</p>}</div></main>;
}
