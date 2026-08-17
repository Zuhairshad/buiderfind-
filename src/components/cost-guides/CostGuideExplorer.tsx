"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CostCategory } from "@/data/cost-guides";
import type { CostJobListing } from "@/data/cost-job-inventory";

type Scope = "All" | CostCategory["location"];

export default function CostGuideExplorer({ categories, jobs }: { categories: readonly CostCategory[]; jobs: readonly CostJobListing[] }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("All");
  const normalisedQuery = query.trim().toLowerCase();

  const visibleCategories = useMemo(() => categories.map((category) => {
    const categoryJobs = jobs.filter((job) => job.categorySlugs.includes(category.slug));
    const matches = categoryJobs.filter((job) => !normalisedQuery || `${job.title} ${category.name}`.toLowerCase().includes(normalisedQuery));
    return { category, jobs: matches };
  }).filter(({ category, jobs: matches }) => (scope === "All" || category.location === scope) && matches.length > 0), [categories, jobs, normalisedQuery, scope]);

  const resultCount = new Set(visibleCategories.flatMap(({ jobs: categoryJobs }) => categoryJobs.map((job) => job.slug))).size;

  return (
    <div>
      <div className="rounded-[1.75rem] border border-[#E3F2FD] bg-white p-4 shadow-[0_16px_45px_rgba(13,71,161,0.08)] sm:p-5">
        <label htmlFor="cost-guide-search" className="sr-only">Search cost guides</label>
        <div className="flex items-center gap-3 rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] px-4 transition focus-within:border-[#2196F3] focus-within:ring-4 focus-within:ring-[#90CAF9]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-[#2196F3] stroke-2"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
          <input id="cost-guide-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search category jobs, for example ‘rewire’ or ‘patio’" className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#0D47A1] outline-none placeholder:text-[#000000]" />
          {query ? <button type="button" onClick={() => setQuery("")} className="rounded-lg px-2 py-1 text-xs font-bold text-[#000000] hover:bg-white hover:text-[#0D47A1]">Clear</button> : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filter cost-guide categories">
          {(["All", "Indoor", "Outdoor"] as const).map((option) => (
            <button key={option} type="button" onClick={() => setScope(option)} aria-pressed={scope === option} className={`rounded-full px-4 py-2 text-xs font-bold transition ${scope === option ? "bg-[#0D47A1] text-white" : "bg-[#E3F2FD] text-[#000000] hover:bg-[#E3F2FD]"}`}>{option} jobs</button>
          ))}
          <span className="ml-auto text-xs font-semibold text-[#000000]" aria-live="polite">{resultCount} {resultCount === 1 ? "guide" : "guides"}</span>
        </div>
      </div>

      {visibleCategories.length ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {visibleCategories.map(({ category, jobs: categoryJobs }, categoryIndex) => {
            const displayedJobs = normalisedQuery ? categoryJobs : categoryJobs.slice(0, 6);
            return (
            <section key={category.slug} className="overflow-hidden rounded-[1.75rem] border border-[#90CAF9] bg-white shadow-[0_10px_35px_rgba(13,71,161,0.06)]">
              <div className="flex items-start justify-between gap-5 border-b border-[#90CAF9] bg-[linear-gradient(135deg,#E3F2FD,#E3F2FD)] p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D47A1] text-xs font-black text-white">{String(categoryIndex + 1).padStart(2, "0")}</span>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0D47A1]">{category.location}</p>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-[#0D47A1]">{category.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#000000]">{category.description}</p>
                </div>
                <Link href={`/cost-guides/category/${category.slug}`} aria-label={`View all ${category.name} cost guides`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#90CAF9] bg-white text-[#0D47A1] transition hover:border-[#2196F3] hover:bg-[#000000] hover:text-white">→</Link>
              </div>
              <div className="divide-y divide-[#90CAF9] px-6">
                {displayedJobs.map((job) => (
                  <Link key={job.slug} href={`/cost-guides/${job.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#0D47A1] transition group-hover:text-[#0D47A1]">{job.title}</h3>
                      <p className="mt-1 text-xs text-[#000000]">View costs and related options</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3F2FD] text-sm font-bold text-[#0D47A1]" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
              {!normalisedQuery ? <Link href={`/cost-guides/category/${category.slug}`} className="mx-6 mb-6 mt-2 inline-flex text-sm font-bold text-[#0D47A1] hover:underline">View all {categoryJobs.length} {category.name.toLowerCase()} jobs →</Link> : null}
            </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-[#90CAF9] bg-[#E3F2FD] px-6 py-14 text-center">
          <h2 className="text-xl font-bold text-[#0D47A1]">No matching cost guides</h2>
          <p className="mt-2 text-sm text-[#000000]">Try a broader job name or switch between indoor and outdoor work.</p>
        </div>
      )}
    </div>
  );
}
