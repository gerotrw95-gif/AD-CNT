import { getDashboardMetrics } from "@/lib/dashboard";

export default async function Home() {
  const metrics = await getDashboardMetrics();
  const stats = [
    ["کارکنان فعال", metrics.activeUsers.toLocaleString("fa-IR"), "همگام‌شده با سامانه"],
    ["تجهیزات", metrics.assets.toLocaleString("fa-IR"), "تجهیزات غیر بازنشسته"],
    ["کارهای باز", metrics.openWorkOrders.toLocaleString("fa-IR"), `${metrics.urgentWorkOrders.toLocaleString("fa-IR")} کار فوری`],
    ["سررسید کالیبراسیون", metrics.upcomingCalibrations.toLocaleString("fa-IR"), `${metrics.overdueCalibrations.toLocaleString("fa-IR")} مورد عقب‌افتاده`],
  ];
  const navigation = [["داشبورد", "/"], ["کارکنان", "/employees"], ["واحدها", "/departments"], ["منابع و تجهیزات", "/assets"], ["کالیبراسیون", "/calibration"], ["کارها", "/work-orders"], ["گزارش کار", "/reports"], ["چت سازمانی", "/chat"], ["گزارش‌ها", "/reports"], ["تنظیمات", "/settings"]];
  return <main className="dashboard-shell">
    <aside className="sidebar"><div className="brand">AD<span>-CNT</span></div><nav className="nav" aria-label="ناوبری اصلی">{navigation.map(([item, href], index) => <a className={`nav-item ${index === 0 ? "active" : ""}`} href={href} key={item}>{item}</a>)}</nav></aside>
    <section className="main"><header className="header"><div><div className="eyebrow">سامانه مدیریت سازمان</div><h1>داشبورد مدیریت</h1><div className="muted">مرکز کنترل منابع، نیروی انسانی و عملیات شرکت</div></div><div className="user-pill">مدیر سیستم</div></header>
      <section className="grid">{stats.map(([label, value, hint]) => <article className="card" key={label}><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="muted">{hint}</div></article>)}</section>
      <section className="content-grid"><article className="card"><div className="section-title">وضعیت عملیاتی</div><div className="list"><div className="list-row"><span>کارکنان فعال</span><span className="badge">{metrics.activeUsers.toLocaleString("fa-IR")}</span></div><div className="list-row"><span>تجهیزات</span><span className="badge">{metrics.assets.toLocaleString("fa-IR")}</span></div><div className="list-row"><span>کالیبراسیون عقب‌افتاده</span><span className="badge">{metrics.overdueCalibrations.toLocaleString("fa-IR")}</span></div><div className="list-row"><span>گروه‌های چت</span><span className="badge">{metrics.groups.toLocaleString("fa-IR")}</span></div></div></article><article className="card"><div className="section-title">اولویت‌های امروز</div><p className="muted">{metrics.urgentWorkOrders ? `${metrics.urgentWorkOrders.toLocaleString("fa-IR")} کار با اولویت فوری نیازمند پیگیری است.` : "در حال حاضر کار فوری ثبت نشده است."}</p><p className="muted">{metrics.overdueCalibrations ? `${metrics.overdueCalibrations.toLocaleString("fa-IR")} تجهیز از موعد کالیبراسیون عبور کرده است.` : "تجهیز عقب‌افتاده از موعد کالیبراسیون وجود ندارد."}</p></article></section>
    </section>
  </main>;
}
