import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export type InfoSection = {
  title: string;
  body: string;
  bullets?: readonly string[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly InfoSection[];
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function InfoPage({ eyebrow, title, intro, sections, primaryLabel = "Post a job free", primaryHref = "/post-a-job", secondaryLabel = "Browse all trades", secondaryHref = "/all-trades" }: InfoPageProps) {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-[#90CAF9] bg-[linear-gradient(135deg,#FFFFFF_0%,#E3F2FD_100%)]">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#0D47A1] sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#000000] sm:text-lg">{intro}</p>
          </div>
        </section>
        <section className="bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {sections.map((section, index) => (
                <article key={section.title} className="rounded-3xl border border-[#90CAF9] bg-white p-6 shadow-[0_12px_35px_rgba(13,71,161,0.06)] sm:p-8">
                  <span className="text-xs font-bold text-[#0D47A1]">0{index + 1}</span>
                  <h2 className="mt-4 text-xl font-bold text-[#0D47A1]">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#000000]">{section.body}</p>
                  {section.bullets ? <ul className="mt-5 space-y-3">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#000000]"><span className="font-bold text-[#0D47A1]">✓</span>{bullet}</li>)}</ul> : null}
                </article>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3 rounded-3xl bg-[#0D47A1] p-7 sm:p-9">
              <Link href={primaryHref} className="rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#000000]">{primaryLabel}</Link>
              <Link href={secondaryHref} className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">{secondaryLabel}</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
