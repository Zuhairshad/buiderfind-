import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS.guides.label} | BuilderFind`, description: RESOURCE_HUBS.guides.intro };
export default function Page() { return <ResourceIndexPage hub="guides" articles={articlesForHub("guides")} />; }
