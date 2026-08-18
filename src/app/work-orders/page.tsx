import { listWorkOrders } from "@/lib/work-orders";
import { requirePermission } from "@/lib/auth/authorization";
import { permissions } from "@/lib/rbac";

const status: Record<string,string> = { OPEN:"باز", IN_PROGRESS:"در حال انجام", WAITING_APPROVAL:"در انتظار تأیید", COMPLETED:"تکمیل‌شده", CANCELLED:"لغوشده" };
const priority: Record<string,string> = { LOW:"کم", NORMAL:"عادی", HIGH:"زیاد", URGENT:"فوری" };

export default async function WorkOrdersPage() {
  await requirePermission(permissions.reportsView);
  const orders = await listWorkOrders();
  return <main style={{padding:32}}>
    <div className="eyebrow">عملیات</div><h1>درخواست‌ها و کارها</h1>
    <p className="muted">مرکز پیگیری کارهای سازمان، تخصیص مسئول و گزارش انجام کار.</p>
    <div className="card" style={{marginTop:20,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["کد","عنوان","اولویت","وضعیت","مسئول","واحد","تجهیز","موعد"].map(h=><th key={h} style={{textAlign:"right",padding:12}}>{h}</th>)}</tr></thead>
        <tbody>{orders.map(o=><tr key={o.id} style={{borderTop:"1px solid var(--border)"}}>
          <td style={{padding:12,fontWeight:700}} dir="ltr">{o.code}</td><td style={{padding:12}}>{o.title}</td><td style={{padding:12}}><span className="badge">{priority[o.priority] ?? o.priority}</span></td><td style={{padding:12}}>{status[o.status] ?? o.status}</td><td style={{padding:12}}>{o.assignee?.displayName ?? "تخصیص نشده"}</td><td style={{padding:12}}>{o.department?.name ?? "—"}</td><td style={{padding:12}}>{o.asset ? `${o.asset.assetCode} - ${o.asset.name}` : "—"}</td><td style={{padding:12}}>{o.dueAt ? new Intl.DateTimeFormat("fa-IR").format(o.dueAt) : "—"}</td>
        </tr>)}</tbody>
      </table>
      {orders.length===0 && <p className="muted">هنوز کاری ثبت نشده است.</p>}
    </div>
  </main>;
}
