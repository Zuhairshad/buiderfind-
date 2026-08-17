import { notFound } from "next/navigation";
import PortalDashboard from "@/components/dashboard/PortalDashboard";

const PREVIEW_ROLES = ["customer", "builder"] as const;
type PreviewRole = (typeof PREVIEW_ROLES)[number];

export function generateStaticParams() {
  return PREVIEW_ROLES.map((role) => ({ role }));
}

export default async function DashboardPreviewPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!PREVIEW_ROLES.includes(role as PreviewRole)) notFound();
  return <PortalDashboard expectedRole={role as PreviewRole} preview />;
}
