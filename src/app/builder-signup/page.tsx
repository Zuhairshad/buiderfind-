"use client";

import { useState } from "react";
import Link from "next/link";

const TRADE_OPTIONS = [
  "Builder / General", "Plumber", "Electrician", "Roofer", "Plasterer",
  "Painter & Decorator", "Carpenter / Joiner", "Tiler", "Flooring Specialist",
  "Gardener / Landscaper", "Handyman", "Heating Engineer", "Bathroom Fitter",
  "Kitchen Fitter", "Window Fitter", "Driveway Specialist", "Extension Specialist", "Drainage",
];

const RADIUS_OPTIONS = ["5 miles", "10 miles", "15 miles", "20 miles", "30 miles", "50 miles", "Nationwide"];
const EXPERIENCE_OPTIONS = ["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"];

const STEPS = ["Account details", "Your business", "Coverage & bio"];

export default function BuilderSignupPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Step 2
  const [company, setCompany] = useState("");
  const [trades, setTrades] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [website, setWebsite] = useState("");

  // Step 3
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState("10 miles");
  const [bio, setBio] = useState("");
  const [agreed, setAgreed] = useState(false);

  const toggleTrade = (t: string) =>
    setTrades((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  async function completeSignup() {
    if (!agreed) return;
    setPending(true);
    setError("");
    const yearsByLabel: Record<string, number> = { "Less than 1 year": 0, "1–3 years": 2, "3–5 years": 4, "5–10 years": 7, "10+ years": 10 };
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "builder", firstName, lastName, email, phone, password, businessName: company, trades, yearsExperience: yearsByLabel[experience] ?? 0, website: website && !/^https?:\/\//i.test(website) ? `https://${website}` : website, basePostcode: postcode, coverageMiles: Number.parseInt(radius, 10) || 250, bio, acceptedTerms: agreed }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to create your account");
      setDone(true);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to create your account"); }
    finally { setPending(false); }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#E3F2FD] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#0D47A1] flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-[#0D47A1] mb-3">You&apos;re in!</h1>
        <p className="text-[16px] text-[#000000] max-w-sm mb-8 leading-relaxed">
          Your BuilderFind profile is being set up. You&apos;ll start receiving job leads in your area shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard" className="bg-[#0D47A1] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#000000] transition-all">
            Go to my dashboard →
          </Link>
          <Link href="/" className="border border-[#90CAF9] text-[#000000] font-semibold px-8 py-4 rounded-full hover:border-[#90CAF9] transition-all">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-[#90CAF9] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[20px] sm:text-[22px] font-bold flex-shrink-0">
            <span className="text-[#0D47A1]">Builder</span><span className="text-[#2196F3]">Find</span>
          </Link>
          <span className="text-[13px] text-[#000000] whitespace-nowrap">
            <span className="hidden sm:inline">Already have an account? </span>
            <Link href="/login" className="text-[#0D47A1] font-semibold hover:underline">Sign in</Link>
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[560px]">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center gap-0 mb-4">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0 transition-all ${
                    i + 1 < step ? "bg-[#0D47A1] text-white" : i + 1 === step ? "bg-[#0D47A1] text-white" : "bg-[#90CAF9] text-black/50"
                  }`}>
                    {i + 1 < step ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1.5 transition-all ${i + 1 < step ? "bg-[#0D47A1]" : "bg-[#90CAF9]"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {STEPS.map((s, i) => (
                <span key={s} className={`text-[11px] font-semibold ${i + 1 === step ? "text-[#0D47A1]" : i + 1 < step ? "text-[#0D47A1]" : "text-black/50"}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-[#90CAF9] p-8">
            {/* ── Step 1 ── */}
            {step === 1 && (
              <>
                <h2 className="text-[24px] font-bold text-[#0D47A1] mb-1.5">Create your account</h2>
                <p className="text-[14px] text-[#000000] mb-7">Free for your first 3 months — no credit card needed.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">First name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Last name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@smithbuilders.co.uk"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Mobile number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07700 900123"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="10+ chars, upper, lower, number & symbol"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <>
                <h2 className="text-[24px] font-bold text-[#0D47A1] mb-1.5">Your business</h2>
                <p className="text-[14px] text-[#000000] mb-7">Tell homeowners about your trade and experience.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Company / Trading name</label>
                    <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Smith Builders Ltd"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-2">Trades offered <span className="text-[#000000] font-normal">(select all that apply)</span></label>
                    <div className="flex flex-wrap gap-2">
                      {TRADE_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTrade(t)}
                          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                            trades.includes(t)
                              ? "bg-[#0D47A1] border-[#2196F3] text-white"
                              : "bg-white border-[#90CAF9] text-[#000000] hover:border-[#2196F3] hover:text-[#0D47A1]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Years in trade</label>
                      <select value={experience} onChange={e => setExperience(e.target.value)}
                        className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] text-[#000000] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all bg-white">
                        <option value="">Select...</option>
                        {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Website <span className="text-[#000000] font-normal">(optional)</span></label>
                      <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.smithbuilders.co.uk"
                        className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <>
                <h2 className="text-[24px] font-bold text-[#0D47A1] mb-1.5">Coverage &amp; profile</h2>
                <p className="text-[14px] text-[#000000] mb-7">Where do you work and tell us a bit about yourself.</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Your base postcode</label>
                      <input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="M1 1AB"
                        className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Willing to travel</label>
                      <select value={radius} onChange={e => setRadius(e.target.value)}
                        className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] text-[#000000] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all bg-white">
                        {RADIUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">About your business</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={5}
                      placeholder="Tell homeowners about your experience, qualifications, what makes you stand out, and the type of work you specialise in..."
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] resize-none focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all"
                    />
                    <p className="text-[11px] text-[#000000] mt-1.5">A strong bio gets 3× more enquiries from homeowners.</p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#2196F3] flex-shrink-0" />
                    <span className="text-[13px] text-[#000000] leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#0D47A1] hover:underline">Terms of Service</Link> and{" "}
                      <Link href="/privacy" className="text-[#0D47A1] hover:underline">Privacy Policy</Link>.
                      I confirm I hold valid public liability insurance.
                    </span>
                  </label>
                </div>
              </>
            )}

            {error ? <p role="alert" className="mt-6 rounded-xl bg-[#E3F2FD] px-4 py-3 text-[13px] font-medium text-[#0D47A1]">{error}</p> : null}

            {/* Navigation */}
            <div className="flex justify-between mt-8 gap-3">
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-6 py-3 border border-[#90CAF9] text-[#000000] font-semibold text-[14px] rounded-xl hover:border-[#90CAF9] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 px-8 py-3 bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[14px] rounded-xl transition-all shadow-sm ml-auto"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={completeSignup}
                  disabled={!agreed || pending}
                  className="flex items-center gap-2 px-8 py-3 bg-[#0D47A1] hover:bg-[#000000] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[14px] rounded-xl transition-all shadow-sm ml-auto"
                >
                  {pending ? "Creating account…" : "Complete signup"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-[12px] text-[#000000] mt-6">
            Free for your first 3 months · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
