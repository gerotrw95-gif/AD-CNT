const stats = [
  ["کارکنان فعال", "—", "اتصال به AD در مرحله بعد"],
  ["تجهیزات", "—", "ماژول مدیریت منابع"],
  ["کارهای باز", "—", "ماژول عملیات"],
  ["گزارش‌های امروز", "—", "ماژول گزارش کار"],
];

const navigation = ["داشبورد", "کارکنان", "واحدها", "منابع و تجهیزات", "کالیبراسیون", "کارها", "گزارش کار", "چت سازمانی", "گزارش‌ها", "تنظیمات"];

export default function Home() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">AD<span>-CNT</span></div>
        <nav className="nav" aria-label="ناوبری اصلی">
          {navigation.map((item, index) => <a className={`nav-item ${index === 0 ? "active" : ""}`} href="#" key={item}>{item}</a>)}
        </nav>
      </aside>

      <section className="main">
        <header className="header">
          <div>
            <div className="eyebrow">سامانه مدیریت سازمان</div>
            <h1>داشبورد مدیریت</h1>
            <div className="muted">مرکز کنترل منابع، نیروی انسانی و عملیات شرکت</div>
          </div>
          <div className="user-pill">مدیر سیستم</div>
        </header>

        <section className="grid">
          {stats.map(([label, value, hint]) => (
            <article className="card" key={label}>
              <div className="metric-label">{label}</div>
              <div className="metric-value">{value}</div>
              <div className="muted">{hint}</div>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="card">
            <div className="section-title">وضعیت سامانه</div>
            <div className="list">
              <div className="list-row"><span>پایگاه داده</span><span className="badge">در حال آماده‌سازی</span></div>
              <div className="list-row"><span>Active Directory</span><span className="badge">Connector در مرحله بعد</span></div>
              <div className="list-row"><span>احراز هویت و RBAC</span><span className="badge">اسکلت اولیه</span></div>
              <div className="list-row"><span>مدیریت فایل</span><span className="badge">برنامه‌ریزی شده</span></div>
            </div>
          </article>
          <article className="card">
            <div className="section-title">شروع کار</div>
            <p className="muted">این نسخه، اسکلت اولیه AD-CNT است. در مراحل بعدی دیتابیس، نقش‌ها و دسترسی‌ها، کاربران Active Directory، منابع، گزارش کار و چت سازمانی به آن اضافه می‌شوند.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
