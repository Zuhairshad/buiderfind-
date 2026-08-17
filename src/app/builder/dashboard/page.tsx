import { redirect } from "next/navigation";
import PortalDashboard from "@/components/dashboard/PortalDashboard";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = { title: "Builder Dashboard | BuilderFind" };

export default async function BuilderDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/builder/dashboard");
  if (user.role !== "builder") redirect(`/${user.role}/dashboard`);
  return <PortalDashboard expectedRole="builder" />;
}
