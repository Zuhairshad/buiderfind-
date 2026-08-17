import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const STEPS = [
  {
    number: "01",
    title: "Tell us about the work",
    body: "Choose the closest trade, enter the job postcode and describe the result you want. Measurements, photographs and access notes help tradespeople understand the brief before they respond.",
    note: "Usually takes a few minutes",
    visual: "brief",
  },
  {
    number: "02",
    title: "We share it with relevant local trades",
    body: "BuilderFind routes your brief to tradespeople who cover your area and work on that type of project. They can review the detail and register their interest if the job suits their availability.",
    note: "No cold-calling directory trawl",
    visual: "match",
  },
  {
    number: "03",
    title: "Compare the whole quote",
    body: "Look beyond the headline total. Compare the proposed scope, materials, timing, payment stages, exclusions and relevant experience so each option is judged on the same basis.",
    note: "You decide who to contact",
    visual: "compare",
  },
  {
    number: "04",
    title: "Agree the details and hire",
    body: "Before work starts, put the specification, price, programme and change process in writing. Hire only when the checks are complete and the arrangement feels right for your home.",
    note: "There is no obligation to hire",
    visual: "hire",
  },
] as const;

const BRIEF_ITEMS = [
  ["The existing condition", "Explain what is there now and what needs changing."],
  ["Measurements and photos", "Add dimensions and clear images wherever they help."],
  ["Access and parking", "Flag stairs, permits, restricted hours or difficult access."],
  ["Your preferred timing", "Give a realistic window rather than a fixed promise."],
  ["Materials and finish", "Name products or describe the quality level you expect."],
  ["Approvals and certificates", "Mention any known planning, building-control or certification needs."],
] as const;

const COMPARE_ROWS = [
  ["Scope", "Are labour, preparation and making good clearly included?"],
  ["Materials", "Are brands, quantities and allowances written down?"],
  ["Price", "Does the total state whether VAT, waste and access equipment are included?"],
  ["Programme", "Are the proposed start date, duration and dependencies realistic?"],
  ["Credentials", "Have you checked relevant registrations, insurance and recent work?"],
  ["Payment", "Are deposits and stage payments proportionate to progress?"],
] as const;

const FAQS = [
  [
    "Does it cost homeowners to post a job?",
    "No. Posting a residential job on BuilderFind is free for homeowners, and you are not required to accept any response.",
  ],
  [
    "How quickly will tradespeople respond?",
    "Response times depend on the trade, location, job size and current availability. A detailed brief with photographs is more likely to attract useful interest than a one-line description.",
  ],
  [
    "Does BuilderFind choose the tradesperson for me?",
    "No. BuilderFind helps make the introduction; the hiring decision remains yours. Compare the written scope, experience, references, insurance and any registration relevant to the work before agreeing to proceed.",
  ],
  [
    "Should I ask for a written quote?",
    "Yes. Ask each tradesperson to price the same brief and state labour, materials, VAT, waste, exclusions and provisional sums. That makes comparisons clearer and reduces surprises later.",
  ],
  [
    "What happens if the job changes after work begins?",
    "Agree a written variation before extra work starts wherever possible. It should record the change, added or reduced cost and any effect on the completion date.",
  ],
] as const;

