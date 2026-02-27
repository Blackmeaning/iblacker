"use client";

import { useState } from "react";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

type ChatApiResponse =
  | { reply: string }
  | { error: string; detail?: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseChatResponse(raw: unknown): ChatApiResponse {
  if (!isRecord(raw)) return { error: "bad_response" };

  const reply = raw["reply"];
  if (typeof reply === "string") return { reply };

  const error = raw["error"];
  const detail = raw["detail"];
  if (typeof error === "string") {
    return {
      error,
      detail: typeof detail === "string" ? detail : undefined,
    };
  }

  return { error: "bad_response" };
}

export default function ChatPage() {
  const [text, setText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi — tell me what you want to build today." },
  ]);

  const canSend = text.trim().length > 0 && !sending;

  async function send(): Promise<void> {
    if (!canSend) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setText("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const raw = await res.json().catch(() => null);
      const data = parseChatResponse(raw);

      if (!res.ok) {
        const detail = "detail" in data && typeof data.detail === "string" ? ` — ${data.detail}` : "";
        const code = "error" in data && typeof data.error === "string" ? data.error : "chat_failed";
        throw new Error(code + detail);
      }

      if (!("reply" in data)) {
        throw new Error("bad_response");
      }

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "⚠️ Chat failed. Open DevTools → Network → /api/chat and copy the error response here.",
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
              <div key={idx} className={isUser ? "flex justify-end" : "flex justify-start"}>
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
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:bg-black/50"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />

            <button
              onClick={() => void send()}
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
