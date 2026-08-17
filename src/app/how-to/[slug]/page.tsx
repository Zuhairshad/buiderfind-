import { notFound } from "next/navigation";
import { ResourceArticlePage } from "@/components/ResourcePages";
import { articlesForHub, findResourceArticle, metadataForResource } from "@/data/resources";
export const dynamicParams = false;
export function generateStaticParams() { return articlesForHub("how-to").map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return metadataForResource("how-to", (await params).slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const article = findResourceArticle("how-to", slug); if (!article) notFound(); return <ResourceArticlePage article={article} />; }
