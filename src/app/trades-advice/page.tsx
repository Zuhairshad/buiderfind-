import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS["trades-advice"].label} | BuilderFind`, description: RESOURCE_HUBS["trades-advice"].intro };
export default function Page() { return <ResourceIndexPage hub="trades-advice" articles={articlesForHub("trades-advice")} />; }
