import { redirect } from "next/navigation";
import PortalDashboard from "@/components/dashboard/PortalDashboard";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = { title: "Hirer Dashboard | BuilderFind" };

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/customer/dashboard");
  if (user.role !== "customer") redirect(`/${user.role}/dashboard`);
  return <PortalDashboard expectedRole="customer" />;
}
