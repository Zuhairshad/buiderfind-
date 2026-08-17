import type { Metadata } from "next";
import { AllTradesPage } from "@/components/MarketplacePages";

export const metadata: Metadata = {
  title: "All Trades | BuilderFind",
  description: "Browse BuilderFind's UK directory of trade and home-improvement specialists.",
};

export default function Page() {
  return <AllTradesPage />;
}
