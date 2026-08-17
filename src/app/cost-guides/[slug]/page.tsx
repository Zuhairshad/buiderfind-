import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CostGuidePage, CostJobOptionPage } from "@/components/cost-guides/CostGuidePages";
import { COST_CATEGORIES, COST_CATEGORY_BY_SLUG, COST_GUIDE_BY_SLUG, COST_GUIDES, COST_JOB_BY_SLUG, COST_JOB_LISTINGS } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set([...COST_JOB_LISTINGS.map((job) => job.slug), ...COST_GUIDES.map((guide) => guide.slug)])]
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = COST_GUIDE_BY_SLUG.get(slug);
  if (guide) return { title: `${guide.title} | BuilderFind`, description: guide.summary };
  const job = COST_JOB_BY_SLUG.get(slug);
  return job ? { title: `${job.title} | BuilderFind`, description: `Plan ${job.title.toLowerCase()} and compare clear, site-specific quotes from relevant local tradespeople.` } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const guide = COST_GUIDE_BY_SLUG.get(slug);
  if (guide) {
    const category = COST_CATEGORY_BY_SLUG.get(guide.categorySlug);
    if (!category) notFound();
    const relatedGuides = COST_GUIDES.filter((item) => item.categorySlug === category.slug && item.slug !== guide.slug).slice(0, 3);
    return <CostGuidePage guide={guide} category={category} relatedGuides={relatedGuides} />;
  }

  const job = COST_JOB_BY_SLUG.get(slug);
  if (!job) notFound();
  const categories = COST_CATEGORIES.filter((category) => job.categorySlugs.includes(category.slug));
  const primaryCategory = categories[0];
  const relatedJobs = COST_JOB_LISTINGS
    .filter((item) => item.slug !== job.slug && (!primaryCategory || item.categorySlugs.includes(primaryCategory.slug)))
    .slice(0, 12);
  return <CostJobOptionPage job={job} categories={categories} relatedJobs={relatedJobs} />;
}
