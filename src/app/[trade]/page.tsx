import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailedTradePage from "@/components/DetailedTradePage";
import { SpecialtyTradePage } from "@/components/MarketplacePages";
import { DETAILED_TRADE_SLUGS, TRADE_BY_SLUG } from "@/data/directory";

type Props = { params: Promise<{ trade: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trade: tradeSlug } = await params;
  const trade = TRADE_BY_SLUG.get(tradeSlug);
  return trade ? { title: `${trade.plural} Near You | BuilderFind`, description: trade.summary } : {};
}

export default async function Page({ params }: Props) {
  const { trade: tradeSlug } = await params;
  const trade = TRADE_BY_SLUG.get(tradeSlug);
  if (!trade) notFound();
  return DETAILED_TRADE_SLUGS.has(tradeSlug) ? <DetailedTradePage tradeSlug={tradeSlug} /> : <SpecialtyTradePage trade={trade} />;
}
