import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS.blog.label} | BuilderFind`, description: RESOURCE_HUBS.blog.intro };
export default function Page() { return <ResourceIndexPage hub="blog" articles={articlesForHub("blog")} />; }
