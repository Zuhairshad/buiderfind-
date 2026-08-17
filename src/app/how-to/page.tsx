import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS["how-to"].label} | BuilderFind`, description: RESOURCE_HUBS["how-to"].intro };
export default function Page() { return <ResourceIndexPage hub="how-to" articles={articlesForHub("how-to")} />; }
