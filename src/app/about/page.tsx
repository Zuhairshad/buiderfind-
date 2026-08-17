import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "About BuilderFind", description: "Why BuilderFind is building a clearer UK marketplace for homeowners and tradespeople." };

export default function Page() {
  return <InfoPage eyebrow="About BuilderFind" title="A clearer way to start home-improvement work" intro="BuilderFind brings structured job briefs, practical hiring guidance and local trade discovery into one straightforward UK service." sections={[
    { title: "For homeowners", body: "We make it easier to explain a project, understand likely costs and compare the scope behind each response." },
    { title: "For good trades", body: "We help capable local businesses spend their time on work that fits their trade, coverage and availability." },
    { title: "Useful information", body: "Our guides focus on the decisions that change cost and quality: preparation, access, specification, compliance and handover." },
    { title: "Marketplace responsibility", body: "BuilderFind supports introductions. Homeowners and tradespeople remain responsible for checking suitability and agreeing their contract." },
  ]} />;
}
