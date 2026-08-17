import { notFound } from "next/navigation";
import { ResourceArticlePage } from "@/components/ResourcePages";
import { articlesForHub, findResourceArticle, metadataForResource } from "@/data/resources";
export const dynamicParams = false;
export function generateStaticParams() { return articlesForHub("blog").map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return metadataForResource("blog", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const article = findResourceArticle("blog", slug); if (!article) notFound(); return <ResourceArticlePage article={article} />; }
