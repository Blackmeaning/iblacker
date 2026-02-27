import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInCard } from "./signin-card";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");
  return <SignInCard />;
}
