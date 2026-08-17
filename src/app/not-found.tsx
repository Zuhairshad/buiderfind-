import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return <><Navbar /><main className="flex min-h-[65vh] items-center justify-center bg-[#E3F2FD] px-4 py-16 text-center"><section className="max-w-xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0D47A1]">404</p><h1 className="mt-4 text-4xl font-bold text-[#0D47A1]">That page is not in the directory</h1><p className="mt-4 text-base leading-7 text-[#000000]">The link may be outdated, or the trade and location combination is not currently published.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/all-trades" className="rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white">Browse all trades</Link><Link href="/" className="rounded-full border border-[#90CAF9] bg-white px-7 py-3.5 text-sm font-bold text-[#000000]">Return home</Link></div></section></main><Footer /></>;
}
