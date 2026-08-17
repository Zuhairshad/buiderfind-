import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS.advice.label} | BuilderFind`, description: RESOURCE_HUBS.advice.intro };
export default function Page() { return <ResourceIndexPage hub="advice" articles={articlesForHub("advice")} />; }
