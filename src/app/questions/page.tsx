import { ResourceIndexPage } from "@/components/ResourcePages";
import { articlesForHub, RESOURCE_HUBS } from "@/data/resources";
export const metadata = { title: `${RESOURCE_HUBS.questions.label} | BuilderFind`, description: RESOURCE_HUBS.questions.intro };
export default function Page() { return <ResourceIndexPage hub="questions" articles={articlesForHub("questions")} />; }
