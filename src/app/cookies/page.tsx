import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Cookie Policy | BuilderFind", description: "How essential, preference and measurement cookies may be used by BuilderFind." };

export default function Page() {
  return <InfoPage eyebrow="Cookie policy" title="Cookies should have a clear purpose" intro="BuilderFind should use only the storage needed to operate the service unless a visitor has made an informed choice about optional measurement or marketing." primaryLabel="Read privacy policy" primaryHref="/privacy" secondaryLabel="Contact us" secondaryHref="/contact" sections={[
    { title: "Essential storage", body: "Security, session, load-balancing and form-progress storage may be required for requested features and cannot always be disabled without affecting the service." },
    { title: "Preferences", body: "Preference storage can remember choices such as consent settings or interface options so they do not need to be entered repeatedly." },
    { title: "Measurement", body: "Optional analytics should only be enabled under the applicable consent rules and should be configured to minimise unnecessary personal information." },
    { title: "Managing choices", body: "A production consent control should let visitors revisit optional choices. Browser settings can also remove or block stored information." },
  ]} />;
}
