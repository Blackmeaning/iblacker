"use client";

import { useState } from "react";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

export default function ChatPage() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi — tell me what you want to build today." },
  ]);

  const canSend = text.trim().length > 0 && !sending;

  async function send() {
    if (!canSend) return;
    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    setMessages((m) => [...m, userMessage]);
    setText("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const detail = typeof data?.detail === "string" ? ` — ${data.detail}` : "";
        throw new Error((data?.error || "chat_failed") + detail);
      }

      const reply = typeof data?.reply === "string" ? data.reply : "(empty reply)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err: unknown) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "⚠️ Something failed. Open DevTools → Network → /api/chat and copy the error here.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
        <p className="mt-2 text-sm text-white/60">
          Your AI assistant inside IBlacker.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_70px_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="h-[520px] overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={[
                  "flex",
                  isUser ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    isUser
                      ? "bg-white text-black shadow-lg"
                      : "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex gap-3">
            <textarea
              value={text}
              onChange={(_e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:bg-black/50"
              rows={2}
              onKeyDown={(_e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />

            <button
              onClick={send}
              disabled={!canSend}
              className={[
                "rounded-2xl px-5 py-3 text-sm font-medium transition",
                canSend
                  ? "bg-white text-black hover:bg-white/90 shadow-xl"
                  : "bg-white/10 text-white/40 cursor-not-allowed",
              ].join(" ")}
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>

          <div className="mt-2 text-[11px] text-white/40">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
