import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS.ideas.label} | BuilderFind`, description: RESOURCE_HUBS.ideas.intro };
export default function Page() { return <ResourceIndexPage hub="ideas" articles={articlesForHub("ideas")} />; }
