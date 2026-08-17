import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TradeIllustration, type TradeIllustrationVariant } from "@/components/TradeIllustrations";
import { DEMO_TRADESPERSON_BY_SLUG, DEMO_TRADESPEOPLE, type DemoReview, type DemoTradeperson } from "@/data/demo-tradespeople";
import { collections } from "@/lib/db/collections";
import { audit, publishEvent } from "@/lib/platform/events";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

type ProfileView = {
  slug: string;
  businessName: string;
  owner: string;
  trade: string;
  trades: string[];
  services: string[];
  postcode: string;
  area: string;
  yearsExperience: number;
  coverageMiles: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  avatar: string;
  bio: string;
  gallery: readonly { label: string; variant?: TradeIllustrationVariant; src?: string }[];
  jobs: readonly string[];
  reviews: readonly DemoReview[];
  demo: boolean;
};

const nearbyTrades = [
  ["handymen", "Handymen"], ["painters", "Painters & Decorators"], ["builders", "Builders"], ["roofers", "Roofers"],
  ["carpenters", "Joiners"], ["gardeners", "Gardeners"], ["plasterers", "Plasterers"], ["plumbers", "Plumbers"], ["electricians", "Electricians"], ["tilers", "Tilers"], ["flooring", "Flooring Specialists"],
] as const;

function demoToView(profile: DemoTradeperson): ProfileView {
  return { ...profile, reviewCount: profile.reviews.length, demo: true };
}

async function loadProfile(slug: string): Promise<ProfileView | null> {
  const demo = DEMO_TRADESPERSON_BY_SLUG.get(slug);
  try {
    const c = await collections();
    const profile = await c.builderProfiles.findOne({ slug, verificationStatus: "verified", profileVisible: true });
    if (!profile) return demo ? demoToView(demo) : null;
    const [owner, reviews, portfolio] = await Promise.all([
      c.users.findOne({ _id: profile.userId, status: "active" }, { projection: { firstName: 1, lastName: 1 } }),
      c.reviews.find({ builderId: profile.userId, status: "published" }).sort({ createdAt: -1 }).limit(20).toArray(),
      c.media.find({ _id: { $in: profile.portfolioMediaIds }, access: "public" }).limit(12).toArray(),
    ]);
    if (!owner) return demo ? demoToView(demo) : null;
    await Promise.all([
      audit({ action: "profile.viewed", entityType: "builderProfile", entityId: profile._id }),
      publishEvent({ type: "profile.viewed", entityId: profile._id, audienceUserIds: [profile.userId], payload: { slug: profile.slug } }),
    ]);
    return {
      slug: profile.slug, businessName: profile.businessName, owner: `${owner.firstName} ${owner.lastName}`, trade: profile.trades[0] ?? "Trade professional",
      trades: profile.trades, services: profile.services, postcode: profile.basePostcode, area: profile.basePostcode.split(" ")[0] ?? profile.basePostcode,
      yearsExperience: profile.yearsExperience, coverageMiles: profile.coverageMiles, rating: profile.ratingAverage, reviewCount: profile.reviewCount,
      completedJobs: profile.completedJobCount, avatar: "/avatars/049.webp", bio: profile.bio,
      gallery: portfolio.map((media, index) => ({ label: `Completed project ${index + 1}`, src: `/api/media/public/${media._id.toHexString()}` })),
      jobs: profile.services.slice(0, 5), reviews: reviews.map((review) => ({ title: review.title, body: review.body, reviewer: "Verified customer", date: review.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), rating: review.rating })), demo: false,
    };
  } catch {
    return demo ? demoToView(demo) : null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await loadProfile((await params).slug);
  return profile ? { title: `${profile.businessName} | BuilderFind`, description: profile.bio.slice(0, 155) } : {};
}

function Stars({ rating }: { rating: number }) {
  return <span className="tracking-[0.12em] text-[#F6B800]" aria-label={`${rating} out of 5 stars`}>★★★★★</span>;
}

