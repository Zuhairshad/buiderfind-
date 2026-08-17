import { redirect } from "next/navigation";
import PortalDashboard from "@/components/dashboard/PortalDashboard";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = { title: "Admin Dashboard | BuilderFind" };

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/dashboard");
  if (user.role !== "admin") redirect(`/${user.role}/dashboard`);
  return <PortalDashboard expectedRole="admin" />;
}
