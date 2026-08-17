import type { Metadata } from "next";
import HowItWorksPage from "@/components/HowItWorksPage";

export const metadata: Metadata = {
  title: "How BuilderFind Works for Homeowners",
  description: "Learn how to post a UK home-improvement job, hear from relevant local tradespeople, compare written quotes and hire with clarity.",
};

export default function Page() {
  return <HowItWorksPage />;
}
