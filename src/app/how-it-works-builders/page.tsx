import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "How BuilderFind Works for Tradespeople", description: "Create a trade profile, choose suitable local leads and build homeowner trust." };

export default function Page() {
  return <InfoPage eyebrow="For tradespeople" title="Spend less time chasing unsuitable work" intro="BuilderFind is designed to help genuine UK tradespeople find relevant local opportunities and present their experience clearly." primaryLabel="Create your trade profile" primaryHref="/builder-signup" secondaryLabel="Open builder dashboard" secondaryHref="/dashboard" sections={[
    { title: "Build a credible profile", body: "Add accurate trade categories, coverage, qualifications, insurance and photographs of work you are permitted to share." },
    { title: "Choose suitable leads", body: "Focus on jobs that match your skills, travel area, programme and minimum project size rather than responding indiscriminately." },
    { title: "Quote with clarity", body: "State what is included, excluded and provisional. Explain availability, payment stages and the paperwork the customer will receive." },
    { title: "Earn useful reviews", body: "Communicate throughout the job, resolve snagging and invite honest feedback after the agreed work is complete." },
  ]} />;
}
