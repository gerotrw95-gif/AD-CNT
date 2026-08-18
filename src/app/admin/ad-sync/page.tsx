"use client";

import { useEffect, useState } from "react";

type Status = { users: number; activeUsers: number; groups: number; lastSync: { action: string; createdAt: string; metadata: unknown } | null };

export default function ADSyncPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const load = async () => { const r = await fetch("/api/admin/ad-sync/status", { cache: "no-store" }); if (r.ok) setStatus(await r.json()); };
  useEffect(() => { load(); }, []);
  const sync = async () => { const secret = window.prompt("کلید AD Sync را وارد کنید"); if (!secret) return; setBusy(true); setMessage(""); const r = await fetch("/api/admin/ad-sync", { method: "POST", headers: { "x-ad-sync-secret": secret } }); const data = await r.json(); setMessage(r.ok ? `همگام‌سازی انجام شد: ${data.users} کاربر و ${data.groups} گروه.` : data.error || "خطا در همگام‌سازی"); await load(); setBusy(false); };
  return <main style={{ padding: 32 }} dir="rtl"><div className="eyebrow">زیرساخت و هویت</div><h1>همگام‌سازی Active Directory</h1><p className="muted">وضعیت اتصال و همگام‌سازی کاربران و گروه‌های سازمانی.</p><div className="grid" style={{ marginTop: 20 }}><article className="card"><div className="metric-label">کاربران AD</div><div className="metric-value">{status?.users?.toLocaleString("fa-IR") ?? "—"}</div></article><article className="card"><div className="metric-label">کاربران فعال</div><div className="metric-value">{status?.activeUsers?.toLocaleString("fa-IR") ?? "—"}</div></article><article className="card"><div className="metric-label">گروه‌های Sync شده</div><div className="metric-value">{status?.groups?.toLocaleString("fa-IR") ?? "—"}</div></article><article className="card"><div className="metric-label">آخرین Sync</div><div className="metric-value" style={{ fontSize: 20 }}>{status?.lastSync ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date(status.lastSync.createdAt)) : "هنوز اجرا نشده"}</div><div className="muted">{status?.lastSync?.action === "SYNC" ? "موفق" : status?.lastSync ? "ناموفق" : "—"}</div></article></div><section className="card" style={{ marginTop: 20 }}><h2>کنترل همگام‌سازی</h2><p className="muted">قبل از Sync، مطمئن شوید سرور AD-CNT به Domain Controller دسترسی LDAP/LDAPS دارد.</p><button onClick={sync} disabled={busy}>{busy ? "در حال همگام‌سازی..." : "Sync Now"}</button>{message && <p style={{ marginTop: 16 }}>{message}</p>}</section></main>;
}
