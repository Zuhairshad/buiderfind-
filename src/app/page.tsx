"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "../../heroimg.jpg";
import teamImage from "../../meettheteam.jpg";
import { UserAvatar } from "@/components/UserAvatar";
import {
  BenefitIcon,
  TradeIllustration,
  type BenefitIconVariant,
  type TradeIllustrationVariant,
} from "@/components/TradeIllustrations";

// ─── NAV DATA ─────────────────────────────────────────────────────────────────

const NAV_CATS = [
  { name: "Builders", href: "/builders", subs: ["Extensions", "Loft Conversions", "Garage Conversions", "New Builds"] },
  { name: "Plumbers", href: "/plumbers", subs: ["Boiler Repair", "Bathroom Fit", "Emergency Plumbing"] },
  { name: "Electricians", href: "/electricians", subs: ["Rewiring", "Fuse Board", "EV Charging"] },
  { name: "Roofers", href: "/roofers", subs: ["Roof Repair", "Flat Roof", "Guttering"] },
  { name: "Plasterers", href: "/plasterers", subs: ["Skim Coat", "Dry Lining", "Rendering"] },
  { name: "Painters", href: "/painters", subs: ["Interior Painting", "Exterior Painting", "Wallpapering"] },
];

// ─── ALL REVIEWS (16 unique for 4-column scroll) ──────────────────────────────

const ALL_REVIEWS = [
  // Column 1
  { job: "House Extension in Manchester", company: "Riverside Builds", author: "Sarah M.", review: "Got 3 quotes within hours and chose a fantastic local builder. Finished ahead of schedule and under budget. BuilderFind is brilliant!", stars: 5, avatarIndex: 83 },
  { job: "Roof Repair in Bristol", company: "South West Roofing", author: "Emma D.", review: "Quick response, fair quote and excellent quality. The roofer spotted additional issues and fixed them at no extra cost. Highly recommended.", stars: 5, avatarIndex: 17 },
  { job: "Plastering in Nottingham", company: "Midlands Plastering Co", author: "Lucy P.", review: "Immaculate finish on our living room ceiling. You'd never know the old Artex was there. Very professional and tidy throughout.", stars: 5, avatarIndex: 121 },
  { job: "Loft Conversion in Glasgow", company: "Clyde Conversions", author: "Heather S.", review: "Our loft is now a stunning master bedroom with en-suite. The team worked efficiently and professionally every single day.", stars: 5, avatarIndex: 46 },
  // Column 2
  { job: "Bathroom Renovation in Leeds", company: "Premier Bathrooms Ltd", author: "James T.", review: "Very professional and prompt. The builder arrived on time and completed to a very high standard. Will definitely use BuilderFind again.", stars: 5, avatarIndex: 9 },
  { job: "Kitchen Fit in Sheffield", company: "Steel City Kitchens", author: "Kevin L.", review: "Delighted with our new kitchen. Punctual, tidy and superb quality finish. BuilderFind made the whole process so easy and stress-free.", stars: 5, avatarIndex: 136 },
  { job: "Extension in Liverpool", company: "Mersey Builders", author: "Dave W.", review: "Major kitchen extension done absolutely perfectly. Kept us informed every step of the way — quality of the work is outstanding.", stars: 5, avatarIndex: 64 },
  { job: "Patio in Portsmouth", company: "Southern Landscaping", author: "Bob G.", review: "Beautiful natural stone patio, perfectly laid. The team were respectful of our garden, worked cleanly and finished exactly on time.", stars: 5, avatarIndex: 108 },
  // Column 3
  { job: "Loft Conversion in London", company: "Capital Lofts", author: "Claire B.", review: "Brilliant from start to finish. Great price, excellent workmanship, and they left the site spotless at the end of every single day.", stars: 5, avatarIndex: 73 },
  { job: "New Boiler in Edinburgh", company: "Caledonian Heating", author: "Fiona M.", review: "Boiler replaced within 24 hours of posting the job. Engineer was polite, clean and thorough. Excellent value and would recommend.", stars: 5, avatarIndex: 31 },
  { job: "Flat Roof in Newcastle", company: "Tyne Roofing Services", author: "Sandra K.", review: "New flat roof installed professionally with no mess or fuss. Came with a 10-year guarantee. Couldn't ask for more from a local builder.", stars: 5, avatarIndex: 112 },
  { job: "Bathroom in Oxford", company: "Thames Bathrooms", author: "Anna C.", review: "Complete bathroom transformation in just one week. A stunning result at a very fair price. We'll definitely be using BuilderFind again.", stars: 5, avatarIndex: 58 },
  // Column 4
  { job: "New Driveway in Birmingham", company: "Midland Driveways", author: "Mark H.", review: "Fantastic job on our block paved driveway. The team were friendly, professional and finished two full days ahead of schedule.", stars: 5, avatarIndex: 141 },
  { job: "Garden Wall in Cardiff", company: "Welsh Brickwork Ltd", author: "Rhys O.", review: "Beautiful new garden wall, exactly what we asked for. Completed in just 2 days and the price was very fair. Brilliant local builder.", stars: 5, avatarIndex: 25 },
  { job: "Electrician in Brighton", company: "Sussex Electrics", author: "Tom F.", review: "Full rewire completed while we were away on holiday. House was immaculate on our return. A first-class and professional service.", stars: 5, avatarIndex: 97 },
  { job: "New Windows in Coventry", company: "Midland Glass", author: "Neil B.", review: "All 12 windows replaced in a single day with no disruption. Excellent insulation now and the house looks completely transformed.", stars: 5, avatarIndex: 4 },
];

const REVIEW_COLS = [
  ALL_REVIEWS.slice(0, 4),
  ALL_REVIEWS.slice(4, 8),
  ALL_REVIEWS.slice(8, 12),
  ALL_REVIEWS.slice(12, 16),
];

// ─── SVG TRADE ICONS ──────────────────────────────────────────────────────────

const IC = {
  props: { viewBox: "0 0 56 56", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const },
};

function IBuilders() {
  return (
    <svg {...IC.props}>
      <rect x="8" y="17" width="11" height="6" rx="1.5" /><rect x="21" y="17" width="11" height="6" rx="1.5" /><rect x="34" y="17" width="14" height="6" rx="1.5" />
      <rect x="8" y="25" width="15" height="6" rx="1.5" /><rect x="25" y="25" width="11" height="6" rx="1.5" /><rect x="38" y="25" width="10" height="6" rx="1.5" />
      <rect x="8" y="33" width="11" height="6" rx="1.5" /><rect x="21" y="33" width="17" height="6" rx="1.5" /><rect x="40" y="33" width="8" height="6" rx="1.5" />
      <line x1="6" y1="41" x2="50" y2="41" />
    </svg>
  );
}

