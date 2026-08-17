import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Privacy Policy | BuilderFind", description: "How BuilderFind handles information supplied by homeowners and tradespeople." };

export default function Page() {
  return <InfoPage eyebrow="Privacy" title="How BuilderFind handles personal information" intro="This page explains the intended treatment of information submitted through BuilderFind. It should be reviewed against the production data flows and legal requirements before launch." primaryLabel="Contact about privacy" primaryHref="/contact" secondaryLabel="Read cookie policy" secondaryHref="/cookies" sections={[
    { title: "Information you provide", body: "Account details, contact information, job descriptions, postcodes, messages, photographs, trade credentials and support correspondence may be processed to operate the service." },
    { title: "Why it is used", body: "Information is used to create accounts, match jobs, enable contact, protect the marketplace, respond to support requests and meet applicable legal obligations." },
    { title: "Sharing and retention", body: "Job and contact information should only be shared where necessary for the requested marketplace service. Retention periods must reflect operational, security and legal needs." },
    { title: "Your choices", body: "Depending on applicable law, people may request access, correction, deletion, restriction or objection. Identity checks may be required before actioning a request." },
  ]} />;
}
