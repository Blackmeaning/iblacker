import { requireSession } from "@/lib/requireSession";

export default async function SettingsPage() {
  await requireSession();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-white/60">Account settings will appear here.</p>
    </div>
  );
}
