import { requireSession } from "@/lib/requireSession";

export default async function ChatPage() {
  await requireSession();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Chat</h1>
      <p className="mt-2 text-sm text-white/60">Step 6 will wire the emotional assistant chat engine.</p>
    </div>
  );
}
