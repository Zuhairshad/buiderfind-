"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_CATS = [
  { name: "Builders", href: "/builders", subs: ["Extensions", "Loft Conversions", "Garage Conversions", "New Builds"] },
  { name: "Plumbers", href: "/plumbers", subs: ["Boiler Repair", "Bathroom Fit", "Emergency Plumbing"] },
  { name: "Electricians", href: "/electricians", subs: ["Rewiring", "Fuse Board", "EV Charging"] },
  { name: "Roofers", href: "/roofers", subs: ["Roof Repair", "Flat Roof", "Guttering"] },
  { name: "Plasterers", href: "/plasterers", subs: ["Skim Coat", "Dry Lining", "Rendering"] },
  { name: "Painters", href: "/painters", subs: ["Interior Painting", "Exterior Painting", "Wallpapering"] },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#90CAF9] sticky top-0 z-50 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="hidden xl:flex items-center h-[72px] gap-8">
          <Link href="/" className="flex-shrink-0 text-[26px] font-bold tracking-tight leading-none">
            <span className="text-[#0D47A1]">Builder</span><span className="text-[#2196F3]">Find</span>
          </Link>
          <nav className="flex items-center gap-7">
            <Link href="/how-it-works" className="text-[14px] font-semibold text-[#000000] hover:text-[#0D47A1] transition-colors tracking-wide">How it works</Link>
            <Link href="/cost-guides" className="text-[14px] font-semibold text-[#000000] hover:text-[#0D47A1] transition-colors tracking-wide">Cost guides</Link>
            <div className="relative group">
              <button aria-haspopup="menu" className="flex items-center gap-1.5 text-[14px] font-semibold text-[#000000] hover:text-[#0D47A1] transition-colors py-2 tracking-wide">
                Categories
                <svg className="w-3.5 h-3.5 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full mt-2 w-[600px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#90CAF9] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-7">
                <div className="grid grid-cols-3 gap-6">
                  {NAV_CATS.map((cat) => (
                    <div key={cat.name}>
                      <Link href={cat.href} className="font-semibold text-[13px] text-[#000000] hover:text-[#0D47A1] block mb-2.5 uppercase tracking-wider">
                        {cat.name}
                      </Link>
                      {cat.subs.map((sub) => (
                        <Link key={sub} href={`${cat.href}/${sub.toLowerCase().replace(/ /g, "-")}`} className="block text-[13px] text-[#000000] hover:text-[#0D47A1] py-[3px] transition-colors">
                          {sub}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-[#90CAF9]">
                  <Link href="/all-trades" className="text-[#0D47A1] font-semibold text-[13px] hover:underline">View all trades →</Link>
                </div>
              </div>
            </div>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="text-[14px] font-semibold text-[#000000] hover:text-[#0D47A1] transition-colors">Login</Link>
            <Link href="/post-a-job" className="bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[13px] px-5 py-[11px] rounded-full transition-all shadow-sm hover:shadow-md tracking-wide">
              Post a Job
            </Link>
            <Link href="/builder-signup" className="bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[13px] px-5 py-[11px] rounded-full transition-all shadow-sm hover:shadow-md tracking-wide">
              Builder Signup
            </Link>
          </div>
        </div>

        <div className="flex xl:hidden items-center justify-between h-[60px]">
          <Link href="/" className="text-[22px] font-bold">
            <span className="text-[#0D47A1]">Builder</span><span className="text-[#2196F3]">Find</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/post-a-job" className="bg-[#0D47A1] text-white font-semibold text-[12px] px-4 py-2 rounded-full tracking-wide">Post a Job</Link>
            <button aria-label="Toggle navigation" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[#000000]">
              {mobileOpen
                ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="xl:hidden bg-white border-t border-[#90CAF9] px-5 py-3 space-y-0.5">
          <Link href="/post-a-job" className="flex py-3 font-semibold text-[#0D47A1] border-b border-[#90CAF9] text-[14px]">Post a Job</Link>
          <Link href="/builder-signup" className="flex py-3 font-semibold text-[#0D47A1] border-b border-[#90CAF9] text-[14px]">Builder Signup</Link>
          <Link href="/how-it-works" className="flex py-3 text-[#000000] font-medium border-b border-[#90CAF9] text-[14px]">How it works</Link>
          <Link href="/cost-guides" className="flex py-3 text-[#000000] font-medium border-b border-[#90CAF9] text-[14px]">Cost guides</Link>
          <button aria-expanded={catsOpen} aria-controls="mobile-trade-categories" onClick={() => setCatsOpen(!catsOpen)} className="flex items-center justify-between w-full py-3 text-[#000000] font-medium border-b border-[#90CAF9] text-[14px]">
            <span>Categories</span>
            <svg className={`w-4 h-4 transition-transform ${catsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {catsOpen && (
            <div id="mobile-trade-categories" className="pl-4 pb-2">
              {NAV_CATS.map((cat) => (
                <Link key={cat.name} href={cat.href} className="block py-2 text-[13px] text-[#000000] hover:text-[#0D47A1]">{cat.name}</Link>
              ))}
              <Link href="/all-trades" className="block py-2 text-[13px] font-semibold text-[#0D47A1]">See all trades →</Link>
            </div>
          )}
          <Link href="/login" className="flex py-3 text-[#000000] font-medium text-[14px]">Login</Link>
        </div>
      )}
    </header>
  );
}
