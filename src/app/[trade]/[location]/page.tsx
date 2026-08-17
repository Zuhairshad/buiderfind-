import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TradeLocationPage, TradeServicePage } from "@/components/MarketplacePages";
import { LOCATION_BY_SLUG, TRADE_BY_SLUG, TRADE_SERVICE_SLUGS } from "@/data/directory";

type Props = { params: Promise<{ trade: string; location: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trade: tradeSlug, location: locationSlug } = await params;
  const trade = TRADE_BY_SLUG.get(tradeSlug);
  const location = LOCATION_BY_SLUG.get(locationSlug);

  if (!trade) return {};
  if (location) {
    return {
      title: `${trade.plural} in ${location.name} | BuilderFind`,
      description: `Compare local ${trade.plural.toLowerCase()} serving ${location.name} and post your job free.`,
    };
  }

  const service = TRADE_SERVICE_SLUGS[tradeSlug]?.includes(locationSlug) ? locationSlug : undefined;
  return service ? { title: `${service.replaceAll("-", " ")} | ${trade.plural} | BuilderFind` } : {};
}

export default async function Page({ params }: Props) {
  const { trade: tradeSlug, location: locationSlug } = await params;
  const trade = TRADE_BY_SLUG.get(tradeSlug);

  if (!trade) notFound();

  const location = LOCATION_BY_SLUG.get(locationSlug);
  if (location) return <TradeLocationPage trade={trade} location={location} />;

  const service = TRADE_SERVICE_SLUGS[tradeSlug]?.includes(locationSlug) ? locationSlug : undefined;
  if (service) return <TradeServicePage trade={trade} service={service} />;

  notFound();
}
