import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NearMeGuidePage } from "@/components/MarketplacePages";
import { NEAR_ME_BY_SLUG, NEAR_ME_GUIDES } from "@/data/content";
import { TRADE_BY_SLUG } from "@/data/directory";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return NEAR_ME_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = NEAR_ME_BY_SLUG.get(slug);
  return guide ? { title: `${guide.title} | BuilderFind`, description: guide.summary } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const guide = NEAR_ME_BY_SLUG.get(slug);
  if (!guide) notFound();
  const trade = TRADE_BY_SLUG.get(guide.tradeSlug);
  if (!trade) notFound();
  return <NearMeGuidePage guide={guide} trade={trade} />;
}
