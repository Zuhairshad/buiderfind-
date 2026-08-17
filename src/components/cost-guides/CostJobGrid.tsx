"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CostJobListing } from "@/data/cost-job-inventory";

const PAGE_SIZE = 24;

export default function CostJobGrid({ jobs, categoryName }: { jobs: readonly CostJobListing[]; categoryName: string }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const normalisedQuery = query.trim().toLowerCase();
  const filteredJobs = useMemo(
    () => jobs.filter((job) => !normalisedQuery || job.title.toLowerCase().includes(normalisedQuery)),
    [jobs, normalisedQuery],
  );
  const visibleJobs = filteredJobs.slice(0, visibleCount);

  return (
    <div>
      <div className="rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-3 sm:p-4">
        <label htmlFor="category-job-search" className="sr-only">Search {categoryName} jobs</label>
        <div className="flex items-center gap-3 rounded-xl border border-[#90CAF9] bg-white px-4 focus-within:border-[#2196F3] focus-within:ring-4 focus-within:ring-[#90CAF9]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-[#2196F3] stroke-2"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>
          <input
            id="category-job-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={`Search ${jobs.length} ${categoryName.toLowerCase()} jobs`}
            className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#0D47A1] outline-none placeholder:text-[#000000]"
          />
          <span className="text-xs font-semibold text-[#000000]" aria-live="polite">{filteredJobs.length}</span>
        </div>
      </div>

      {visibleJobs.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visibleJobs.map((job, index) => (
            <Link key={job.slug} href={`/cost-guides/${job.slug}`} className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-[#90CAF9] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#90CAF9] hover:shadow-[0_14px_36px_rgba(13,71,161,.09)]">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[11px] font-black text-[#0D47A1]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-sm font-bold leading-6 text-[#0D47A1] transition group-hover:text-[#0D47A1]">{job.title}</h2>
                  <p className="mt-1 text-xs text-[#000000]">Open job costs and related options</p>
                </div>
              </div>
              <span className="shrink-0 text-lg text-[#0D47A1]" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[#90CAF9] bg-[#E3F2FD] px-6 py-12 text-center">
          <h2 className="text-lg font-bold text-[#0D47A1]">No matching jobs</h2>
          <p className="mt-2 text-sm text-[#000000]">Try a shorter job name or clear the search.</p>
        </div>
      )}

      {visibleCount < filteredJobs.length ? (
        <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="mx-auto mt-8 flex min-h-11 items-center justify-center rounded-full border border-[#90CAF9] bg-white px-6 py-3 text-sm font-bold text-[#0D47A1] transition hover:border-[#2196F3] hover:bg-[#E3F2FD]">
          Show {Math.min(PAGE_SIZE, filteredJobs.length - visibleCount)} more jobs
        </button>
      ) : null}
    </div>
  );
}
