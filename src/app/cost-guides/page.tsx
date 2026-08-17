import type { Metadata } from "next";
import { CostGuidesIndex } from "@/components/cost-guides/CostGuidePages";
import { COST_CATEGORIES, COST_JOB_LISTINGS } from "@/data/content";

export const metadata: Metadata = {
  title: "UK Home Improvement Cost Guides | BuilderFind",
  description: "Explore 468 UK home-improvement cost topics across 16 indoor and outdoor project categories.",
};

export default function Page() {
  return <CostGuidesIndex categories={COST_CATEGORIES} jobs={COST_JOB_LISTINGS} />;
}
