import type { Metadata } from "next";
import { AllLocationsPage } from "@/components/MarketplacePages";

export const metadata: Metadata = {
  title: "All UK Locations | BuilderFind",
  description: "Find local builders and tradespeople across UK towns, cities and counties.",
};

export default function Page() {
  return <AllLocationsPage />;
}
