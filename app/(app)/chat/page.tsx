"use client";

import { useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi — ask me anything. I can help with markets, ideas, and planning." },
  ]);
  const [input, setInput] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const apiMessages = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    [messages]
  );

  async function send(): Promise<void> {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [...apiMessages, { role: "user", content: text }] }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: true; message: string }
        | { error: string; detail?: string }
        | null;

      if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
        const err =
          data && "error" in data && typeof data.error === "string"
            ? `${data.error}${data.detail ? `: ${data.detail}` : ""}`
            : `request_failed (${res.status})`;
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err}` }]);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message || "(empty response)" }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown_error";
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${msg}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Chat</h1>

      <div className="flex min-h-[60vh] flex-col gap-3 rounded-lg border p-4">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"}>
            <div
              className={
                m.role === "user"
                  ? "rounded-2xl bg-black px-4 py-2 text-white"
                  : "rounded-2xl border bg-white px-4 py-2"
              }
            >
              <div className="whitespace-pre-wrap text-sm leading-6">{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <textarea
          className="min-h-[44px] flex-1 resize-none rounded-md border p-3 text-sm"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          disabled={sending}
        />
        <button
          className="rounded-md border px-4 text-sm disabled:opacity-50"
          onClick={() => void send()}
          disabled={sending || input.trim().length === 0}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
