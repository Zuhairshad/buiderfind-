"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const CALCULATORS = {
  extension: { label: "House extension", unit: "m²", min: 2200, max: 3500, guide: "/cost-guides/extension" },
  driveway: { label: "Block-paved driveway", unit: "m²", min: 80, max: 130, guide: "/cost-guides/driveway" },
  flooring: { label: "Engineered timber floor", unit: "m²", min: 60, max: 120, guide: "/cost-guides/flooring" },
  plastering: { label: "Wall skimming", unit: "m²", min: 20, max: 35, guide: "/cost-guides/plastering" },
} as const;

type CalculatorKey = keyof typeof CALCULATORS;

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default function Page() {
  const [project, setProject] = useState<CalculatorKey>("extension");
  const [quantity, setQuantity] = useState(20);
  const calculator = CALCULATORS[project];
  const estimate = useMemo(() => ({ low: calculator.min * quantity, high: calculator.max * quantity }), [calculator, quantity]);

  return <><Navbar /><main><section className="border-b border-[#90CAF9] bg-[linear-gradient(135deg,#FFFFFF_0%,#E3F2FD_100%)]"><div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">Budgeting tools</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0D47A1] sm:text-5xl">Quick UK project cost calculator</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[#000000]">Create an early area-based allowance, then use a detailed brief and site-specific quotes before making a financial commitment.</p></div></section><section className="bg-white py-14"><div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_.8fr]"><div className="rounded-3xl border border-[#90CAF9] p-7 shadow-sm"><label htmlFor="project" className="text-sm font-bold text-[#0D47A1]">Project type</label><select id="project" value={project} onChange={(event) => setProject(event.target.value as CalculatorKey)} className="mt-2 w-full rounded-xl border border-[#90CAF9] bg-white px-4 py-3 text-sm outline-none focus:border-[#2196F3]">{Object.entries(CALCULATORS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select><label htmlFor="quantity" className="mt-6 block text-sm font-bold text-[#0D47A1]">Approximate area ({calculator.unit})</label><input id="quantity" type="number" min="1" max="500" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-xl border border-[#90CAF9] px-4 py-3 text-sm outline-none focus:border-[#2196F3]" /><p className="mt-4 text-xs leading-5 text-[#000000]">This indicative range excludes design fees, statutory fees, unusual access, significant structural repairs and premium specifications unless those are inherent in the selected rate.</p></div><aside className="rounded-3xl bg-[#0D47A1] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#90CAF9]">Early allowance</p><p className="mt-5 text-3xl font-bold">{pounds.format(estimate.low)}–{pounds.format(estimate.high)}</p><p className="mt-3 text-sm leading-6 text-white/80">Based on {quantity}{calculator.unit} at {pounds.format(calculator.min)}–{pounds.format(calculator.max)} per {calculator.unit}.</p><Link href={calculator.guide} className="mt-7 inline-flex rounded-full bg-[#0D47A1] px-6 py-3 text-sm font-bold text-white">Read the detailed guide</Link></aside></div></section></main><Footer /></>;
}