function IPlumbers() {
  return (
    <svg {...IC.props}>
      <path d="M38 8c7 3 8 13 1 18L15 50c-2 2-6 1-7-2s0-7 3-8L36 16c-7-4-6-10 2-8z" />
      <path d="M34 14l6 6" />
      <path d="M36 11l6 6" strokeOpacity="0.5" />
    </svg>
  );
}

function IElectricians() {
  return (
    <svg {...IC.props} fill="currentColor" stroke="none">
      <path d="M34 6H22l-6 20h10l-4 24 18-26H28z" />
    </svg>
  );
}

function IRoofers() {
  return (
    <svg {...IC.props}>
      <polyline points="5,32 28,8 51,32" />
      <rect x="14" y="32" width="28" height="16" rx="1" />
      <line x1="5" y1="23" x2="51" y2="23" />
      <line x1="10" y1="16" x2="46" y2="16" />
      <line x1="20" y1="32" x2="17" y2="23" />
      <line x1="28" y1="32" x2="28" y2="14" />
      <line x1="36" y1="32" x2="39" y2="23" />
      <rect x="22" y="38" width="12" height="10" rx="1" />
    </svg>
  );
}

function IPlasterers() {
  return (
    <svg {...IC.props}>
      <path d="M12 42L22 14l14 6-10 26z" />
      <line x1="22" y1="14" x2="44" y2="10" />
      <rect x="40" y="7" width="8" height="5" rx="2.5" transform="rotate(-15 44 9.5)" />
      <line x1="18" y1="28" x2="30" y2="33" strokeDasharray="3 3" />
    </svg>
  );
}

function IPainters() {
  return (
    <svg {...IC.props}>
      <rect x="10" y="14" width="30" height="13" rx="5" />
      <rect x="13" y="17" width="24" height="7" rx="3.5" fillOpacity="0.12" fill="currentColor" stroke="none" />
      <line x1="40" y1="20" x2="46" y2="20" />
      <line x1="46" y1="20" x2="46" y2="34" />
      <line x1="28" y1="34" x2="46" y2="34" />
      <line x1="17" y1="27" x2="17" y2="36" />
      <line x1="25" y1="27" x2="25" y2="39" />
      <line x1="33" y1="27" x2="33" y2="33" />
    </svg>
  );
}

function ICarpenters() {
  return (
    <svg {...IC.props}>
      <rect x="28" y="9" width="18" height="13" rx="2" />
      <path d="M28 15l-8-4c-4-2-6 2-4 5l12 2" />
      <line x1="38" y1="22" x2="18" y2="47" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 44l5 5 3-3" />
    </svg>
  );
}

function ITilers() {
  return (
    <svg {...IC.props}>
      <rect x="7" y="7" width="18" height="18" rx="2" />
      <rect x="31" y="7" width="18" height="18" rx="2" />
      <rect x="7" y="31" width="18" height="18" rx="2" />
      <rect x="31" y="31" width="18" height="18" rx="2" />
    </svg>
  );
}

function IFlooring() {
  return (
    <svg {...IC.props}>
      <rect x="7" y="13" width="42" height="8" rx="2" />
      <rect x="7" y="23" width="42" height="8" rx="2" />
      <rect x="7" y="33" width="42" height="8" rx="2" />
      <line x1="22" y1="13" x2="22" y2="21" />
      <line x1="38" y1="13" x2="38" y2="21" />
      <line x1="16" y1="23" x2="16" y2="31" />
      <line x1="34" y1="23" x2="34" y2="31" />
      <line x1="26" y1="33" x2="26" y2="41" />
      <line x1="44" y1="33" x2="44" y2="41" />
    </svg>
  );
}

function IGardeners() {
  return (
    <svg {...IC.props}>
      <line x1="20" y1="8" x2="20" y2="20" />
      <line x1="28" y1="8" x2="28" y2="20" />
      <line x1="36" y1="8" x2="36" y2="20" />
      <path d="M16 20h24l-4 8H20z" />
      <line x1="28" y1="28" x2="28" y2="48" />
      <rect x="22" y="44" width="12" height="4" rx="2" />
    </svg>
  );
}

function IHandymen() {
  return (
    <svg {...IC.props}>
      <path d="M39 7c8 3 9 14 1 19L16 49c-2 2-6 2-8-1-2-3-1-7 2-9L34 16c-7-4-5-11 5-9z" />
      <path d="M36 14l6 6" />
      <path d="M38 11l6 6" strokeOpacity="0.4" />
      <circle cx="19" cy="46" r="3" />
    </svg>
  );
}

function IHeating() {
  return (
    <svg {...IC.props}>
      <rect x="8" y="18" width="40" height="26" rx="2" />
      <line x1="16" y1="18" x2="16" y2="44" />
      <line x1="24" y1="18" x2="24" y2="44" />
      <line x1="32" y1="18" x2="32" y2="44" />
      <line x1="40" y1="18" x2="40" y2="44" />
      <line x1="8" y1="14" x2="48" y2="14" />
      <path d="M20 10c-2-3 2-5 0-8 3 1 5 5 2 8" />
      <path d="M28 10c-2-3 2-5 0-8 3 1 5 5 2 8" />
      <path d="M36 10c-2-3 2-5 0-8 3 1 5 5 2 8" />
    </svg>
  );
}

function IBathroom() {
  return (
    <svg {...IC.props}>
      <path d="M6 32l1 8a6 6 0 006 6h30a6 6 0 006-6l1-8H6z" />
      <path d="M14 32V20a6 6 0 016-6h2" />
      <line x1="22" y1="14" x2="32" y2="14" />
      <line x1="28" y1="14" x2="28" y2="10" />
      <line x1="25" y1="10" x2="31" y2="10" />
      <line x1="10" y1="36" x2="46" y2="36" />
      <line x1="13" y1="46" x2="13" y2="50" />
      <line x1="43" y1="46" x2="43" y2="50" />
    </svg>
  );
}

function IKitchen() {
  return (
    <svg {...IC.props}>
      <rect x="7" y="12" width="42" height="36" rx="2" />
      <line x1="7" y1="24" x2="49" y2="24" />
      <circle cx="20" cy="18" r="3" />
      <circle cx="36" cy="18" r="3" />
      <circle cx="28" cy="18" r="1.5" fillOpacity="0.3" fill="currentColor" stroke="none" />
      <rect x="10" y="28" width="18" height="16" rx="1" />
      <rect x="32" y="28" width="14" height="8" rx="1" />
      <line x1="19" y1="28" x2="19" y2="44" />
      <line x1="10" y1="36" x2="28" y2="36" />
      <line x1="39" y1="24" x2="39" y2="22" />
    </svg>
  );
}

