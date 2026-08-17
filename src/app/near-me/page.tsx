import type { Metadata } from "next";
import { NearMeIndex } from "@/components/MarketplacePages";
import { NEAR_ME_GUIDES } from "@/data/content";

export const metadata: Metadata = {
  title: "Find Tradespeople Near Me | BuilderFind",
  description: "Practical UK hiring guides for finding trusted local builders and tradespeople.",
};

export default function Page() {
  return <NearMeIndex guides={NEAR_ME_GUIDES} />;
}