function ProfilePage({ profile }: { profile: ProfileView }) {
  const locationSlug = profile.area.toLowerCase().replaceAll(" ", "-");
  return <>
    <Navbar />
    <main className="bg-[#E3F2FD] pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-5 text-[11px] font-semibold text-black/45 sm:px-6"><Link href="/tradespeople" className="hover:text-[#0D47A1]">Trade directory</Link><span className="px-2">›</span><Link href={`/${profile.trades[0]?.toLowerCase().replaceAll(" ", "-") ?? "builders"}`} className="hover:text-[#0D47A1]">{profile.trade}</Link><span className="px-2">›</span>{profile.area}<span className="px-2">›</span><span className="text-black/65">Trade profile</span></div>
      {profile.demo ? <div className="mx-auto max-w-6xl px-4 pt-3 text-[11px] font-bold text-[#0D47A1] sm:px-6">BuilderFind featured demo profile · Real verified profiles replace this content automatically when published.</div> : null}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-5">
          <section className="rounded-2xl border border-[#D7E8F6] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><Image src={profile.avatar} width={64} height={64} alt={`${profile.owner} profile photo`} className="h-16 w-16 rounded-full object-cover ring-4 ring-[#E3F2FD]" /><div><h1 className="text-xl font-black text-[#172B4D]">{profile.businessName}</h1><div className="mt-1 flex flex-wrap items-center gap-2 text-xs"><Stars rating={profile.rating} /><span className="font-bold text-[#172B4D]">{profile.rating.toFixed(1)}</span><span className="text-black/45">{profile.reviewCount} reviews</span></div></div></div><span className="inline-flex w-fit items-center rounded-full bg-[#E3F2FD] px-3 py-1.5 text-[11px] font-bold text-[#0D47A1]">✓ Verified BuilderFind business</span></div>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-[#0D47A1]">{[`Public liability insurance`, `Joined ${profile.demo ? "Jan 2023" : "BuilderFind"}`, `Established ${new Date().getFullYear() - profile.yearsExperience}`, `Based in ${profile.area}`, `Limited Company`, `ID checked`, ...profile.services.slice(0, 2)].map((badge) => <span key={badge} className="rounded-lg bg-[#F3F8FC] px-3 py-2">✓&nbsp; {badge}</span>)}</div>
          </section>

          <section className="rounded-2xl border border-[#D7E8F6] bg-white p-5 shadow-sm sm:p-7"><h2 className="text-sm font-black text-[#172B4D]">About</h2><p className="mt-3 text-sm leading-6 text-black/65">{profile.bio}</p><h2 className="mt-7 text-sm font-black text-[#172B4D]">Skills</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{profile.trades.map((skill) => <div key={skill} className="flex items-center justify-between rounded-lg bg-[#F3F8FC] px-4 py-3 text-xs font-bold text-[#0D47A1]"><span>{skill}</span><span aria-hidden="true">⌄</span></div>)}</div></section>

          <section className="rounded-2xl border border-[#D7E8F6] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><h2 className="text-sm font-black text-[#172B4D]">Recent job gallery</h2><span className="text-xs text-black/45">{profile.gallery.length} projects</span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{profile.gallery.map((item) => <div key={item.label} className="group relative aspect-[1.2] overflow-hidden rounded-lg bg-[#E3F2FD]">{item.src ? <Image src={item.src} alt={item.label} fill sizes="(max-width: 640px) 50vw, 180px" className="object-cover" /> : <TradeIllustration variant={item.variant ?? "builder"} className="h-full w-full object-cover transition group-hover:scale-105" />}<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2 pb-2 pt-5 text-[10px] font-bold text-white">{item.label}</span></div>)}</div></section>

          <section className="rounded-2xl border border-[#D7E8F6] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><h2 className="text-sm font-black text-[#172B4D]">Latest reviews</h2><select className="rounded-md border border-[#D7E8F6] bg-white px-2 py-1.5 text-[11px] font-semibold text-black/60" defaultValue="recent"><option value="recent">Recent First</option><option value="highest">Highest rated</option></select></div><div className="mt-4 grid gap-2">{profile.reviews.map((review) => <article key={`${review.title}-${review.date}`} className="rounded-lg bg-[#F3F8FC] p-4"><div className="flex flex-wrap items-center gap-2"><Stars rating={review.rating} /><h3 className="text-xs font-black text-[#172B4D]">{review.title}</h3></div><p className="mt-2 text-xs leading-5 text-black/65">{review.body}</p><p className="mt-2 text-[10px] text-black/40">Reviewed by {review.reviewer} · {review.date}</p><div className="mt-3 rounded-md border border-[#D7E8F6] bg-white px-3 py-2 text-[10px] text-black/55">{profile.businessName}: Thanks for the positive feedback, much appreciated.</div></article>)}</div><div className="mt-5 flex items-center gap-5 text-xs font-bold text-[#0D47A1]"><span>1</span><span>2</span><span>…</span><span>16</span><span>›</span></div><Link href="/post-a-job" className="mt-4 inline-flex rounded-md bg-[#2196F3] px-4 py-2 text-xs font-bold text-white">Leave a review</Link></section>

          <section className="rounded-2xl border border-[#D7E8F6] bg-white p-5 shadow-sm sm:p-7"><h2 className="text-sm font-black text-[#172B4D]">Recent jobs completed</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{profile.jobs.map((job, index) => <div key={job} className="rounded-lg border border-[#D7E8F6] px-4 py-3 text-xs font-semibold text-black/65"><span className="mr-2 text-[#F6B800]">★</span>{job}<span className="mt-1 block text-[10px] text-black/40">Completed {index + 1} months ago · {profile.area}</span></div>)}</div><p className="mt-5 text-[11px] leading-5 text-black/55"><strong>About our Reviews:</strong> Reviews are submitted by users of our service who have had a job completed by a verified trade professional. We operate a closed-loop feedback system so reviews remain connected to real completed work.</p></section>
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24"><section className="rounded-2xl border border-[#D7E8F6] bg-white p-5 shadow-sm"><h2 className="text-sm font-black text-[#172B4D]">Ready to get started?</h2><p className="mt-2 text-xs leading-5 text-black/55">Invite {profile.businessName} to quote for your job.</p><Link href="/post-a-job" className="mt-4 inline-flex rounded-md bg-[#2196F3] px-4 py-2 text-xs font-bold text-white">Invite to quote</Link></section><section className="rounded-2xl border border-[#D7E8F6] bg-white p-4 shadow-sm"><h2 className="text-[10px] font-black uppercase tracking-[0.12em] text-black/45">Other trades near {profile.area}</h2><div className="mt-3 grid gap-1.5">{nearbyTrades.map(([slug, name]) => <Link key={slug} href={`/${slug}/${locationSlug}`} className="rounded-md bg-[#F1F3F6] px-3 py-2 text-[11px] font-semibold text-black/65 transition hover:bg-[#E3F2FD] hover:text-[#0D47A1]">{name} in {profile.area}</Link>)}</div></section><section className="rounded-2xl bg-[#0D47A1] p-5 text-white"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#90CAF9]">Profile snapshot</p><dl className="mt-4 grid gap-3 text-xs"><div className="flex justify-between gap-3"><dt className="text-white/70">Experience</dt><dd className="font-bold">{profile.yearsExperience} years</dd></div><div className="flex justify-between gap-3"><dt className="text-white/70">Completed jobs</dt><dd className="font-bold">{profile.completedJobs}</dd></div><div className="flex justify-between gap-3"><dt className="text-white/70">Coverage</dt><dd className="font-bold">{profile.coverageMiles} miles</dd></div></dl></section></aside>
      </div>
    </main>
    <Footer />
  </>;
}

export default async function TradespersonPage({ params }: Props) {
  const profile = await loadProfile((await params).slug);
  if (!profile) notFound();
  return <ProfilePage profile={profile} />;
}

export function demoProfilesForDirectory() {
  return DEMO_TRADESPEOPLE.map(demoToView);
}
