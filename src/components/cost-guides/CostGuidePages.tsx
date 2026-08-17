import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TradeIllustration } from "@/components/TradeIllustrations";
import CostGuideExplorer from "@/components/cost-guides/CostGuideExplorer";
import CostJobGrid from "@/components/cost-guides/CostJobGrid";
import type { CostCategory, CostGuide } from "@/data/cost-guides";
import type { CostJobListing } from "@/data/cost-job-inventory";

function Frame({ children }: { children: React.ReactNode }) {
  return <><Navbar /><main>{children}</main><Footer /></>;
}

function Breadcrumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#000000]">
      {items.map((item, index) => <span key={item.label} className="flex items-center gap-2">{index ? <span aria-hidden="true">/</span> : null}{item.href ? <Link href={item.href} className="hover:text-[#0D47A1]">{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}
    </nav>
  );
}

function CatalogueHero({ count }: { count: number }) {
  return (
    <section className="relative min-h-[520px] overflow-hidden border-b border-[#90CAF9] bg-[#000000] text-white sm:min-h-[650px]">
      <div aria-hidden="true" className="absolute -right-24 -top-36 h-[32rem] w-[32rem] rounded-full bg-[#0D47A1]/35 blur-3xl" />
      <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-16 sm:min-h-[650px] sm:px-6 sm:py-24 lg:grid-cols-[1fr_430px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#90CAF9]">UK home-improvement pricing library</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">Plan the job before you compare the quote</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Explore {count} cost jobs across the inside and outside of your home. Move from the exact job option to related work, quote variables and richer planning ranges where available.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">16 project categories</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">UK planning ranges</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Clear quote checklists</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-[0_28px_80px_rgba(0,0,0,.28)]">
          <TradeIllustration variant="kitchen" className="h-auto w-full" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 text-[#0D47A1] shadow-xl backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#0D47A1]">A clearer starting point</p>
            <p className="mt-1 text-sm font-semibold">Search by job, compare related options, then build a site-specific brief.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CostGuidesIndex({ categories, jobs }: { categories: readonly CostCategory[]; jobs: readonly CostJobListing[] }) {
  return (
    <Frame>
      <CatalogueHero count={jobs.length} />
      <section className="bg-[#E3F2FD] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-9 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#0D47A1]">Browse the full catalogue</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0D47A1] sm:text-4xl">Choose a category or search for the exact job</h2>
            <p className="mt-4 text-base leading-7 text-[#000000]">Prices are indicative UK planning ranges, not quotations. Property condition, access, region and specification still need checking on site.</p>
          </div>
          <CostGuideExplorer categories={categories} jobs={jobs} />
          <div id="all-cost-jobs" className="mt-16 border-t border-[#90CAF9] pt-14 sm:mt-20 sm:pt-16">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#0D47A1]">Complete A–Z directory</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0D47A1] sm:text-4xl">All {jobs.length} cost jobs and specialist options</h2>
              <p className="mt-4 text-base leading-7 text-[#000000]">Search every listed topic, including specialist and location-specific variations that sit outside the main category collections.</p>
            </div>
            <CostJobGrid jobs={jobs} categoryName="cost guide" />
          </div>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-3 sm:px-6">
          {[
            ["01", "Define the same scope", "Record dimensions, existing conditions, materials, access and making good so every quote covers comparable work."],
            ["02", "Keep allowances visible", "Ask which figures are fixed and which are provisional, especially for hidden defects, groundwork and service changes."],
            ["03", "Check the final handover", "Confirm waste removal, testing, certification, warranties, snagging and VAT before accepting a total."],
          ].map(([number, title, copy]) => <article key={number} className="rounded-3xl border border-[#90CAF9] p-6"><span className="text-xs font-black text-[#0D47A1]">{number}</span><h2 className="mt-4 text-lg font-bold text-[#0D47A1]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#000000]">{copy}</p></article>)}
        </div>
      </section>
    </Frame>
  );
}

export function CostCategoryPage({ category, jobs, otherCategories }: { category: CostCategory; jobs: readonly CostJobListing[]; otherCategories: readonly CostCategory[] }) {
  return (
    <Frame>
      <section className="min-h-[520px] border-b border-[#90CAF9] bg-[radial-gradient(circle_at_top_right,#90CAF9_0,transparent_42%),linear-gradient(135deg,#E3F2FD,#E3F2FD)] sm:min-h-[650px]">
        <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-9 px-4 py-16 sm:min-h-[650px] sm:px-6 sm:py-24 lg:grid-cols-[1fr_380px]">
          <div><Breadcrumbs items={[{ label: "Cost guides", href: "/cost-guides" }, { label: category.name }]} /><p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[#0D47A1]">{category.location} project category</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0D47A1] sm:text-5xl">{category.name} cost guides</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#000000]">{category.description} Browse all {jobs.length} listed jobs below, then open a topic for quote-planning details and related options.</p><div className="mt-7 grid max-w-xl grid-cols-3 gap-3"><div className="rounded-2xl border border-[#90CAF9] bg-white p-4"><p className="text-xl font-black text-[#0D47A1]">{jobs.length}</p><p className="mt-1 text-[11px] font-semibold text-[#000000]">Cost topics</p></div><div className="rounded-2xl border border-[#90CAF9] bg-white p-4"><p className="text-xl font-black text-[#0D47A1]">UK</p><p className="mt-1 text-[11px] font-semibold text-[#000000]">Planning ranges</p></div><div className="rounded-2xl border border-[#90CAF9] bg-white p-4"><p className="text-xl font-black text-[#0D47A1]">Free</p><p className="mt-1 text-[11px] font-semibold text-[#000000]">To browse</p></div></div></div>
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_65px_rgba(13,71,161,.15)]"><TradeIllustration variant={category.illustration} className="h-auto w-full" /></div>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_310px]">
          <div>
            <div className="mb-8 rounded-3xl border border-[#90CAF9] bg-[#E3F2FD] p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Plan before you price</p><h2 className="mt-2 text-xl font-bold text-[#0D47A1]">What moves a {category.name.toLowerCase()} quote?</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{category.factors.map((factor) => <div key={factor} className="flex gap-2 text-sm leading-6 text-[#000000]"><span className="font-black text-[#2196F3]">✓</span>{factor}</div>)}</div></div>
            <CostJobGrid jobs={jobs} categoryName={category.name} />
          </div>
          <aside className="h-fit rounded-3xl bg-[#0D47A1] p-6 text-white lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#90CAF9]">Explore another category</p>
            <div className="mt-4 divide-y divide-white/10">{otherCategories.slice(0, 7).map((item) => <Link key={item.slug} href={`/cost-guides/category/${item.slug}`} className="flex items-center justify-between gap-4 py-3 text-sm font-semibold text-white/85 hover:text-white"><span>{item.name}</span><span aria-hidden="true">→</span></Link>)}</div>
            <Link href="/cost-guides" className="mt-5 inline-flex text-sm font-bold text-[#90CAF9] hover:text-white">View all 16 categories →</Link>
          </aside>
        </div>
      </section>
    </Frame>
  );
}

export function CostJobOptionPage({ job, categories, relatedJobs }: { job: CostJobListing; categories: readonly CostCategory[]; relatedJobs: readonly CostJobListing[] }) {
  const primaryCategory = categories[0];
  const categoryName = primaryCategory?.name ?? "Home improvement";
  const illustration = primaryCategory?.illustration ?? "builder";
  const factors = primaryCategory?.factors ?? ["Property condition and access", "Labour and material specification", "Regional rates and project timing", "Waste, making good and certification"];

  return (
    <Frame>
      <section className="border-b border-[#90CAF9] bg-[radial-gradient(circle_at_top_right,#90CAF9_0,transparent_42%),linear-gradient(135deg,#E3F2FD,#E3F2FD)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_390px]">
          <div>
            <Breadcrumbs items={[{ label: "Cost guides", href: "/cost-guides" }, ...(primaryCategory ? [{ label: categoryName, href: `/cost-guides/category/${primaryCategory.slug}` }] : []), { label: job.title }]} />
            <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[#0D47A1]">UK cost-planning topic</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-[#0D47A1] sm:text-5xl">{job.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#000000]">Build a useful allowance by defining the exact scope, specification, access and finishing requirements. A local inspection and itemised written quote are the safest way to confirm the price for your property.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/post-a-job" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#000000]">Get site-specific quotes</Link>
              {primaryCategory ? <Link href={`/cost-guides/category/${primaryCategory.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#90CAF9] bg-white px-7 py-3.5 text-sm font-bold text-[#0D47A1] transition hover:border-[#2196F3]">All {categoryName} jobs</Link> : null}
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_65px_rgba(13,71,161,.15)]"><TradeIllustration variant={illustration} className="h-auto w-full" /></div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Before comparing prices</p>
            <h2 className="mt-3 text-3xl font-bold text-[#0D47A1]">Define the variables behind the quote</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {factors.map((factor, index) => <article key={factor} className="rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D47A1] text-xs font-black text-white">{index + 1}</span><h3 className="mt-4 text-sm font-bold leading-6 text-[#0D47A1]">{factor}</h3></article>)}
            </div>

            <div className="mt-12 rounded-[2rem] bg-[#E3F2FD] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Quote checklist</p>
              <h2 className="mt-3 text-2xl font-bold text-[#0D47A1]">Ask every tradesperson to price the same brief</h2>
              <ul className="mt-6 grid gap-3 text-sm leading-6 text-[#000000] sm:grid-cols-2">{["Labour and named materials", "Preparation and protection", "Access equipment and waste", "VAT and provisional allowances", "Testing or certification", "Making good and final finish", "Programme and payment stages", "Warranty and snagging"].map((item) => <li key={item} className="flex gap-3"><span className="font-black text-[#0D47A1]">✓</span><span>{item}</span></li>)}</ul>
            </div>

            <section className="mt-12">
              <h2 className="text-3xl font-bold text-[#0D47A1]">More {categoryName.toLowerCase()} job options</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedJobs.map((related) => <Link key={related.slug} href={`/cost-guides/${related.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-[#90CAF9] p-5 hover:border-[#90CAF9] hover:shadow-lg"><span className="text-sm font-bold leading-6 text-[#0D47A1] group-hover:text-[#0D47A1]">{related.title}</span><span className="shrink-0 text-[#0D47A1]" aria-hidden="true">→</span></Link>)}
              </div>
            </section>
          </div>
          <aside className="h-fit rounded-3xl bg-[#0D47A1] p-7 text-white lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#90CAF9]">Price it properly</p>
            <h2 className="mt-3 text-xl font-bold">Turn this topic into a clear job brief</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">Include measurements, photographs, access notes and your expected finish so local specialists can respond to the same scope.</p>
            <Link href="/post-a-job" className="mt-6 block rounded-full bg-[#0D47A1] px-5 py-3 text-center text-sm font-bold text-white">Post your job free</Link>
          </aside>
        </div>
      </section>
    </Frame>
  );
}

export function CostGuidePage({ guide, category, relatedGuides }: { guide: CostGuide; category: CostCategory; relatedGuides: readonly CostGuide[] }) {
  return (
    <Frame>
      <section className="border-b border-[#90CAF9] bg-[#E3F2FD]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><Breadcrumbs items={[{ label: "Cost guides", href: "/cost-guides" }, { label: category.name, href: `/cost-guides/category/${category.slug}` }, { label: guide.shortTitle }]} /></div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 sm:px-6 sm:pb-20 lg:grid-cols-[1fr_430px]">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0D47A1]">Independent UK planning guide</p><h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-[#0D47A1] sm:text-5xl">{guide.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#000000]">{guide.summary}</p><Link href="/post-a-job" className="mt-8 inline-flex rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#90CAF9] transition hover:bg-[#000000]">Get site-specific quotes</Link></div>
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_rgba(13,71,161,.16)]"><TradeIllustration variant={guide.illustration} className="h-auto w-full" /></div>
        </div>
      </section>

      <section className="-mt-7 relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-3xl border border-[#90CAF9] bg-white shadow-[0_18px_55px_rgba(13,71,161,.1)] sm:grid-cols-3">
          {[["Typical UK range", guide.typicalRange], ["Straightforward jobs", `From ${guide.from}`], ["Typical site time", guide.duration]].map(([label, value], index) => <div key={label} className={`p-6 ${index ? "border-t border-[#90CAF9] sm:border-l sm:border-t-0" : ""}`}><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#000000]">{label}</p><p className="mt-2 text-xl font-bold text-[#0D47A1]">{value}</p></div>)}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_330px]">
          <div className="space-y-12">
            <section><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Build the allowance</p><h2 className="mt-3 text-3xl font-bold text-[#0D47A1]">How to read this price</h2><div className="mt-6 overflow-hidden rounded-3xl border border-[#90CAF9]">{guide.items.map((item, index) => <div key={item.label} className={`grid gap-3 p-6 sm:grid-cols-[1fr_180px] ${index ? "border-t border-[#90CAF9]" : ""}`}><div><h3 className="font-bold text-[#0D47A1]">{item.label}</h3><p className="mt-2 text-sm leading-6 text-[#000000]">{item.note}</p></div><p className="font-bold text-[#0D47A1] sm:text-right">{item.range}</p></div>)}</div><p className="mt-4 text-xs leading-5 text-[#000000]">These figures are early UK planning allowances. They are not a substitute for an itemised quotation after inspection.</p></section>
            <section><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Control the variables</p><h2 className="mt-3 text-3xl font-bold text-[#0D47A1]">What can change the quote?</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{guide.factors.map((factor, index) => <div key={factor} className="rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D47A1] text-xs font-black text-white">{index + 1}</span><p className="mt-4 text-sm font-bold leading-6 text-[#0D47A1]">{factor}</p></div>)}</div></section>
            <section className="rounded-[2rem] bg-[#E3F2FD] p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Before accepting a quote</p><h2 className="mt-3 text-2xl font-bold text-[#0D47A1]">Ask for these details in writing</h2><ul className="mt-6 grid gap-3 text-sm leading-6 text-[#000000] sm:grid-cols-2">{["Labour, materials and VAT", "Preparation and protection", "Access equipment and waste", "Named provisional allowances", "Testing and certification", "Programme and payment stages", "Making good and decoration", "Warranty and snagging process"].map((item) => <li key={item} className="flex gap-3"><span className="font-black text-[#0D47A1]">✓</span><span>{item}</span></li>)}</ul></section>
            <section><h2 className="text-3xl font-bold text-[#0D47A1]">Related {category.name.toLowerCase()} jobs</h2><div className="mt-6 grid gap-4 sm:grid-cols-3">{relatedGuides.map((related) => <Link key={related.slug} href={`/cost-guides/${related.slug}`} className="group rounded-2xl border border-[#90CAF9] p-5 hover:border-[#90CAF9] hover:shadow-lg"><p className="text-sm font-bold text-[#0D47A1] group-hover:text-[#0D47A1]">{related.shortTitle}</p><p className="mt-2 text-xs font-semibold text-[#0D47A1]">{related.typicalRange}</p><span className="mt-4 inline-flex text-xs font-bold text-[#000000] group-hover:text-[#0D47A1]">Open guide →</span></Link>)}</div></section>
          </div>
          <aside className="h-fit space-y-5 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-[#0D47A1] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#90CAF9]">Next step</p><h2 className="mt-3 text-xl font-bold">Compare like-for-like quotes</h2><p className="mt-3 text-sm leading-6 text-white/80">Share one clear scope with local specialists and check every response against the same inclusions.</p><Link href="/post-a-job" className="mt-6 block rounded-full bg-[#0D47A1] px-5 py-3 text-center text-sm font-bold text-white">Post your job free</Link></div>
            <div className="rounded-3xl border border-[#90CAF9] p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0D47A1]">Keep exploring</p><Link href={`/cost-guides/category/${category.slug}`} className="mt-4 flex items-center justify-between text-sm font-bold text-[#0D47A1] hover:text-[#0D47A1]"><span>All {category.name} guides</span><span>→</span></Link><Link href="/cost-calculators" className="mt-4 flex items-center justify-between border-t border-[#90CAF9] pt-4 text-sm font-bold text-[#0D47A1] hover:text-[#0D47A1]"><span>Cost calculators</span><span>→</span></Link><Link href="/cost-guides" className="mt-4 flex items-center justify-between border-t border-[#90CAF9] pt-4 text-sm font-bold text-[#0D47A1] hover:text-[#0D47A1]"><span>Full cost library</span><span>→</span></Link></div>
          </aside>
        </div>
      </section>
    </Frame>
  );
}
