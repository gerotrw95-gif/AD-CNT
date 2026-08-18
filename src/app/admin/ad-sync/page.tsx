"use client";

import { useEffect, useState } from "react";

type Status = { connected: boolean; users: number; activeUsers: number; groups: number; errors: number; lastSync: { action: string; createdAt: string; metadata: unknown } | null };

export default function ADSyncPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [canSync, setCanSync] = useState(false);
  const load = async () => { const r = await fetch("/api/admin/ad-sync/status", { cache: "no-store" }); if (r.ok) setStatus(await r.json()); };
  const checkPermission = async () => { const r = await fetch("/api/admin/ad-sync/permission", { cache: "no-store" }); if (r.ok) setCanSync((await r.json()).allowed === true); };
  useEffect(() => { load(); checkPermission(); }, []);
  const sync = async () => { setBusy(true); setMessage(""); const r = await fetch("/api/admin/ad-sync", { method: "POST" }); const data = await r.json(); setMessage(r.ok ? `همگام‌سازی انجام شد: ${data.result?.users ?? 0} کاربر و ${data.result?.groups ?? 0} گروه.` : data.error || "خطا در همگام‌سازی"); await load(); setBusy(false); };
  const time = status?.lastSync ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date(status.lastSync.createdAt)) : "هنوز اجرا نشده";
  return <main style={{ padding: 32 }} dir="rtl"><div className="eyebrow">زیرساخت و هویت</div><h1>Active Directory Sync</h1><p className="muted">مرکز کنترل اتصال، کاربران، گروه‌ها و خطاهای همگام‌سازی.</p><div className="grid" style={{ marginTop: 20 }}><article className="card"><div className="metric-label">وضعیت اتصال</div><div className="metric-value" style={{ fontSize: 22 }}>{status?.connected ? "● متصل" : status ? "● قطع" : "—"}</div><div className="muted">LDAP / LDAPS</div></article><article className="card"><div className="metric-label">آخرین Sync</div><div className="metric-value" style={{ fontSize: 20 }}>{time}</div><div className="muted">{status?.lastSync?.action === "SYNC" ? "موفق" : status?.lastSync ? "ناموفق" : "—"}</div></article><article className="card"><div className="metric-label">کاربران</div><div className="metric-value">{status?.users?.toLocaleString("fa-IR") ?? "—"}</div><div className="muted">{status?.activeUsers?.toLocaleString("fa-IR") ?? "—"} فعال</div></article><article className="card"><div className="metric-label">گروه‌ها</div><div className="metric-value">{status?.groups?.toLocaleString("fa-IR") ?? "—"}</div><div className="muted">گروه‌های AD همگام‌شده</div></article><article className="card"><div className="metric-label">خطاهای Sync</div><div className="metric-value">{status?.errors?.toLocaleString("fa-IR") ?? "—"}</div><div className="muted">خطاهای ثبت‌شده اخیر</div></article></div><section className="card" style={{ marginTop: 20 }}><h2>کنترل همگام‌سازی</h2><p className="muted">{canSync ? "شما مجوز ad.sync دارید." : "حساب شما مجوز اجرای Sync را ندارد."}</p>{canSync && <button onClick={sync} disabled={busy}>{busy ? "در حال همگام‌سازی..." : "Sync Now"}</button>}{message && <p style={{ marginTop: 16 }}>{message}</p>}</section></main>;
}
