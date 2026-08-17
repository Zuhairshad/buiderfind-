import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CostCategoryPage } from "@/components/cost-guides/CostGuidePages";
import { COST_CATEGORIES, COST_CATEGORY_BY_SLUG, COST_JOB_LISTINGS } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return COST_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = COST_CATEGORY_BY_SLUG.get(slug);
  return category ? {
    title: `${category.name} Cost Guides | BuilderFind`,
    description: `${category.description} Compare practical UK planning ranges for ${category.guideSlugs.length} common jobs.`,
  } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = COST_CATEGORY_BY_SLUG.get(slug);
  if (!category) notFound();
  const jobs = COST_JOB_LISTINGS.filter((job) => job.categorySlugs.includes(category.slug));
  const otherCategories = COST_CATEGORIES.filter((item) => item.slug !== category.slug);
  return <CostCategoryPage category={category} jobs={jobs} otherCategories={otherCategories} />;
}
