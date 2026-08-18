import { listAssets } from "@/lib/assets";
import { permissions } from "@/lib/rbac";
import { requirePermission } from "@/lib/auth/authorization";

const statusLabels: Record<string, string> = {
  ACTIVE: "فعال", IN_CALIBRATION: "در کالیبراسیون", OUT_OF_SERVICE: "خارج از سرویس", RETIRED: "بازنشسته",
};

export default async function AssetsPage() {
  await requirePermission(permissions.assetsView);
  const assets = await listAssets();
  return <main style={{ padding: 32 }}>
    <div className="eyebrow">مدیریت منابع</div>
    <h1>تجهیزات و ابزار دقیق</h1>
    <p className="muted">مرکز ثبت تجهیزات، مسئول تجهیز و وضعیت چرخه کالیبراسیون.</p>
    <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{["کد تجهیز", "نام", "سازنده / مدل", "سریال", "واحد", "وضعیت", "کالیبراسیون بعدی"].map((h) => <th key={h} style={{ textAlign: "right", padding: 12 }}>{h}</th>)}</tr></thead>
        <tbody>{assets.map((asset) => <tr key={asset.id} style={{ borderTop: "1px solid var(--border)" }}>
          <td style={{ padding: 12, fontWeight: 700 }}>{asset.assetCode}</td>
          <td style={{ padding: 12 }}>{asset.name}</td>
          <td style={{ padding: 12 }}>{[asset.manufacturer, asset.model].filter(Boolean).join(" / ") || "—"}</td>
          <td style={{ padding: 12 }} dir="ltr">{asset.serialNumber || "—"}</td>
          <td style={{ padding: 12 }}>{asset.department?.name || "—"}</td>
          <td style={{ padding: 12 }}><span className="badge">{statusLabels[asset.status] || asset.status}</span></td>
          <td style={{ padding: 12 }}>{asset.nextCalibrationAt ? new Intl.DateTimeFormat("fa-IR").format(asset.nextCalibrationAt) : "—"}</td>
        </tr>)}</tbody>
      </table>
      {assets.length === 0 && <p className="muted">هنوز تجهیزی ثبت نشده است.</p>}
    </div>
  </main>;
}
