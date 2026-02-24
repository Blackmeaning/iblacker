import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Workspace() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      {/* your existing workspace */}
    </main>
  );
}