function Tick({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${inverse ? "bg-white/15 text-[#90CAF9]" : "bg-[#E3F2FD] text-[#0D47A1]"}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-current" strokeWidth="2.2">
        <path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function HeroJourneyVisual() {
  return (
    <svg viewBox="0 0 640 510" className="h-auto w-full" role="img" aria-labelledby="journey-visual-title journey-visual-desc">
      <title id="journey-visual-title">A homeowner job travelling through BuilderFind to local tradespeople</title>
      <desc id="journey-visual-desc">An illustrated job brief is matched to three local tradespeople whose quotes can then be compared.</desc>
      <defs>
        <linearGradient id="hiw-panel" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E3F2FD" />
        </linearGradient>
        <filter id="hiw-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0D47A1" floodOpacity=".16" />
        </filter>
      </defs>
      <circle cx="320" cy="245" r="225" fill="#E3F2FD" opacity=".65" />
      <circle cx="320" cy="245" r="164" fill="#E3F2FD" opacity=".45" />
      <path d="M238 252C296 252 299 163 365 163M238 269c72 0 77 67 139 67" fill="none" stroke="#90CAF9" strokeWidth="3" strokeDasharray="7 9" />

      <g filter="url(#hiw-shadow)">
        <rect x="42" y="128" width="210" height="278" rx="25" fill="url(#hiw-panel)" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="62" y="151" width="170" height="38" rx="12" fill="#0D47A1" />
        <circle cx="81" cy="170" r="5" fill="#2196F3" />
        <text x="96" y="175" fill="#FFFFFF" fontSize="13" fontWeight="700">YOUR JOB BRIEF</text>
        <text x="66" y="220" fill="#2196F3" fontSize="10" fontWeight="700" letterSpacing="1.2">KITCHEN FITTING</text>
        <rect x="66" y="234" width="149" height="10" rx="5" fill="#E3F2FD" />
        <rect x="66" y="253" width="122" height="8" rx="4" fill="#E3F2FD" />
        <rect x="66" y="270" width="139" height="8" rx="4" fill="#E3F2FD" />
        <rect x="66" y="297" width="68" height="56" rx="10" fill="#E3F2FD" />
        <path d="M77 339l17-18 12 12 12-13 8 19z" fill="#90CAF9" />
        <circle cx="116" cy="312" r="5" fill="#90CAF9" />
        <rect x="145" y="301" width="70" height="9" rx="4.5" fill="#E3F2FD" />
        <rect x="145" y="319" width="55" height="8" rx="4" fill="#E3F2FD" />
        <rect x="145" y="337" width="65" height="8" rx="4" fill="#E3F2FD" />
        <rect x="66" y="370" width="149" height="18" rx="9" fill="#2196F3" />
      </g>

      <g filter="url(#hiw-shadow)">
        <rect x="354" y="73" width="238" height="105" rx="20" fill="#FFFFFF" />
        <circle cx="389" cy="125" r="27" fill="#E3F2FD" />
        <path d="M372 124h34v18h-34z" fill="#2196F3" />
        <circle cx="389" cy="111" r="12" fill="#2196F3" />
        <path d="M375 108c1-13 27-14 29 0z" fill="#2196F3" />
        <text x="429" y="108" fill="#0D47A1" fontSize="14" fontWeight="700">Oak &amp; Stone</text>
        <text x="429" y="129" fill="#000000" fontSize="11">Kitchen specialist · 4 miles</text>
        <text x="429" y="150" fill="#2196F3" fontSize="14">★★★★★</text>
      </g>
      <g filter="url(#hiw-shadow)">
        <rect x="377" y="213" width="222" height="105" rx="20" fill="#FFFFFF" />
        <circle cx="412" cy="265" r="27" fill="#E3F2FD" />
        <path d="M395 264h34v18h-34z" fill="#2196F3" />
        <circle cx="412" cy="251" r="12" fill="#2196F3" />
        <path d="M398 248c1-13 27-14 29 0z" fill="#2196F3" />
        <text x="452" y="248" fill="#0D47A1" fontSize="14" fontWeight="700">Northside Fitters</text>
        <text x="452" y="269" fill="#000000" fontSize="11">Available next month</text>
        <text x="452" y="290" fill="#2196F3" fontSize="14">★★★★★</text>
      </g>
      <g filter="url(#hiw-shadow)">
        <rect x="350" y="353" width="242" height="105" rx="20" fill="#FFFFFF" />
        <circle cx="385" cy="405" r="27" fill="#E3F2FD" />
        <path d="M368 404h34v18h-34z" fill="#2196F3" />
        <circle cx="385" cy="391" r="12" fill="#2196F3" />
        <path d="M371 388c1-13 27-14 29 0z" fill="#2196F3" />
        <text x="425" y="388" fill="#0D47A1" fontSize="14" fontWeight="700">Field &amp; Form</text>
        <text x="425" y="409" fill="#000000" fontSize="11">Detailed written quote</text>
        <text x="425" y="430" fill="#2196F3" fontSize="14">★★★★★</text>
      </g>

      <g transform="translate(275 226)">
        <circle cx="42" cy="42" r="42" fill="#2196F3" />
        <circle cx="42" cy="42" r="31" fill="#FFFFFF" opacity=".12" />
        <path d="m23 44 12 12 25-29" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function StepVisual({ type }: { type: (typeof STEPS)[number]["visual"] }) {
  if (type === "brief") {
    return (
      <svg viewBox="0 0 320 190" className="h-auto w-full" aria-hidden="true">
        <rect x="24" y="20" width="272" height="150" rx="20" fill="#FFFFFF" />
        <rect x="44" y="42" width="94" height="12" rx="6" fill="#2196F3" />
        <rect x="44" y="70" width="232" height="13" rx="6.5" fill="#E3F2FD" />
        <rect x="44" y="94" width="173" height="13" rx="6.5" fill="#E3F2FD" />
        <rect x="44" y="121" width="56" height="30" rx="8" fill="#E3F2FD" />
        <rect x="109" y="121" width="56" height="30" rx="8" fill="#E3F2FD" />
        <circle cx="256" cy="133" r="20" fill="#2196F3" />
        <path d="M247 133h18M256 124v18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "match") {
    return (
      <svg viewBox="0 0 320 190" className="h-auto w-full" aria-hidden="true">
        <path d="M160 95 69 53M160 95l91-42M160 95 76 144M160 95l85 49" stroke="#90CAF9" strokeWidth="3" strokeDasharray="6 7" />
        <circle cx="160" cy="95" r="37" fill="#2196F3" />
        <path d="M142 99h36M160 81v36" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        {[[69,53],[251,53],[76,144],[245,144]].map(([x,y], index) => (
          <g key={index} transform={`translate(${x} ${y})`}>
            <circle r="27" fill="#FFFFFF" />
            <circle cy="-7" r="8" fill={index % 2 ? "#2196F3" : "#2196F3"} />
            <path d="M-13 17c0-14 26-14 26 0" fill={index % 2 ? "#2196F3" : "#0D47A1"} />
            <path d="M-10-10c1-9 19-9 20 0" fill="#2196F3" />
          </g>
        ))}
      </svg>
    );
  }
  if (type === "compare") {
    return (
      <svg viewBox="0 0 320 190" className="h-auto w-full" aria-hidden="true">
        {[35,119,203].map((x, index) => (
          <g key={x}>
            <rect x={x} y={index === 1 ? 24 : 38} width="72" height={index === 1 ? 145 : 131} rx="15" fill="#FFFFFF" stroke={index === 1 ? "#2196F3" : "#E3F2FD"} strokeWidth={index === 1 ? 3 : 1} />
            <circle cx={x + 36} cy={index === 1 ? 57 : 67} r="13" fill={index === 1 ? "#2196F3" : "#E3F2FD"} />
            <rect x={x + 15} y={index === 1 ? 81 : 91} width="42" height="7" rx="3.5" fill="#E3F2FD" />
            <rect x={x + 21} y={index === 1 ? 99 : 109} width="30" height="7" rx="3.5" fill="#E3F2FD" />
            <rect x={x + 13} y={index === 1 ? 129 : 139} width="46" height="17" rx="8.5" fill={index === 1 ? "#2196F3" : "#E3F2FD"} />
          </g>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full" aria-hidden="true">
      <path d="M59 151h202V73L160 24 59 73z" fill="#FFFFFF" stroke="#E3F2FD" strokeWidth="3" />
      <path d="m45 78 115-57 115 57" fill="none" stroke="#2196F3" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="137" y="101" width="46" height="50" rx="4" fill="#E3F2FD" />
      <circle cx="174" cy="127" r="3" fill="#2196F3" />
      <circle cx="236" cy="52" r="28" fill="#2196F3" />
      <path d="m223 52 9 9 18-21" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuoteComparisonVisual() {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#90CAF9]">Quote comparison</p>
          <p className="mt-1 text-sm font-bold text-white">Kitchen refurbishment</p>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold text-white">3 responses</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {[
          ["Oak & Stone", "£8,420", "6–8 weeks", false],
          ["Northside", "£8,950", "5–7 weeks", true],
          ["Field & Form", "£7,780", "8–10 weeks", false],
        ].map(([name, price, timing, selected]) => (
          <article key={String(name)} className={`rounded-2xl border p-4 ${selected ? "border-[#90CAF9] bg-[#0D47A1]/35" : "border-white/10 bg-[#000000]/35"}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-white">{name}</p>
              {selected ? <span className="text-[#90CAF9]" aria-label="Highlighted example">●</span> : null}
            </div>
            <p className="mt-5 text-xl font-bold text-white">{price}</p>
            <p className="mt-1 text-[11px] text-white/60">Proposed duration: {timing}</p>
            <div className="mt-4 space-y-2">
              {["Scope supplied", "Materials listed", "VAT stated"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[10px] text-white/75"><Tick inverse />{item}</div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[#90CAF9] bg-[radial-gradient(circle_at_85%_20%,#90CAF9_0,transparent_38%),linear-gradient(135deg,#FFFFFF_0%,#E3F2FD_100%)]">
          <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-white/70 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[.92fr_1.08fr] lg:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D47A1]">How BuilderFind works</p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.07] tracking-[-0.035em] text-[#0D47A1] sm:text-5xl lg:text-[3.5rem]">
                From one clear brief to a better-informed hire.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#000000] sm:text-lg sm:leading-8">
                Post your home-improvement job once, hear from relevant local tradespeople and compare the details that matter. You stay in control from the first response to the final decision.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/post-a-job" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(13,71,161,.22)] transition hover:bg-[#000000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2196F3]">
                  Post a job free
                </Link>
                <Link href="/all-trades" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#2196F3]/35 bg-white px-7 py-3.5 text-sm font-bold text-[#0D47A1] transition hover:border-[#2196F3] hover:bg-[#E3F2FD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2196F3]">
                  Browse local trades
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#000000]">
                {['Free to post', 'No obligation to hire', 'Your decision throughout'].map((item) => (
                  <span key={item} className="flex items-center gap-2"><Tick />{item}</span>
                ))}
              </div>
            </div>
            <div className="mx-auto w-full max-w-[640px] lg:max-w-none">
              <HeroJourneyVisual />
            </div>
          </div>
        </section>

        <section aria-label="BuilderFind homeowner benefits" className="border-b border-[#90CAF9] bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[#90CAF9] px-4 sm:px-6 md:grid-cols-4 md:divide-y-0">
            {[
              ["One brief", "Describe the work once"],
              ["Local interest", "Reach relevant trades"],
              ["Clear comparison", "Review like for like"],
              ["Your choice", "Hire only when ready"],
            ].map(([value, label]) => (
              <div key={value} className="px-3 py-5 text-center sm:py-6">
                <p className="text-sm font-bold text-[#0D47A1]">{value}</p>
                <p className="mt-1 text-[11px] leading-5 text-[#000000]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">The homeowner journey</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0D47A1] sm:text-4xl">Four practical steps, with you in control</h2>
              <p className="mt-4 text-sm leading-7 text-[#000000] sm:text-base">BuilderFind organises the introduction and gives you a clearer framework for comparing responses. The final checks and hiring decision remain yours.</p>
            </div>
            <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-4">
              <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-[#90CAF9] lg:block" aria-hidden="true" />
              {STEPS.map((step) => (
                <article key={step.number} className="relative overflow-hidden rounded-[1.75rem] border border-[#E3F2FD] bg-[#E3F2FD] p-5 shadow-[0_16px_50px_rgba(13,71,161,.06)] sm:p-6">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white text-sm font-bold text-[#0D47A1] shadow-sm">{step.number}</div>
                  <div className="mt-5 overflow-hidden rounded-2xl bg-[#E3F2FD]">
                    <StepVisual type={step.visual} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold leading-6 text-[#0D47A1]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#000000]">{step.body}</p>
                  <p className="mt-5 flex items-center gap-2 border-t border-[#90CAF9] pt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0D47A1]"><Tick />{step.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-[#90CAF9] bg-[#E3F2FD] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">A quoteable brief</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0D47A1] sm:text-4xl">Give tradespeople enough detail to respond usefully</h2>
              <p className="mt-5 text-sm leading-7 text-[#000000] sm:text-base">A good job post is not a technical specification. It is a clear starting point that helps the right specialist judge the size, location and likely requirements of the work.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {BRIEF_ITEMS.map(([title, body]) => (
                  <div key={title} className="flex gap-3 rounded-2xl border border-[#90CAF9] bg-white p-4">
                    <Tick />
                    <div><h3 className="text-sm font-bold text-[#0D47A1]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#000000]">{body}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E3F2FD]/60 blur-3xl" aria-hidden="true" />
              <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-[0_26px_70px_rgba(13,71,161,.14)] sm:p-6">
                <div className="flex items-center justify-between border-b border-[#90CAF9] pb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0D47A1]">Your job brief</p>
                    <p className="mt-1 text-base font-bold text-[#0D47A1]">Refit a Victorian terrace bathroom</p>
                  </div>
                  <span className="rounded-full bg-[#E3F2FD] px-3 py-1.5 text-[10px] font-bold text-[#0D47A1]">Draft</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[["TRADE", "Bathroom fitter"], ["POSTCODE", "M20"], ["TIMING", "Within 2 months"], ["PROPERTY", "Victorian terrace"]].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-[#90CAF9] px-4 py-3"><p className="text-[9px] font-bold tracking-[0.14em] text-[#000000]">{label}</p><p className="mt-1.5 text-xs font-bold text-[#0D47A1]">{value}</p></div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-[#90CAF9] p-4">
                  <p className="text-[9px] font-bold tracking-[0.14em] text-[#000000]">JOB DETAILS</p>
                  <p className="mt-2 text-xs leading-6 text-[#000000]">Remove the current suite, retile the shower area and fit the supplied vanity and sanitaryware. Second-floor bathroom with on-street parking.</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {["Room", "Pipework", "Access"].map((label, index) => (
                    <div key={label} className="aspect-[4/3] rounded-xl bg-[#E3F2FD] p-2">
                      <div className="flex h-full items-end rounded-lg bg-[linear-gradient(145deg,#E3F2FD,#E3F2FD)] p-2"><span className="text-[9px] font-bold text-[#0D47A1]">{index + 1}. {label}</span></div>
                    </div>
                  ))}
                </div>
                <Link href="/post-a-job" className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-[#0D47A1] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#000000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2196F3]">Start your job post</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#0D47A1] py-16 text-white sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[.88fr_1.12fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#90CAF9]">Compare with confidence</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The lowest number is not always the best quote</h2>
              <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">A useful comparison starts with the same brief and ends with the detail behind each total. Ask questions where a quote is vague, unusually low or built around large allowances.</p>
              <div className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {COMPARE_ROWS.map(([title, body]) => (
                  <div key={title} className="flex gap-3">
                    <Tick inverse />
                    <div><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-white/60">{body}</p></div>
                  </div>
                ))}
              </div>
              <Link href="/cost-guides" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#90CAF9] transition hover:text-white">Explore UK cost guides <span aria-hidden="true">→</span></Link>
            </div>
            <QuoteComparisonVisual />
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[.76fr_1.24fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">Before work starts</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0D47A1] sm:text-4xl">Turn the chosen quote into a clear agreement</h2>
                <p className="mt-5 text-sm leading-7 text-[#000000] sm:text-base">Keep the agreed scope and key decisions in writing. It gives both homeowner and tradesperson a shared reference when the project moves from conversation to site.</p>
                <Link href="/questions" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0D47A1] hover:underline">Read homeowner questions <span aria-hidden="true">→</span></Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Write it down", "Record scope, materials, exclusions, total price and the process for approving changes."],
                  ["Set milestones", "Agree realistic dates and link staged payments to visible progress or delivered materials."],
                  ["Keep a record", "Save the quote, messages, invoices, certificates and photographs of completed stages."],
                ].map(([title, body], index) => (
                  <article key={title} className="rounded-[1.75rem] border border-[#90CAF9] p-6 shadow-[0_14px_40px_rgba(13,71,161,.06)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E3F2FD] text-sm font-bold text-[#0D47A1]">0{index + 1}</span>
                    <h3 className="mt-5 text-lg font-bold text-[#0D47A1]">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#000000]">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#90CAF9] bg-[#E3F2FD] py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D47A1]">Homeowner FAQs</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0D47A1] sm:text-4xl">A few things worth knowing</h2>
            </div>
            <div className="mt-10 space-y-3">
              {FAQS.map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-[#90CAF9] bg-white px-5 py-1 shadow-sm open:border-[#90CAF9] sm:px-6">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-sm font-bold text-[#0D47A1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2196F3] sm:text-base">
                    {question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-xl font-normal text-[#0D47A1] transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="max-w-3xl pb-5 pr-10 text-sm leading-7 text-[#000000]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0D47A1] px-6 py-10 text-white shadow-[0_24px_60px_rgba(13,71,161,.24)] sm:px-10 sm:py-12 lg:px-14">
              <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10" aria-hidden="true" />
              <div className="absolute bottom-0 right-32 hidden h-24 w-36 rounded-t-full bg-white/10 lg:block" aria-hidden="true" />
              <div className="relative max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">Ready when you are</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Describe the job once. Start better local conversations.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">Posting is free, there is no obligation to hire, and you decide which tradespeople you want to speak with.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/post-a-job" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D47A1] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#000000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Post a job free</Link>
                  <Link href="/all-trades" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Browse all trades</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
