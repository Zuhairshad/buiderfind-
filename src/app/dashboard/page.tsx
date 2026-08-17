import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  redirect(`/${user.role}/dashboard`);
}
