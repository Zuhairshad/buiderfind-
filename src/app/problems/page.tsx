import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS.problems.label} | BuilderFind`, description: RESOURCE_HUBS.problems.intro };
export default function Page() { return <ResourceIndexPage hub="problems" articles={articlesForHub("problems")} />; }
