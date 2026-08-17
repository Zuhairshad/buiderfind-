import Link from "next/link";

export default function Footer() {
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
            { title: "For Customers", links: [["Post a Job", "/post-a-job"], ["How it Works", "/how-it-works"], ["Cost Guides", "/cost-guides"], ["Find a Builder", "/all-trades"], ["Login", "/login"]] },
            { title: "For Builders", links: [["Builder Signup", "/builder-signup"], ["Builder Dashboard", "/dashboard"], ["How it Works", "/how-it-works-builders"], ["Login", "/login"]] },
            { title: "Popular Trades", links: [["Builders", "/builders"], ["Plumbers", "/plumbers"], ["Electricians", "/electricians"], ["Roofers", "/roofers"], ["Plasterers", "/plasterers"], ["All trades", "/all-trades"]] },
            { title: "Company", links: [["About Us", "/about"], ["Contact Us", "/contact"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]] },
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
