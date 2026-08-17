import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Contact BuilderFind", description: "Find the right BuilderFind route for homeowner, tradesperson and account enquiries." };

export default function Page() {
  return <InfoPage eyebrow="Contact and support" title="Get to the right BuilderFind team" intro="Choose the route that matches your enquiry. Do not send passwords, payment-card details or sensitive identity documents through a general message." primaryLabel="Homeowner job help" primaryHref="/post-a-job" secondaryLabel="Tradesperson signup help" secondaryHref="/builder-signup" sections={[
    { title: "Homeowner help", body: "For a new project, start with the job form. For an existing conversation, keep the job title, trade and postcode available so support can identify the context." },
    { title: "Tradesperson help", body: "Use the signup or dashboard route for profile, lead and account questions. Keep your registered business name available." },
    { title: "Safety concern", body: "Stop work if there is immediate danger and contact the relevant emergency or statutory service. Marketplace support is not an emergency response service." },
    { title: "Privacy request", body: "Read the privacy page before submitting an access, correction or deletion request so you know what identifying information may be needed." },
  ]} />;
}
