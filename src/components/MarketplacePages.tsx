"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TradeIllustration } from "@/components/TradeIllustrations";
import type { CostGuide, NearMeGuide } from "@/data/content";
import { CITIES, COUNTIES, TRADE_DIRECTORY, type LocationEntry, type TradeDirectoryEntry } from "@/data/directory";
import { getServiceGuide } from "@/data/service-guides";

type MarketingHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  illustration?: TradeDirectoryEntry["illustration"];
};

function MarketingHero({ eyebrow, title, intro, illustration }: MarketingHeroProps) {
  return (
    <section className="min-h-[500px] overflow-hidden border-b border-[#90CAF9] bg-[radial-gradient(circle_at_top_right,#90CAF9_0,transparent_42%),linear-gradient(135deg,#FFFFFF_0%,#E3F2FD_100%)] sm:min-h-[590px]">
      <div className="mx-auto grid min-h-[500px] max-w-7xl items-center gap-10 px-4 py-16 sm:min-h-[590px] sm:px-6 lg:grid-cols-[1fr_440px] lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">{eyebrow}</p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#0D47A1] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#000000] sm:text-lg">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/post-a-job" className="rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#90CAF9] transition hover:bg-[#000000]">
              Post a job free
            </Link>
            <Link href="/how-it-works" className="rounded-full border border-[#2196F3] bg-white px-7 py-3.5 text-sm font-bold text-[#0D47A1] transition hover:bg-[#E3F2FD]">
              See how it works
            </Link>
          </div>
        </div>
        {illustration ? (
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_70px_rgba(13,71,161,0.16)]">
            <TradeIllustration variant={illustration} className="h-auto w-full" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <div className="border-y border-[#2196F3] bg-[#0D47A1] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 text-center text-xs font-semibold text-white sm:px-6 lg:grid-cols-4">
        <span>Free for homeowners</span>
        <span>Up to three quotes</span>
        <span>Local trade matching</span>
        <span>No obligation to hire</span>
      </div>
    </div>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function SectionDivider({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-6 mt-10 flex items-center gap-4">
      <h2 className="whitespace-nowrap text-lg font-bold text-[#0D47A1]">{title}</h2>
      <div className="h-px flex-1 bg-[#90CAF9]" />
      <span className="rounded-full bg-[#E3F2FD] px-2.5 py-1 text-xs font-bold text-[#0D47A1]">{count} categories</span>
    </div>
  );
}

function TradeCard({ trade, index }: { trade: TradeDirectoryEntry; index: number }) {
  return (
    <Link key={trade.slug} href={`/${trade.slug}`} className="group relative overflow-hidden rounded-2xl border border-[#90CAF9] bg-white p-5 transition hover:-translate-y-1 hover:border-[#2196F3] hover:shadow-[0_18px_45px_rgba(13,71,161,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E3F2FD] text-xs font-black text-[#0D47A1]">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-xs font-bold text-[#2196F3]">{trade.featured ? "Core trade" : "Specialist"}</span>
      </div>
      <p className="mt-5 text-base font-bold text-[#0D47A1]">{trade.plural}</p>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[#000000]">{trade.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {trade.services.map((service) => (
          <span key={service} className="rounded-full bg-[#E3F2FD] px-2.5 py-1 text-[11px] font-semibold text-[#0D47A1]">{service}</span>
        ))}
      </div>
      <span className="mt-5 inline-flex text-xs font-bold text-[#0D47A1]">Explore this category <span className="ml-1 transition group-hover:translate-x-1">→</span></span>
    </Link>
  );
}

export function AllTradesPage() {
  const [query, setQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const filteredTrades = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TRADE_DIRECTORY.filter((trade) => {
      const matchesQuery = !needle || [trade.name, trade.plural, trade.summary, ...trade.services].join(" ").toLowerCase().includes(needle);
      return matchesQuery && (!featuredOnly || trade.featured);
    });
  }, [featuredOnly, query]);

  const showGrouped = query === "" && !featuredOnly;
  const coreTrades = useMemo(() => TRADE_DIRECTORY.filter((t) => t.featured), []);
  const specialistTrades = useMemo(() => TRADE_DIRECTORY.filter((t) => !t.featured), []);

  return (
    <PageFrame>
      <MarketingHero
        eyebrow="UK trade directory"
        title="Find the right specialist for every home project"
        intro={`Browse ${TRADE_DIRECTORY.length} trade and project categories. Each page explains the work, typical services and a clearer route to local quotes.`}
        illustration="builder"
      />
      <TrustStrip />
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 rounded-3xl border border-[#90CAF9] bg-[#E3F2FD] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#90CAF9] bg-white px-4 focus-within:ring-4 focus-within:ring-[#90CAF9]"><span aria-hidden="true" className="text-lg text-[#2196F3]">⌕</span><span className="sr-only">Search trades and services</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search trades, services or project types" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#0D47A1] outline-none placeholder:text-[#000000]" /><span className="text-xs font-bold text-[#000000]" aria-live="polite">{filteredTrades.length}</span></label>
              <button type="button" onClick={() => setFeaturedOnly((value) => !value)} aria-pressed={featuredOnly} className={`rounded-full px-5 py-3 text-sm font-bold transition ${featuredOnly ? "bg-[#0D47A1] text-white" : "border border-[#90CAF9] bg-white text-[#0D47A1] hover:bg-[#E3F2FD]"}`}>{featuredOnly ? "Showing core trades" : "Show core trades"}</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#0D47A1]"><span className="rounded-full bg-white px-3 py-1.5">18 core categories</span><span className="rounded-full bg-white px-3 py-1.5">Specialist services included</span><span className="rounded-full bg-white px-3 py-1.5">UK-wide location pages</span></div>
          </div>
          {filteredTrades.length ? (
            showGrouped ? (
              <>
                <SectionDivider title="Core trades" count={coreTrades.length} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {coreTrades.map((trade, index) => (
                    <TradeCard key={trade.slug} trade={trade} index={index} />
                  ))}
                </div>
                <SectionDivider title="Specialist services" count={specialistTrades.length} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {specialistTrades.map((trade, index) => (
                    <TradeCard key={trade.slug} trade={trade} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTrades.map((trade, index) => (
                  <TradeCard key={trade.slug} trade={trade} index={index} />
                ))}
              </div>
            )
          ) : (
            <div className="rounded-3xl border border-dashed border-[#90CAF9] bg-[#E3F2FD] px-6 py-12 text-center"><h2 className="text-lg font-bold text-[#0D47A1]">No matching trade categories</h2><p className="mt-2 text-sm text-[#000000]">Try a broader service or project term.</p></div>
          )}
        </div>
      </section>
    </PageFrame>
  );
}

export function SpecialtyTradePage({ trade }: { trade: TradeDirectoryEntry }) {
  return (
    <PageFrame>
      <MarketingHero eyebrow="Local trade specialists" title={`Find trusted ${trade.plural.toLowerCase()} near you`} intro={trade.summary} illustration={trade.illustration} />
      <TrustStrip />
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0D47A1]">Work a {trade.name.toLowerCase()} can help with</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {trade.services.map((service, index) => (
                <div key={service} className="rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D47A1] text-xs font-bold text-white">{index + 1}</span>
                  <h3 className="mt-4 font-bold text-[#0D47A1]">{service}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#000000]">Tell specialists the {trade.name.toLowerCase()}&apos;s current condition, dimensions, access constraints and your expected finish so quotes cover the same scope.</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl bg-[#0D47A1] p-7 text-white sm:p-9">
              <h2 className="text-2xl font-bold">Compare the detail, not only the total</h2>
              <p className="mt-3 text-sm leading-7 text-white/80">Ask for an itemised written quotation, relevant recent examples, insurance details, realistic timing and clear payment stages. For regulated work, confirm the registration and certificate required for your part of the UK.</p>
            </div>
          </div>
          <aside className="h-fit rounded-3xl border border-[#90CAF9] bg-white p-6 shadow-[0_18px_50px_rgba(13,71,161,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0D47A1]">Popular locations</p>
            <div className="mt-4 divide-y divide-[#90CAF9]">
              {CITIES.slice(0, 8).map((location) => (
                <Link key={location.slug} href={`/${trade.slug}/${location.slug}`} className="flex items-center justify-between py-3 text-sm font-semibold text-[#000000] hover:text-[#0D47A1]">
                  {trade.plural} in {location.name}<span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
            <Link href="/all-locations" className="mt-5 inline-flex text-sm font-bold text-[#0D47A1]">View all locations →</Link>
            <div className="mt-6 border-t border-[#90CAF9] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0D47A1]">Before you hire</p>
              <ul className="mt-4 space-y-2 text-xs leading-5 text-black/70">
                {["Request itemised quotes in writing", "Check insurance and qualifications", "Agree payment stages upfront", "Confirm certification requirements"].map((item) => (
                  <li key={item} className="flex gap-2"><span className="font-black text-[#2196F3]">✓</span>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageFrame>
  );
}

export function TradeLocationPage({ trade, location }: { trade: TradeDirectoryEntry; location: LocationEntry }) {
  return (
    <PageFrame>
      <MarketingHero
        eyebrow={`${location.type === "city" ? "City" : "County"} trade directory`}
        title={`${trade.plural} in ${location.name}`}
        intro={`Compare ${trade.plural.toLowerCase()} serving ${location.name} for ${trade.services.join(", ").toLowerCase()}. Post one clear brief to receive local interest without committing to hire.`}
        illustration={trade.illustration}
      />
      <TrustStrip />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3">
          {[
            ["Describe the site", "Include access, measurements, photographs and the current condition so quotes begin from useful information."],
            ["Compare the scope", "Check labour, materials, waste, access equipment, VAT, exclusions and any provisional allowances line by line."],
            ["Hire with clarity", "Agree timing, payment stages, certificates, warranties and how changes will be authorised before work starts."],
          ].map(([title, text], index) => (
            <article key={title} className="rounded-3xl border border-[#90CAF9] p-6 shadow-sm">
              <span className="text-xs font-bold text-[#0D47A1]">0{index + 1}</span>
              <h2 className="mt-4 text-lg font-bold text-[#0D47A1]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#000000]">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

export function TradeServicePage({ trade, service }: { trade: TradeDirectoryEntry; service: string }) {
  const serviceGuide = getServiceGuide(trade.slug, service);
  const serviceName = service.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  if (!serviceGuide) {
    return (
      <PageFrame>
        <MarketingHero eyebrow={`${trade.name} service guide`} title={`${serviceName} specialists`} intro={`Find experienced ${trade.plural.toLowerCase()} for ${serviceName.toLowerCase()}. Explain the property, current condition and intended result to compare properly scoped quotes.`} illustration={trade.illustration} />
        <TrustStrip />
        <section className="bg-white py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#0D47A1]">What to include in your brief</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {["Property type and approximate age", "Measurements and clear photographs", "Access, parking and working-hour limits", "Desired materials, finish and timing"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-5 text-sm font-semibold text-[#000000]">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </PageFrame>
    );
  }
  return (
    <PageFrame>
      <MarketingHero eyebrow={`${trade.name} service guide`} title={serviceGuide.title} intro={serviceGuide.intro} illustration={trade.illustration} />
      <TrustStrip />
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <div className="rounded-3xl border border-[#90CAF9] bg-[#E3F2FD] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0D47A1]">Typical project budget</p><p className="mt-3 text-3xl font-bold text-[#0D47A1]">{serviceGuide.typicalRange}</p><p className="mt-3 text-sm leading-6 text-[#000000]">Use this as a planning range only. Your property, region, specification and access determine the final quotation.</p></div>
            <h2 className="mt-12 text-2xl font-bold text-[#0D47A1]">What the work can include</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{serviceGuide.scope.map((item, index) => <article key={item.title} className="rounded-2xl border border-[#90CAF9] bg-white p-5 shadow-sm"><span className="text-xs font-bold text-[#2196F3]">0{index + 1}</span><h3 className="mt-3 text-sm font-bold leading-6 text-[#0D47A1]">{item.title}</h3><p className="mt-2 text-xs leading-5 text-black/65">{item.detail}</p></article>)}</div>
            <h2 className="mt-12 text-2xl font-bold text-[#0D47A1]">How to compare quotations</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{serviceGuide.quoteVariables.map((item) => <article key={item.title} className="rounded-2xl border-l-4 border-[#2196F3] bg-[#E3F2FD] p-5"><h3 className="text-sm font-bold leading-6 text-[#0D47A1]">{item.title}</h3><p className="mt-2 text-xs leading-5 text-black/65">{item.detail}</p></article>)}</div>
          </div>
          <aside className="h-fit rounded-3xl border border-[#90CAF9] bg-white p-6 shadow-[0_18px_50px_rgba(13,71,161,0.08)] sm:p-8"><h2 className="text-xl font-bold text-[#0D47A1]">A clear route from brief to handover</h2><ol className="mt-6 space-y-5">{serviceGuide.process.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0D47A1] text-xs font-bold text-white">{index + 1}</span><span className="text-sm leading-6 text-[#000000]">{item}</span></li>)}</ol><Link href="/post-a-job" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#0D47A1] px-5 py-3 text-sm font-bold text-white hover:bg-[#2196F3]">Post this type of job</Link></aside>
        </div>
      </section>
      <section className="border-y border-[#90CAF9] bg-[#E3F2FD] py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6"><h2 className="text-2xl font-bold text-[#0D47A1]">Questions homeowners ask</h2><div className="mt-6 grid gap-4 lg:grid-cols-3">{serviceGuide.faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-[#90CAF9] bg-white p-6"><h3 className="font-bold text-[#0D47A1]">{faq.question}</h3><p className="mt-3 text-sm leading-6 text-[#000000]">{faq.answer}</p></article>)}</div><div className="mt-10 rounded-3xl bg-[#0D47A1] p-6 text-white sm:p-8"><h2 className="text-xl font-bold">Related services</h2><div className="mt-4 flex flex-wrap gap-3">{serviceGuide.related.map((related) => { const [relatedTrade, relatedService] = related.split("/"); const target = relatedService ? `/${relatedTrade}/${relatedService}` : `/${related}`; const label = (relatedService ?? related).split("-").map((part) => part ? part[0].toUpperCase() + part.slice(1) : part).join(" "); return <Link key={related} href={target} className="rounded-full border border-white/70 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-[#0D47A1]">{label}</Link>; })}</div></div>
        </div>
      </section>
    </PageFrame>
  );
}

export function AllLocationsPage() {
  return (
    <PageFrame>
      <MarketingHero eyebrow="UK coverage" title="Find local trades across the UK" intro={`Browse ${CITIES.length} popular towns and cities plus ${COUNTIES.length} counties and areas. Choose a location, then compare builders serving that area.`} illustration="extension" />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <LocationGroup title="Popular towns and cities" locations={CITIES} />
          <div className="mt-14"><LocationGroup title="Counties and areas" locations={COUNTIES} /></div>
        </div>
      </section>
    </PageFrame>
  );
}

function LocationGroup({ title, locations }: { title: string; locations: readonly LocationEntry[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#0D47A1]">{title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {locations.map((location) => (
          <Link key={`${location.type}-${location.slug}`} href={`/builders/${location.slug}`} className="rounded-xl border border-[#90CAF9] px-4 py-3 text-sm font-semibold text-[#000000] transition hover:border-[#2196F3] hover:bg-[#E3F2FD] hover:text-[#0D47A1]">
            {location.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CostGuidesIndex({ guides }: { guides: readonly CostGuide[] }) {
  return (
    <PageFrame>
      <MarketingHero eyebrow="Independent budgeting help" title="UK home-improvement cost guides" intro="Use realistic ranges to shape a brief and challenge vague allowances. Final prices depend on your property, location, access and specification." illustration="kitchen" />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/cost-guides/${guide.slug}`} className="group overflow-hidden rounded-3xl border border-[#90CAF9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(13,71,161,0.12)]">
              <TradeIllustration variant={guide.illustration} className="h-auto w-full" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0D47A1]">{guide.category}</p>
                <h2 className="mt-3 text-lg font-bold text-[#0D47A1] group-hover:text-[#0D47A1]">{guide.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#000000]">Typical project: <strong className="text-[#0D47A1]">{guide.typicalRange}</strong></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

export function CostGuidePage({ guide }: { guide: CostGuide }) {
  return (
    <PageFrame>
      <MarketingHero eyebrow={`${guide.category} cost guide`} title={guide.title} intro={`${guide.summary} A typical budget is ${guide.typicalRange}, with straightforward work starting around ${guide.from}.`} illustration={guide.illustration} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <h2 className="text-2xl font-bold text-[#0D47A1]">Typical price ranges</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#90CAF9]">
              {guide.items.map((item) => (
                <div key={item.label} className="grid gap-2 border-b border-[#90CAF9] p-5 last:border-0 sm:grid-cols-[1fr_150px]">
                  <div><h3 className="font-bold text-[#0D47A1]">{item.label}</h3><p className="mt-1 text-sm leading-6 text-[#000000]">{item.note}</p></div>
                  <p className="font-bold text-[#0D47A1] sm:text-right">{item.range}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-3xl bg-[#0D47A1] p-7 text-white">
            <h2 className="text-xl font-bold">What changes the quote?</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-white/85">
              {guide.factors.map((factor) => <li key={factor} className="flex gap-3"><span className="text-[#90CAF9]">✓</span>{factor}</li>)}
            </ul>
            <Link href="/post-a-job" className="mt-7 block rounded-full bg-[#0D47A1] px-6 py-3 text-center text-sm font-bold text-white">Compare local quotes</Link>
          </aside>
        </div>
      </section>
    </PageFrame>
  );
}

export function NearMeIndex({ guides }: { guides: readonly NearMeGuide[] }) {
  return (
    <PageFrame>
      <MarketingHero eyebrow="Local hiring guides" title="Find trusted tradespeople near you" intro="Choose the trade you need, learn what to verify and post one clear brief for local specialists." illustration="builder" />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/near-me/${guide.slug}`} className="group overflow-hidden rounded-3xl border border-[#90CAF9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <TradeIllustration variant={guide.illustration} className="h-auto w-full" />
              <div className="p-5"><h2 className="font-bold text-[#0D47A1] group-hover:text-[#0D47A1]">{guide.title}</h2><p className="mt-2 text-sm leading-6 text-[#000000]">{guide.summary}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

export function NearMeGuidePage({ guide, trade }: { guide: NearMeGuide; trade: TradeDirectoryEntry }) {
  return (
    <PageFrame>
      <MarketingHero eyebrow="Near-me hiring guide" title={guide.title} intro={guide.summary} illustration={guide.illustration} />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0D47A1]">Four checks before you hire</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guide.checks.map((check, index) => (
              <div key={check} className="rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-5"><span className="text-xs font-bold text-[#0D47A1]">0{index + 1}</span><p className="mt-4 text-sm font-bold leading-6 text-[#0D47A1]">{check}</p></div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/${trade.slug}`} className="rounded-full border border-[#2196F3] px-6 py-3 text-sm font-bold text-[#0D47A1]">View the {trade.name.toLowerCase()} guide</Link>
            <Link href="/post-a-job" className="rounded-full bg-[#0D47A1] px-6 py-3 text-sm font-bold text-white">Post your job</Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
