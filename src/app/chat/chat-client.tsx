"use client";

import { useEffect, useState } from "react";

type Group = { id: string; name: string; description: string | null; isPrivate: boolean; _count: { members: number; messages: number } };
type Message = { id: string; body: string; createdAt: string; sender: { displayName: string; username: string } };

export function ChatClient({ groups }: { groups: Group[] }) {
  const [selected, setSelected] = useState(groups[0]?.id ?? "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const load = async (groupId: string) => { if (!groupId) return; const r = await fetch(`/api/chat/messages?groupId=${encodeURIComponent(groupId)}`, { cache: "no-store" }); if (r.ok) setMessages((await r.json()).messages); };
  useEffect(() => { load(selected); const timer = window.setInterval(() => load(selected), 3000); return () => window.clearInterval(timer); }, [selected]);
  const send = async () => { const value = text.trim(); if (!value || !selected) return; const r = await fetch("/api/chat/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ groupId: selected, message: value }) }); if (r.ok) { setText(""); await load(selected); } };
  return <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: 520, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
    <aside style={{ borderLeft: "1px solid var(--border)", padding: 12 }}>{groups.map((g) => <button key={g.id} onClick={() => setSelected(g.id)} style={{ display: "block", width: "100%", textAlign: "right", padding: 12, marginBottom: 6, border: 0, borderRadius: 8, background: selected === g.id ? "var(--muted)" : "transparent", cursor: "pointer" }}><strong>{g.name}</strong><br /><small>{g._count.members} عضو · {g._count.messages} پیام</small></button>)}</aside>
    <section style={{ display: "grid", gridTemplateRows: "1fr auto" }}><div style={{ padding: 20, overflowY: "auto" }}>{messages.map((m) => <div key={m.id} style={{ marginBottom: 14 }}><strong>{m.sender.displayName}</strong><div>{m.body}</div><small className="muted">{new Date(m.createdAt).toLocaleString("fa-IR")}</small></div>)}</div><div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border)" }}><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="پیام خود را بنویسید..." style={{ flex: 1 }} maxLength={4000} /><button onClick={send}>ارسال</button></div></section>
  </div>;
}