function IWindows() {
  return (
    <svg {...IC.props}>
      <rect x="8" y="7" width="40" height="42" rx="2" />
      <line x1="28" y1="7" x2="28" y2="49" />
      <line x1="8" y1="28" x2="48" y2="28" />
      <line x1="4" y1="49" x2="52" y2="49" />
      <rect x="18" y="49" width="20" height="4" rx="1" />
      <circle cx="28" cy="28" r="2.5" fill="white" stroke="currentColor" />
    </svg>
  );
}

function IDriveways() {
  return (
    <svg {...IC.props}>
      <rect x="7" y="8" width="19" height="12" rx="1.5" />
      <rect x="30" y="8" width="19" height="12" rx="1.5" />
      <rect x="7" y="24" width="12" height="12" rx="1.5" />
      <rect x="23" y="24" width="12" height="12" rx="1.5" />
      <rect x="39" y="24" width="10" height="12" rx="1.5" />
      <rect x="7" y="40" width="19" height="10" rx="1.5" />
      <rect x="30" y="40" width="19" height="10" rx="1.5" />
    </svg>
  );
}

function IExtensions() {
  return (
    <svg {...IC.props}>
      <rect x="5" y="28" width="24" height="20" rx="1" />
      <polyline points="3,30 17,12 31,30" />
      <rect x="29" y="36" width="22" height="12" rx="1" />
      <polyline points="27,38 40,26 53,38" />
      <rect x="10" y="34" width="9" height="10" rx="1" />
    </svg>
  );
}

