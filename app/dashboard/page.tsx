import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-4">{session.user?.email}</p>
    </main>
  );
}
