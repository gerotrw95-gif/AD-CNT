import { getSession } from "@/lib/auth/server";
import { listChatGroups } from "@/lib/chat";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const groups = await listChatGroups(session.user.id);

  return <main style={{ padding: 32 }}>
    <div className="eyebrow">ارتباطات سازمانی</div>
    <h1>گفت‌وگوی سازمانی</h1>
    <p className="muted">گروه‌هایی که عضو آن‌ها هستید.</p>
    <section className="card" style={{ marginTop: 20 }}>
      {groups.length === 0 ? <p className="muted">هنوز در هیچ گروهی عضو نیستید.</p> : <div style={{ display: "grid", gap: 10 }}>{groups.map((group) => <article key={group.id} style={{ padding: 14, border: "1px solid var(--border)", borderRadius: 10 }}><strong>{group.name}</strong><div className="muted">{group.description || "بدون توضیحات"}</div><small>{group._count.members} عضو · {group._count.messages} پیام</small></article>)}</div>}
    </section>
  </main>;
}
