import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";
import SettingsClient from "./settingsClient";

export default async function SettingsPage() {
  const userId = await requireUserId();

  const settings =
    (await prisma.userSettings.findUnique({ where: { userId } })) ??
    (await prisma.userSettings.create({ data: { userId } }));

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="mt-1 text-white/60">Your account preferences</p>

        <div className="mt-8">
          <SettingsClient initial={settings} />
        </div>
      </div>
    </main>
  );
}