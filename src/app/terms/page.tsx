import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Terms of Service | BuilderFind", description: "The core rules for using BuilderFind as a homeowner or tradesperson." };

export default function Page() {
  return <InfoPage eyebrow="Terms of service" title="Clear expectations for using BuilderFind" intro="These marketplace terms summarise expected conduct and service boundaries. They require formal legal review before BuilderFind accepts live users or payments." primaryLabel="Contact BuilderFind" primaryHref="/contact" sections={[
    { title: "Marketplace role", body: "BuilderFind introduces homeowners and independent tradespeople. BuilderFind is not automatically a party to the contract for building work." },
    { title: "Accurate information", body: "Users must provide truthful account, job, qualification, insurance, availability and pricing information and must not impersonate another person or business." },
    { title: "Checks and contracts", body: "Homeowners remain responsible for checking suitability and agreeing scope, price and terms. Tradespeople remain responsible for lawful, competent and insured work." },
    { title: "Acceptable use", body: "The service must not be used for fraud, harassment, unlawful work, scraping, unsolicited marketing or attempts to compromise accounts or platform availability." },
  ]} />;
}
