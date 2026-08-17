import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { COST_CATEGORIES, COST_GUIDES, COST_JOB_LISTINGS, NEAR_ME_GUIDES } from "@/data/content";
import { CITIES, TRADE_DIRECTORY } from "@/data/directory";
import { RESOURCE_ARTICLES, RESOURCE_HUBS, RESOURCE_HUB_SLUGS } from "@/data/resources";

const CORE_LINKS = [
  ["Home", "/"], ["Post a job", "/post-a-job"], ["Tradesperson signup", "/builder-signup"], ["Login", "/login"], ["How it works", "/how-it-works"], ["How it works for trades", "/how-it-works-builders"], ["All trades", "/all-trades"], ["All locations", "/all-locations"], ["Cost guides", "/cost-guides"], ["Cost calculators", "/cost-calculators"], ["Near-me guides", "/near-me"], ["Tradespeople", "/tradespeople"], ["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Cookies", "/cookies"],
] as const;

export const metadata = { title: "Sitemap | BuilderFind", description: "Browse BuilderFind's public trade, location, cost and advice pages." };

function LinkList({ links }: { links: readonly (readonly [string, string])[] }) {
  return <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">{links.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className="text-sm font-semibold text-[#000000] hover:text-[#0D47A1]">{label}</Link>)}</div>;
}

export default function Page() {
  const resourceLinks = RESOURCE_HUB_SLUGS.flatMap((hub) => [[RESOURCE_HUBS[hub].label, `/${hub}`] as const, ...RESOURCE_ARTICLES.filter((article) => article.hub === hub).map((article) => [article.title, `/${hub}/${article.slug}`] as const)]);
  const listedJobSlugs = new Set(COST_JOB_LISTINGS.map((job) => job.slug));
  const costLinks = [...COST_JOB_LISTINGS.map((job) => [job.title, `/cost-guides/${job.slug}`] as const), ...COST_GUIDES.filter((guide) => !listedJobSlugs.has(guide.slug)).map((guide) => [guide.title, `/cost-guides/${guide.slug}`] as const)];
  return <><Navbar /><main><header className="border-b border-[#90CAF9] bg-[#E3F2FD]"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">Directory</p><h1 className="mt-4 text-4xl font-bold text-[#0D47A1]">BuilderFind sitemap</h1><p className="mt-4 text-base text-[#000000]">Every public route family currently available on BuilderFind.</p></div></header><div className="mx-auto max-w-7xl space-y-12 px-4 py-14 sm:px-6"><section><h2 className="text-2xl font-bold text-[#0D47A1]">Core pages</h2><LinkList links={CORE_LINKS} /></section><section><h2 className="text-2xl font-bold text-[#0D47A1]">Trades</h2><LinkList links={TRADE_DIRECTORY.map((trade) => [trade.plural, `/${trade.slug}`] as const)} /></section><section><h2 className="text-2xl font-bold text-[#0D47A1]">Popular builder locations</h2><LinkList links={CITIES.map((location) => [location.name, `/builders/${location.slug}`] as const)} /></section><section><h2 className="text-2xl font-bold text-[#0D47A1]">Cost categories</h2><LinkList links={COST_CATEGORIES.map((category) => [`${category.name} costs`, `/cost-guides/category/${category.slug}`] as const)} /></section><section><h2 className="text-2xl font-bold text-[#0D47A1]">All cost jobs</h2><LinkList links={costLinks} /></section><section><h2 className="text-2xl font-bold text-[#0D47A1]">Local hiring</h2><LinkList links={NEAR_ME_GUIDES.map((guide) => [guide.title, `/near-me/${guide.slug}`] as const)} /></section><section><h2 className="text-2xl font-bold text-[#0D47A1]">Advice and editorial</h2><LinkList links={resourceLinks} /></section></div></main><Footer /></>;
}