function IDrainage() {
  return (
    <svg {...IC.props}>
      <circle cx="28" cy="34" r="16" />
      <line x1="14" y1="30" x2="42" y2="30" />
      <line x1="14" y1="34" x2="42" y2="34" />
      <line x1="14" y1="38" x2="42" y2="38" />
      <line x1="20" y1="18" x2="20" y2="50" />
      <line x1="28" y1="18" x2="28" y2="50" />
      <line x1="36" y1="18" x2="36" y2="50" />
      <path d="M23 8c0-3.5-5-3.5-5 0s5 4 5 0z" fill="currentColor" stroke="none" />
      <path d="M31 11c0-3.5-5-3.5-5 0s5 4 5 0z" fill="currentColor" stroke="none" />
      <path d="M39 8c0-3.5-5-3.5-5 0s5 4 5 0z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── TRADES LIST ─────────────────────────────────────────────────────────────

const TRADES = [
  { name: "Builders", href: "/builders", Icon: IBuilders },
  { name: "Plumbers", href: "/plumbers", Icon: IPlumbers },
  { name: "Electricians", href: "/electricians", Icon: IElectricians },
  { name: "Roofers", href: "/roofers", Icon: IRoofers },
  { name: "Plasterers", href: "/plasterers", Icon: IPlasterers },
  { name: "Painters & Decorators", href: "/painters", Icon: IPainters },
  { name: "Carpenters", href: "/carpenters", Icon: ICarpenters },
  { name: "Tilers", href: "/tilers", Icon: ITilers },
  { name: "Flooring Specialists", href: "/flooring", Icon: IFlooring },
  { name: "Gardeners", href: "/gardeners", Icon: IGardeners },
  { name: "Handymen", href: "/handymen", Icon: IHandymen },
  { name: "Heating Engineers", href: "/heating", Icon: IHeating },
  { name: "Bathroom Fitters", href: "/bathrooms", Icon: IBathroom },
  { name: "Kitchen Fitters", href: "/kitchens", Icon: IKitchen },
  { name: "Window Fitters", href: "/windows", Icon: IWindows },
  { name: "Driveway Specialists", href: "/driveways", Icon: IDriveways },
  { name: "Extensions", href: "/extensions", Icon: IExtensions },
  { name: "Drainage", href: "/drainage", Icon: IDrainage },
];

// ─── COST GUIDES DATA ─────────────────────────────────────────────────────────

const COST_GUIDES: Array<{
  cat: string;
  title: string;
  from: string;
  href: string;
  accent: string;
  illustration: TradeIllustrationVariant;
}> = [
  { cat: "Bathrooms", title: "Bathroom Renovation Cost Guide", from: "£2,500", href: "/cost-guides/bathroom", accent: "#0D47A1", illustration: "bathroom" },
  { cat: "Kitchens", title: "Kitchen Fitting Cost Guide", from: "£3,000", href: "/cost-guides/kitchen", accent: "#0D47A1", illustration: "kitchen" },
  { cat: "Extensions", title: "House Extension Cost Guide", from: "£30,000", href: "/cost-guides/extension", accent: "#0D47A1", illustration: "extension" },
  { cat: "Loft Conversions", title: "Loft Conversion Cost Guide", from: "£20,000", href: "/cost-guides/loft-conversion", accent: "#0D47A1", illustration: "loft" },
  { cat: "Roofing", title: "New Roof Replacement Cost", from: "£5,000", href: "/cost-guides/roofing", accent: "#0D47A1", illustration: "roofing" },
  { cat: "Driveways", title: "New Driveway Cost Guide", from: "£2,000", href: "/cost-guides/driveway", accent: "#0D47A1", illustration: "driveway" },
  { cat: "Flooring", title: "Flooring Installation Cost Guide", from: "£500", href: "/cost-guides/flooring", accent: "#0D47A1", illustration: "flooring" },
  { cat: "Plastering", title: "Plastering Cost Guide", from: "£300", href: "/cost-guides/plastering", accent: "#0D47A1", illustration: "plastering" },
];

// ─── NEAR ME GUIDES DATA ──────────────────────────────────────────────────────

const NEAR_ME_GUIDES: Array<{
  title: string;
  desc: string;
  href: string;
  accent: string;
  illustration: TradeIllustrationVariant;
}> = [
  { title: "Builders Near Me", desc: "Local builders for any project", href: "/near-me/builders", accent: "#0D47A1", illustration: "builder" },
  { title: "Plumbers Near Me", desc: "Emergency & planned plumbing", href: "/near-me/plumbers", accent: "#0D47A1", illustration: "plumber" },
  { title: "Electricians Near Me", desc: "Qualified local electricians", href: "/near-me/electricians", accent: "#0D47A1", illustration: "electrician" },
  { title: "Roofers Near Me", desc: "Roof repairs & replacements", href: "/near-me/roofers", accent: "#0D47A1", illustration: "roofing" },
  { title: "Landscapers Near Me", desc: "Garden design & maintenance", href: "/near-me/gardeners", accent: "#0D47A1", illustration: "landscaper" },
  { title: "Bathroom Fitters Near Me", desc: "Bathroom renovations & fitting", href: "/near-me/bathroom-fitters", accent: "#0D47A1", illustration: "bathroom" },
  { title: "Heating Engineers Near Me", desc: "Boilers, central heating & more", href: "/near-me/heating-engineers", accent: "#0D47A1", illustration: "heating" },
  { title: "Kitchen Fitters Near Me", desc: "New kitchen installations", href: "/near-me/kitchen-fitters", accent: "#0D47A1", illustration: "kitchen" },
];

const WHY_BENEFITS: Array<{ icon: BenefitIconVariant; title: string; desc: string }> = [
  { icon: "free", title: "Free to use", desc: "Post your job and receive quotes with zero cost and no hidden charges." },
  { icon: "verified", title: "Verified builders", desc: "Every builder is vetted, insured and backed by real customer reviews." },
  { icon: "fast", title: "Fast quotes", desc: "Get up to 3 quotes within hours of posting — no waiting around." },
  { icon: "reviews", title: "Real reviews", desc: "Read verified reviews from real homeowners before you decide." },
  { icon: "flexible", title: "No obligations", desc: "Accept a quote only when you're completely ready. Zero pressure." },
  { icon: "local", title: "Local experts", desc: "We match you with builders who work in your local area." },
];

// ─── UK CITIES & MAP DATA ─────────────────────────────────────────────────────

const UK_CITIES = [
  "London", "Birmingham", "Manchester", "Leeds", "Sheffield",
  "Liverpool", "Edinburgh", "Glasgow", "Bristol", "Newcastle upon Tyne",
  "Cardiff", "Southampton", "Brighton", "Oxford", "Nottingham",
  "Coventry", "Derby", "Gloucester", "Stoke-on-Trent", "York",
  "Plymouth", "Exeter", "Reading", "Wolverhampton", "Lancaster",
  "Portsmouth",
];

const CITY_DOTS: Record<string, [number, number]> = {
  "London": [148, 272], "Birmingham": [112, 198], "Manchester": [98, 155],
  "Leeds": [122, 148], "Sheffield": [122, 165], "Liverpool": [88, 160],
  "Edinburgh": [122, 90], "Glasgow": [98, 96], "Bristol": [88, 265],
  "Newcastle upon Tyne": [145, 120], "Cardiff": [80, 258], "Southampton": [132, 298],
  "Brighton": [148, 308], "Oxford": [132, 275], "Nottingham": [128, 188],
  "Coventry": [118, 208], "Derby": [118, 182], "Gloucester": [100, 255],
  "Stoke-on-Trent": [108, 178], "York": [128, 142], "Plymouth": [72, 315],
  "Exeter": [78, 302], "Reading": [138, 282], "Wolverhampton": [108, 210],
  "Lancaster": [95, 138], "Portsmouth": [140, 305],
};

// ─── STAR RATING ─────────────────────────────────────────────────────────────

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-[15px] h-[15px] fill-[#90CAF9]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#90CAF9] sticky top-0 z-50 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop */}
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
                      <Link href={cat.href} className="font-bold text-[13px] text-[#000000] hover:text-[#0D47A1] block mb-2.5 uppercase tracking-wider">
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
                  <Link href="/all-trades" className="text-[#0D47A1] font-bold text-[13px] hover:underline">View all trades →</Link>
                </div>
              </div>
            </div>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="text-[14px] font-semibold text-[#000000] hover:text-[#0D47A1] transition-colors">Login</Link>
            <Link href="/post-a-job" className="bg-[#0D47A1] hover:bg-[#000000] text-white font-bold text-[13px] px-5 py-[11px] rounded-full transition-all shadow-sm hover:shadow-md tracking-wide">
              Post a Job
            </Link>
            <Link href="/builder-signup" className="bg-[#0D47A1] hover:bg-[#000000] text-white font-bold text-[13px] px-5 py-[11px] rounded-full transition-all shadow-sm hover:shadow-md tracking-wide">
              Builder Signup
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex xl:hidden items-center justify-between h-[60px]">
          <Link href="/" className="text-[22px] font-bold">
            <span className="text-[#0D47A1]">Builder</span><span className="text-[#2196F3]">Find</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/post-a-job" className="bg-[#0D47A1] text-white font-bold text-[12px] px-4 py-2 rounded-full tracking-wide">Post a Job</Link>
            <button aria-label="Toggle navigation" aria-expanded={mobileOpen} aria-controls="home-mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[#000000]">
              {mobileOpen
                ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div id="home-mobile-navigation" className="xl:hidden bg-white border-t border-[#90CAF9] px-5 py-3 space-y-0.5">
          <Link href="/post-a-job" className="flex py-3 font-bold text-[#0D47A1] border-b border-[#90CAF9] text-[14px]">Post a Job</Link>
          <Link href="/builder-signup" className="flex py-3 font-bold text-[#0D47A1] border-b border-[#90CAF9] text-[14px]">Builder Signup</Link>
          <Link href="/how-it-works" className="flex py-3 text-[#000000] font-medium border-b border-[#90CAF9] text-[14px]">How it works</Link>
          <Link href="/cost-guides" className="flex py-3 text-[#000000] font-medium border-b border-[#90CAF9] text-[14px]">Cost guides</Link>
          <button aria-expanded={catsOpen} aria-controls="home-mobile-trade-categories" onClick={() => setCatsOpen(!catsOpen)} className="flex items-center justify-between w-full py-3 text-[#000000] font-medium border-b border-[#90CAF9] text-[14px]">
            <span>Categories</span>
            <svg className={`w-4 h-4 transition-transform ${catsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {catsOpen && (
            <div id="home-mobile-trade-categories" className="pl-4 pb-2">
              {NAV_CATS.map((cat) => (
                <Link key={cat.name} href={cat.href} className="block py-2 text-[13px] text-[#000000] hover:text-[#0D47A1]">{cat.name}</Link>
              ))}
              <Link href="/all-trades" className="block py-2 text-[13px] font-bold text-[#0D47A1]">See all trades →</Link>
            </div>
          )}
          <Link href="/login" className="flex py-3 text-[#000000] font-medium text-[14px]">Login</Link>
        </div>
      )}
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [postcode, setPostcode] = useState("");

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 lg:py-40 relative z-10">
        <div className="mx-auto max-w-[580px] xl:mx-0">
          <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold text-[#0D47A1] leading-[1.1] mb-5 tracking-tight">
            Find Trusted Builders,{" "}
            <span className="text-[#0D47A1]">compare up to 3 quotes!</span>
          </h1>
          <p className="text-[17px] font-medium text-[#000000] mb-8 leading-relaxed">
            It&apos;s <span className="font-bold text-[#000000]">FREE</span> and there are no obligations
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-[#90CAF9] overflow-hidden max-w-[500px] mb-6">
            <div className="flex items-center pl-5 text-black/50 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Enter your postcode"
              className="flex-1 px-4 py-4 text-[16px] font-semibold text-black/70 placeholder:text-black/50 outline-none bg-transparent min-w-0"
            />
            <button type="submit" className="flex-shrink-0 bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[14px] px-8 py-4 transition-all tracking-wide">
              Get Started
            </button>
          </form>

          <div className="flex items-center gap-2.5 mb-7">
            <Stars count={5} />
            <span className="text-[13px] text-[#000000] font-medium">
              Rated <strong className="text-[#000000]">Excellent</strong> · 4.7/5 from 4,000+ reviews
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Completely free", "Up to 3 quotes", "Verified builders", "No obligations"].map((b) => (
              <div key={b} className="flex items-center gap-2 bg-white rounded-full px-4 py-[9px] shadow-sm border border-[#90CAF9]">
                <span className="w-[18px] h-[18px] bg-[#0D47A1] rounded-full flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">✓</span>
                <span className="text-[12px] font-bold text-[#000000] tracking-wide">{b}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-10 aspect-[9/8] xl:absolute xl:inset-y-0 xl:right-0 xl:mt-0 xl:aspect-auto xl:w-[52%] xl:p-12">
            <div className="relative h-full max-h-[560px] w-full overflow-hidden">
              <Image
                src={heroImage}
                alt="A diverse team of UK construction professionals"
                fill
                priority
                sizes="(max-width: 1279px) 92vw, 52vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BUILDER BANNER ───────────────────────────────────────────────────────────

function BuilderBanner() {
  return (
    <section className="bg-[#0D47A1] text-white py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-left text-[15px] font-medium">
          <strong className="font-semibold text-white">Join BuilderFind Free</strong>
          <span className="text-[#90CAF9] mx-2">—</span>
          <span className="text-[#E3F2FD]">Get your first 3 months of job leads completely free</span>
        </p>
        <Link href="/builder-signup" className="flex-shrink-0 border-2 border-white/70 text-white font-bold text-[13px] px-6 py-[10px] rounded-full hover:bg-white hover:text-[#0D47A1] transition-all whitespace-nowrap tracking-wide">
          Sign up as a builder
        </Link>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-[32px] font-bold text-[#0D47A1] text-center mb-3 tracking-tight">How it works</h2>
        <p className="text-center text-[15px] text-[#000000] mb-14 max-w-md mx-auto leading-relaxed">
          Find a trusted builder in your area with our quick, free service.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px bg-gradient-to-r from-[#2196F3]/20 via-[#2196F3]/40 to-[#2196F3]/20 z-0" />

          {[
            {
              n: "01",
              title: "Post your job",
              desc: "Describe the work you need. Add photos, your postcode and preferred start date. Takes 2 minutes.",
              svg: (
                <svg viewBox="0 0 80 80" fill="none" className="w-[68px] h-[68px] mx-auto">
                  <circle cx="40" cy="40" r="40" fill="#E3F2FD" />
                  <rect x="22" y="16" width="36" height="46" rx="4" fill="white" stroke="#2196F3" strokeWidth="2" />
                  <line x1="29" y1="27" x2="51" y2="27" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
                  <line x1="29" y1="34" x2="51" y2="34" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
                  <line x1="29" y1="41" x2="42" y2="41" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="56" cy="56" r="14" fill="#2196F3" />
                  <line x1="56" y1="50" x2="56" y2="62" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="56" x2="62" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              n: "02",
              title: "Receive up to 3 quotes",
              desc: "Up to 3 vetted local builders respond with quotes. Usually within 24 hours.",
              svg: (
                <svg viewBox="0 0 80 80" fill="none" className="w-[68px] h-[68px] mx-auto">
                  <circle cx="40" cy="40" r="40" fill="#E3F2FD" />
                  <rect x="14" y="26" width="20" height="26" rx="3" fill="white" stroke="#2196F3" strokeWidth="2" />
                  <rect x="30" y="22" width="20" height="26" rx="3" fill="white" stroke="#2196F3" strokeWidth="2" />
                  <rect x="46" y="26" width="20" height="26" rx="3" fill="white" stroke="#2196F3" strokeWidth="2" />
                  <line x1="18" y1="33" x2="30" y2="33" stroke="#90CAF9" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="18" y1="38" x2="30" y2="38" stroke="#90CAF9" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="34" y1="29" x2="46" y2="29" stroke="#90CAF9" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="34" y1="34" x2="46" y2="34" stroke="#90CAF9" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="50" y1="33" x2="62" y2="33" stroke="#90CAF9" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="50" y1="38" x2="62" y2="38" stroke="#90CAF9" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              n: "03",
              title: "Choose your builder",
              desc: "Compare quotes, profiles and real reviews. Book with confidence when you're ready.",
              svg: (
                <svg viewBox="0 0 80 80" fill="none" className="w-[68px] h-[68px] mx-auto">
                  <circle cx="40" cy="40" r="40" fill="#E3F2FD" />
                  <circle cx="40" cy="30" r="14" fill="white" stroke="#2196F3" strokeWidth="2" />
                  <path d="M24 64 C24 50 56 50 56 64" fill="white" stroke="#2196F3" strokeWidth="2" />
                  <circle cx="57" cy="52" r="13" fill="#2196F3" />
                  <path d="M51 52 L56 57 L64 46" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.n} className="relative z-10 text-center bg-white">
              <div className="mb-6 relative">
                {item.svg}
                <span className="absolute -top-1 -right-1 lg:right-[calc(50%-52px)] w-6 h-6 bg-[#0D47A1] text-white rounded-full text-[10px] font-semibold flex items-center justify-center shadow-sm">
                  {item.n}
                </span>
              </div>
              <h3 className="text-[17px] font-semibold text-[#0D47A1] mb-3 tracking-tight">{item.title}</h3>
              <p className="text-[14px] text-[#000000] leading-relaxed max-w-[230px] mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/how-it-works" className="inline-flex items-center gap-2 text-[#0D47A1] font-bold text-[14px] hover:underline">
            Learn more about how BuilderFind works
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── POPULAR TRADES ───────────────────────────────────────────────────────────

function PopularTrades() {
  return (
    <section className="bg-white py-16 border-t border-[#90CAF9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-[32px] font-bold text-[#0D47A1] text-center mb-14 tracking-tight">Popular trades</h2>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-x-2 gap-y-10">
          {TRADES.map(({ name, href, Icon }) => (
            <Link
              key={name}
              href={href}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-[56px] h-[56px] flex items-center justify-center text-[#000000] group-hover:text-[#0D47A1] transition-colors duration-200">
                <Icon />
              </div>
              <span className="text-[11px] font-semibold text-[#000000] group-hover:text-[#0D47A1] text-center leading-tight transition-colors duration-200 max-w-[72px]">
                {name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/all-trades" className="inline-block border border-[#2196F3] text-[#0D47A1] hover:bg-[#000000] hover:text-white font-bold text-[14px] px-10 py-3.5 rounded-full transition-all tracking-wide">
            See more trades
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── BUILDER CTA ──────────────────────────────────────────────────────────────

function BuilderCTA() {
  return (
    <section className="bg-[#E3F2FD] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0D47A1] via-[#0D47A1] to-[#2196F3] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(13,71,161,0.25)]">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-[38%] p-10 lg:p-14 flex items-center justify-center">
              <svg viewBox="0 0 280 300" className="w-52 lg:w-60" xmlns="http://www.w3.org/2000/svg">
                <circle cx="140" cy="150" r="130" fill="rgba(255,255,255,0.06)" />
                <rect x="95" y="70" width="90" height="160" rx="12" fill="white" opacity="0.96" />
                <rect x="100" y="82" width="80" height="110" rx="6" fill="#0D47A1" />
                <circle cx="140" cy="222" r="8" fill="#E3F2FD" />
                <text x="140" y="105" textAnchor="middle" fill="#90CAF9" fontSize="11">★★★★★</text>
                <rect x="108" y="112" width="64" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
                <rect x="108" y="121" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
                <rect x="108" y="134" width="64" height="26" rx="5" fill="rgba(255,255,255,0.1)" />
                <text x="140" y="151" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="600">New job: Extension in Leeds</text>
                <rect x="108" y="166" width="64" height="24" rx="5" fill="rgba(255,255,255,0.1)" />
                <text x="140" y="182" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="600">New job: Loft in Manchester</text>
                <circle cx="60" cy="135" r="28" fill="#90CAF9" />
                <ellipse cx="60" cy="116" rx="30" ry="14" fill="#2196F3" />
                <rect x="30" y="113" width="60" height="9" rx="3" fill="#0D47A1" />
                <rect x="38" y="158" width="44" height="90" rx="10" fill="#2196F3" />
                <rect x="14" y="168" width="30" height="13" rx="6" fill="#2196F3" transform="rotate(-20 29 174)" />
                <rect x="80" y="168" width="30" height="13" rx="6" fill="#2196F3" transform="rotate(20 95 174)" />
                <rect x="42" y="242" width="18" height="50" rx="8" fill="#0D47A1" />
                <rect x="62" y="242" width="18" height="50" rx="8" fill="#0D47A1" />
                <circle cx="170" cy="70" r="16" fill="#2196F3" />
                <text x="170" y="75" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">3</text>
              </svg>
            </div>

            <div className="lg:w-[62%] p-10 lg:p-14 text-white">
              <span className="inline-block bg-white/15 text-white text-[11px] font-semibold uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-5">
                For Builders &amp; Tradespeople
              </span>
              <h2 className="text-[28px] lg:text-[36px] font-bold leading-tight mb-5 tracking-tight">
                Are you a builder looking for more work?
              </h2>
              <p className="text-white/90 text-[15px] leading-relaxed mb-7">
                Join BuilderFind and get fresh local job leads in your area. Our launch offer gives you{" "}
                <strong className="text-white font-semibold">3 months completely free</strong> — no subscriptions, no lead fees, no catches.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-9">
                {["Free job leads for first 3 months", "No monthly subscription", "No charge to submit quotes", "Professional builder profile", "Relevant job notifications", "Reviews after completed jobs"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-[#0D47A1] rounded-full flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">✓</span>
                    <span className="text-[13px] text-white/90">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/builder-signup" className="inline-block bg-white text-[#0D47A1] font-semibold text-[14px] px-8 py-4 rounded-full hover:bg-[#E3F2FD] transition-all shadow-xl text-center tracking-wide">
                  Get started free →
                </Link>
                <Link href="/how-it-works-builders" className="inline-block border-2 border-white/30 text-white/90 font-bold text-[14px] px-8 py-4 rounded-full hover:border-white hover:text-white transition-all text-center tracking-wide">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MEET THE TEAM ────────────────────────────────────────────────────────────

function MeetTheTeam() {
  return (
    <section className="border-y border-[#90CAF9] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D47A1]">People who know the work</p>
          <h2 className="mt-3 text-[30px] font-bold tracking-tight text-[#0D47A1] sm:text-[38px]">Meet the team</h2>
          <p className="mt-4 text-[15px] leading-7 text-black/70">
            BuilderFind brings homeowners and skilled trades together around clearer briefs, fair comparisons and confident hiring. From the first plan to the finishing touches, every trade has a part to play.
          </p>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-[#90CAF9] bg-[#E3F2FD] shadow-[0_24px_70px_rgba(13,71,161,0.14)]">
          <Image
            src={teamImage}
            alt="A broad team of construction and home-improvement specialists"
            loading="eager"
            sizes="(max-width: 1280px) 94vw, 1216px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function Testimonials() {
  const mobileReviewsRef = useRef<HTMLDivElement>(null);
  const [activeReview, setActiveReview] = useState(0);

  const showReview = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), ALL_REVIEWS.length - 1);
    const container = mobileReviewsRef.current;
    const card = container?.children.item(nextIndex) as HTMLElement | null;

    if (container && card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
      setActiveReview(nextIndex);
    }
  };

  return (
    <section className="bg-white py-16 border-t border-[#90CAF9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <h2 className="text-[32px] font-bold text-[#0D47A1] text-center mb-3 tracking-tight">What our customers say</h2>
        <p className="text-center text-[15px] text-[#000000]">Thousands of homeowners have found their perfect builder through BuilderFind.</p>
      </div>

      <div className="hidden lg:flex gap-4 h-[580px] overflow-hidden px-4 sm:px-6 max-w-7xl mx-auto">
        {REVIEW_COLS.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-0 overflow-hidden">
            <div className={`review-col-inner review-col-${colIdx + 1}`}>
              {[...col, ...col].map((r, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#90CAF9] rounded-2xl p-5 mb-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] transition-shadow"
                >
                  <Stars count={r.stars} />
                  <p className="text-[12.5px] text-[#000000] mt-3 mb-3.5 leading-relaxed italic">&quot;{r.review}&quot;</p>
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={r.author} avatarIndex={r.avatarIndex} size={32} />
                    <div>
                      <p className="text-[11px] font-semibold text-[#000000]">{r.author}</p>
                      <p className="text-[10px] text-[#000000] mt-0.5">{r.job}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="lg:hidden mx-auto max-w-lg px-4"
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
      >
        <div
          ref={mobileReviewsRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
          onScroll={(event) => {
            const container = event.currentTarget;
            const cardWidth = container.firstElementChild?.getBoundingClientRect().width ?? container.clientWidth;
            setActiveReview(Math.min(Math.round(container.scrollLeft / (cardWidth + 16)), ALL_REVIEWS.length - 1));
          }}
        >
          {ALL_REVIEWS.map((review, index) => (
            <article
              key={`${review.author}-${review.job}`}
              className="w-full flex-none snap-center rounded-2xl border border-[#90CAF9] bg-white p-6 shadow-[0_8px_28px_rgba(13,71,161,0.09)]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${index + 1} of ${ALL_REVIEWS.length}`}
            >
              <Stars count={review.stars} />
              <p className="mt-4 mb-5 text-[14px] leading-relaxed text-[#000000] italic">&quot;{review.review}&quot;</p>
              <div className="flex items-center gap-3">
                <UserAvatar name={review.author} avatarIndex={review.avatarIndex} size={40} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#000000]">{review.author}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[#000000]">{review.job}</p>
                  <p className="mt-0.5 truncate text-[10px] text-[#000000]">{review.company}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-[#000000]" aria-live="polite" aria-atomic="true">
            {activeReview + 1} of {ALL_REVIEWS.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => showReview(activeReview - 1)}
              disabled={activeReview === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#90CAF9] bg-white text-[#000000] shadow-sm transition-colors hover:border-[#2196F3] hover:text-[#0D47A1] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Previous testimonial"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => showReview(activeReview + 1)}
              disabled={activeReview === ALL_REVIEWS.length - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#90CAF9] bg-white text-[#000000] shadow-sm transition-colors hover:border-[#2196F3] hover:text-[#0D47A1] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Next testimonial"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COST GUIDES ──────────────────────────────────────────────────────────────

function CostGuides() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <section className="bg-[#E3F2FD] py-16 border-t border-[#90CAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0D47A1] tracking-tight leading-tight">
              Our cost guides for popular household jobs
            </h2>
            <p className="text-[14px] text-[#000000] mt-2">
              Free price estimates to help you budget your next project
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-[#90CAF9] bg-white flex items-center justify-center text-[#000000] hover:border-[#2196F3] hover:text-[#0D47A1] transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-[#90CAF9] bg-white flex items-center justify-center text-[#000000] hover:border-[#2196F3] hover:text-[#0D47A1] transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {COST_GUIDES.map((guide) => (
            <Link
              key={guide.cat}
              href={guide.href}
              className="group flex-shrink-0 w-[270px] overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_8px_28px_rgba(13,71,161,0.08)] ring-1 ring-[#0D47A1]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(13,71,161,0.14)]"
            >
              <div className="relative h-[168px] overflow-hidden border-b border-[#0D47A1]/5">
                <TradeIllustration
                  variant={guide.illustration}
                  className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
                <span className="absolute right-3 top-3 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#000000] shadow-[0_5px_16px_rgba(13,71,161,0.12)] backdrop-blur-sm">
                  From {guide.from}
                </span>
                <span className="absolute bottom-3 left-3 rounded-full bg-[#0D47A1]/88 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  UK price guide
                </span>
              </div>
              <div className="p-5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1.5"
                  style={{ color: guide.accent }}
                >
                  {guide.cat}
                </p>
                <h3 className="text-[13px] font-semibold text-[#0D47A1] leading-snug group-hover:text-[#0D47A1] transition-colors">
                  {guide.title}
                </h3>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0D47A1]">
                  Read guide <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/cost-guides"
            className="inline-block border border-[#2196F3] text-[#0D47A1] hover:bg-[#000000] hover:text-white font-bold text-[14px] px-10 py-3.5 rounded-full transition-all tracking-wide"
          >
            See all cost guides
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── BUILDERS NEAR YOU ────────────────────────────────────────────────────────

function BuildersNearYou() {
  return (
    <section className="bg-white py-16 border-t border-[#90CAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* UK Map */}
          <div className="flex-shrink-0 lg:w-[240px] w-full max-w-[240px] mx-auto lg:mx-0">
            <svg viewBox="0 0 200 340" className="w-full h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* UK mainland simplified polygon */}
              <polygon
                points="85,335 100,340 95,328 90,318 105,310 120,312 135,308 142,310 148,308 155,308 162,312 170,308 175,302 182,294 185,285 182,272 178,255 175,238 168,222 164,205 162,185 165,165 158,148 150,132 142,115 132,100 128,88 122,82 115,70 108,58 118,45 128,35 115,20 95,12 68,18 55,35 45,52 48,70 58,88 65,100 72,118 78,132 82,148 78,162 68,175 55,188 48,202 42,218 45,235 58,248 72,258 65,270 72,282 68,298 58,312"
                fill="#E3F2FD"
                stroke="#2196F3"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* City dots */}
              {UK_CITIES.map((city) => {
                const pos = CITY_DOTS[city];
                if (!pos) return null;
                return (
                  <g key={city}>
                    <circle cx={pos[0]} cy={pos[1]} r="3.5" fill="#2196F3" opacity="0.85" />
                    <circle cx={pos[0]} cy={pos[1]} r="6" fill="#2196F3" opacity="0.15" />
                  </g>
                );
              })}
              {/* Highlight London with orange */}
              <circle cx="148" cy="272" r="4.5" fill="#2196F3" />
              <circle cx="148" cy="272" r="8" fill="#2196F3" opacity="0.15" />
            </svg>
          </div>

          {/* City pills */}
          <div className="flex-1">
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0D47A1] mb-3 tracking-tight">
              Builders near you
            </h2>
            <p className="text-[14px] text-[#000000] mb-8">
              Find trusted local builders and tradespeople in your area
            </p>
            <div className="flex flex-wrap gap-2.5">
              {UK_CITIES.map((city) => (
                <Link
                  key={city}
                  href={`/builders/${city.toLowerCase().replace(/ /g, "-")}`}
                  className="px-4 py-2 bg-[#E3F2FD] hover:bg-[#E3F2FD] border border-[#90CAF9] hover:border-[#2196F3] rounded-full text-[13px] font-semibold text-[#000000] hover:text-[#0D47A1] transition-all"
                >
                  {city}
                </Link>
              ))}
            </div>
            <div className="mt-7">
              <Link
                href="/all-locations"
                className="inline-flex items-center gap-1.5 text-[#0D47A1] font-bold text-[14px] hover:underline"
              >
                See all locations
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── NEAR ME GUIDES ───────────────────────────────────────────────────────────

function NearMeGuides() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <section className="bg-[#E3F2FD] py-16 border-t border-[#90CAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0D47A1] tracking-tight leading-tight">
              How to find a tradesperson near you
            </h2>
            <p className="text-[14px] text-[#000000] mt-2">
              Search local tradespeople by area and get free quotes today
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-[#90CAF9] bg-white flex items-center justify-center text-[#000000] hover:border-[#2196F3] hover:text-[#0D47A1] transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-[#90CAF9] bg-white flex items-center justify-center text-[#000000] hover:border-[#2196F3] hover:text-[#0D47A1] transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {NEAR_ME_GUIDES.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="group flex-shrink-0 w-[250px] overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_8px_28px_rgba(13,71,161,0.08)] ring-1 ring-[#2196F3]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(13,71,161,0.14)]"
            >
              <div className="relative h-[158px] overflow-hidden border-b border-[#2196F3]/10">
                <TradeIllustration
                  variant={guide.illustration}
                  className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-[0_5px_16px_rgba(13,71,161,0.12)] backdrop-blur-sm">
                  <svg className="h-4 w-4" style={{ color: guide.accent }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[13px] font-semibold text-[#0D47A1] leading-snug group-hover:text-[#0D47A1] transition-colors mb-1">
                  {guide.title}
                </h3>
                <p className="text-[11.5px] text-[#000000] leading-relaxed">{guide.desc}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0D47A1]">
                  Find now <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/near-me"
            className="inline-block border border-[#2196F3] text-[#0D47A1] hover:bg-[#000000] hover:text-white font-bold text-[14px] px-10 py-3.5 rounded-full transition-all tracking-wide"
          >
            See all near me guides
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── WHY BUILDERFIND ──────────────────────────────────────────────────────────

function WhyBuilderfind() {
  return (
    <section className="bg-[#E3F2FD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-[32px] font-bold text-[#0D47A1] text-center mb-3 tracking-tight">Why Use BuilderFind</h2>
        <p className="text-center text-[15px] text-[#000000] mb-14 max-w-xl mx-auto leading-relaxed">
          We make it simple to find, compare and hire trusted local builders — free, fast, no hassle.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_BENEFITS.map((benefit) => (
              <div key={benefit.title} className="group flex gap-4 rounded-[20px] border border-white/80 bg-white p-5 shadow-[0_6px_22px_rgba(13,71,161,0.06)] ring-1 ring-[#0D47A1]/5 transition-all duration-300 hover:-translate-y-0.5 hover:ring-[#2196F3]/20 hover:shadow-[0_12px_30px_rgba(13,71,161,0.11)]">
                <BenefitIcon variant={benefit.icon} />
                <div>
                  <h3 className="mb-1.5 text-[14px] font-semibold tracking-tight text-[#0D47A1] transition-colors group-hover:text-[#0D47A1]">{benefit.title}</h3>
                  <p className="text-[12px] leading-relaxed text-[#000000]">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {ALL_REVIEWS.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-white border border-[#90CAF9] rounded-2xl p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
                <Stars count={r.stars} />
                <p className="text-[13px] text-[#000000] mt-3.5 mb-4 leading-relaxed italic">&quot;{r.review}&quot;</p>
                <div className="flex items-center gap-3">
                  <UserAvatar name={r.author} avatarIndex={r.avatarIndex} size={32} />
                  <div>
                    <p className="text-[11px] font-semibold text-[#000000] tracking-tight">{r.author} · {r.job}</p>
                    <p className="text-[10px] text-[#000000] mt-0.5">{r.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-3xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-[#0D47A1]">
            {[
              { stat: "50,000+", label: "Registered Builders" },
              { stat: "1M+", label: "Jobs Posted" },
              { stat: "4.7/5", label: "Average Rating" },
              { stat: "FREE", label: "For Homeowners" },
            ].map((s) => (
              <div key={s.stat}>
                <div className="text-[34px] md:text-[40px] font-bold mb-1.5 tracking-tight">{s.stat}</div>
                <div className="text-[12px] text-[#2196F3] font-semibold uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0D47A1] via-[#0D47A1] to-[#2196F3] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="text-[24px] font-bold mb-4 tracking-tight">
              <span className="text-[#90CAF9]">Builder</span><span className="text-[#2196F3]">Find</span>
            </div>
            <p className="text-[12px] text-white leading-relaxed mb-5 max-w-[200px]">
              Post Your Job. Get Quotes.<br />Compare Builders. Book With Confidence.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Built for UK homeowners and trades</p>
          </div>
          {[
            { title: "For Customers", links: [["Post a Job", "/post-a-job"], ["How it Works", "/how-it-works"], ["Cost Guides", "/cost-guides"], ["Find a Builder", "/all-trades"], ["Near Me Guides", "/near-me"], ["Login", "/login"]] },
            { title: "For Builders", links: [["Builder Signup", "/builder-signup"], ["Find Jobs", "/dashboard"], ["Create Profile", "/builder-signup"], ["How Leads Work", "/how-it-works-builders"], ["Builder Dashboard", "/dashboard"], ["Login", "/login"]] },
            { title: "Popular Trades", links: [["Builders", "/builders"], ["Plumbers", "/plumbers"], ["Electricians", "/electricians"], ["Roofers", "/roofers"], ["Plasterers", "/plasterers"], ["Painters", "/painters"], ["All trades", "/all-trades"]] },
            { title: "Company", links: [["About Us", "/about"], ["Contact Us", "/contact"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"], ["Sitemap", "/sitemap"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-[11px] text-white mb-4 uppercase tracking-[0.15em]">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-[13px] text-white hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white">© 2026 BuilderFind Ltd. All rights reserved. Registered in England &amp; Wales.</p>
          <p className="text-[11px] text-white">UK&apos;s Builder Comparison Marketplace</p>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BuilderBanner />
      <HowItWorks />
      <PopularTrades />
      <BuilderCTA />
      <MeetTheTeam />
      <Testimonials />
      <CostGuides />
      <BuildersNearYou />
      <NearMeGuides />
      <WhyBuilderfind />
      <Footer />
    </>
  );
}
