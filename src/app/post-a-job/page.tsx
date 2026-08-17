"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { name: "Builder / General", sub: "Extensions, conversions, new builds" },
  { name: "Plumber", sub: "Boiler, bathroom, emergency" },
  { name: "Electrician", sub: "Rewiring, fuse boards, EV charging" },
  { name: "Roofer", sub: "Repairs, replacements, guttering" },
  { name: "Plasterer", sub: "Skim coat, rendering, dry lining" },
  { name: "Painter & Decorator", sub: "Interior, exterior, wallpapering" },
  { name: "Carpenter / Joiner", sub: "Doors, windows, fitted furniture" },
  { name: "Tiler", sub: "Walls, floors, wet rooms" },
  { name: "Flooring Specialist", sub: "Laminate, hardwood, vinyl" },
  { name: "Gardener / Landscaper", sub: "Landscaping, maintenance, design" },
  { name: "Handyman", sub: "Odd jobs, repairs, fixes" },
  { name: "Heating Engineer", sub: "Boiler install, central heating" },
  { name: "Kitchen Fitter", sub: "Supply & fit, remodel" },
  { name: "Bathroom Fitter", sub: "Full fit-out, refurb" },
  { name: "Window Fitter", sub: "Windows, doors, glazing" },
  { name: "Driveway Specialist", sub: "Block paving, tarmac, resin" },
  { name: "Extension Specialist", sub: "Rear, side, loft conversions" },
  { name: "Drainage", sub: "Blockages, surveys, drain repairs" },
];

const STEPS = ["Trade", "Job details", "Location & timing", "Your details"];

const TIMELINE_OPTIONS = [
  { label: "As soon as possible", icon: "⚡" },
  { label: "Within a week", icon: "📅" },
  { label: "Within a month", icon: "🗓️" },
  { label: "I'm flexible", icon: "✌️" },
];

const BUDGET_OPTIONS = [
  "Under £500", "£500 – £1,000", "£1,000 – £5,000",
  "£5,000 – £15,000", "£15,000 – £50,000", "£50,000+", "Not sure yet",
];

export default function PostAJobPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedInRole, setSignedInRole] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState("");
  const [uploadWarning, setUploadWarning] = useState("");

  // Step 1
  const [category, setCategory] = useState("");

  // Step 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  // Step 3
  const [postcode, setPostcode] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");

  // Step 4
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (!response.ok) return;
      const result = await response.json() as { user?: { role: string; firstName: string; lastName: string; email: string; phone?: string } };
      setSignedInRole(result.user?.role ?? "");
      if (result.user?.role === "customer") {
        setSignedIn(true); setFirstName(result.user.firstName); setLastName(result.user.lastName); setEmail(result.user.email); setPhone(result.user.phone ?? "");
      }
    }).catch(() => undefined);
  }, []);

  async function submitJob() {
    if (!agreed) return;
    setPending(true);
    setError("");
    try {
      if (signedInRole && signedInRole !== "customer") throw new Error("Sign out of your trade or admin account, then use a hirer account to post a job.");
      if (!signedIn) {
        const registration = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "customer", firstName, lastName, email, phone, password, acceptedTerms: agreed }) });
        const registrationResult = await registration.json() as { error?: string };
        if (!registration.ok) throw new Error(registrationResult.error || "Unable to create your hirer account");
        setSignedIn(true);
        setSignedInRole("customer");
      }
      const ranges: Record<string, { budgetMin?: number; budgetMax?: number }> = { "Under £500": { budgetMax: 500 }, "£500 – £1,000": { budgetMin: 500, budgetMax: 1000 }, "£1,000 – £5,000": { budgetMin: 1000, budgetMax: 5000 }, "£5,000 – £15,000": { budgetMin: 5000, budgetMax: 15000 }, "£15,000 – £50,000": { budgetMin: 15000, budgetMax: 50000 }, "£50,000+": { budgetMin: 50000 } };
      const response = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trade: category, title, description, postcode, preferredStart: timeline, budgetLabel: budget, ...(ranges[budget] ?? {}) }) });
      const result = await response.json() as { error?: string; job?: { id: string } };
      if (!response.ok || !result.job) throw new Error(result.error || "Unable to post your job");
      setJobId(result.job.id);
      if (photos.length) {
        try {
          const mediaIds = await Promise.all(photos.map(async (file) => { const form = new FormData(); form.set("file", file); form.set("purpose", "job"); const upload = await fetch("/api/uploads", { method: "POST", body: form }); const uploadResult = await upload.json() as { error?: string; media?: { id: string } }; if (!upload.ok || !uploadResult.media) throw new Error(uploadResult.error || "A photo could not be uploaded"); return uploadResult.media.id; }));
          const attach = await fetch(`/api/jobs/${result.job.id}/media`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaIds }) });
          if (!attach.ok) throw new Error("Photos could not be attached");
        } catch (photoError) { setUploadWarning(photoError instanceof Error ? `Your job is live, but ${photoError.message.toLowerCase()}. You can add photos later from the dashboard.` : "Your job is live, but its photos could not be added."); }
      }
      setSubmitted(true);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to post your job"); }
    finally { setPending(false); }
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] bg-[#E3F2FD] flex flex-col items-center justify-center px-6 text-center py-20">
          <div className="w-20 h-20 rounded-full bg-[#0D47A1] flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[32px] font-bold text-[#0D47A1] mb-3">Job posted!</h1>
          <p className="text-[16px] text-[#000000] max-w-md mb-2 leading-relaxed">
            Your job has been posted to local builders in your area.
          </p>
          <p className="text-[14px] text-[#000000] max-w-md mb-10">
            You&apos;ll receive up to 3 quotes by email, usually within 24 hours.
          </p>
          {uploadWarning ? <p role="status" className="mb-6 max-w-md rounded-xl bg-[#E3F2FD] px-4 py-3 text-[13px] font-semibold text-[#0D47A1]">{uploadWarning}</p> : null}
          <div className="bg-white rounded-2xl border border-[#90CAF9] shadow-sm p-6 max-w-sm w-full mb-8 text-left">
            <p className="text-[11px] font-semibold text-[#0D47A1] uppercase tracking-wider mb-3">Your job summary</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#000000]">Trade</span>
                <span className="font-semibold text-[#000000]">{category}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#000000]">Job</span>
                <span className="font-semibold text-[#000000] text-right max-w-[200px]">{title}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#000000]">Location</span>
                <span className="font-semibold text-[#000000]">{postcode}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#000000]">Timeline</span>
                <span className="font-semibold text-[#000000]">{timeline}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4"><Link href="/customer/dashboard" className="rounded-full bg-[#0D47A1] px-6 py-3 text-[14px] font-semibold text-white">Open hirer dashboard</Link><Link href={`/customer/dashboard?job=${jobId}`} className="py-3 text-[#0D47A1] font-semibold hover:underline text-[14px]">View this job →</Link></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#E3F2FD] min-h-[calc(100vh-72px)] py-12">
        <div className="max-w-[680px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[30px] font-bold text-[#0D47A1] mb-2 tracking-tight">Post a job — it&apos;s free</h1>
            <p className="text-[14px] text-[#000000]">Get up to 3 quotes from verified local builders. No obligations.</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center gap-0 mb-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 transition-all ${
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

          <div className="bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.07)] border border-[#90CAF9] p-8">
            {/* ── Step 1: Trade ── */}
            {step === 1 && (
              <>
                <h2 className="text-[20px] font-bold text-[#0D47A1] mb-1.5">What type of tradesperson do you need?</h2>
                <p className="text-[13px] text-[#000000] mb-6">Select the category that best matches your job.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => { setCategory(c.name); setStep(2); }}
                      className={`text-left p-4 rounded-2xl border-2 transition-all hover:border-[#2196F3] hover:bg-[#E3F2FD] ${
                        category === c.name ? "border-[#2196F3] bg-[#E3F2FD]" : "border-[#90CAF9] bg-white"
                      }`}
                    >
                      <p className="text-[13px] font-semibold text-[#0D47A1]">{c.name}</p>
                      <p className="text-[11px] text-[#000000] mt-0.5 leading-tight">{c.sub}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 2: Job details ── */}
            {step === 2 && (
              <>
                <h2 className="text-[20px] font-bold text-[#0D47A1] mb-1.5">Tell us about the job</h2>
                <p className="text-[13px] text-[#000000] mb-6">The more detail you give, the better the quotes you&apos;ll receive.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Job title <span className="text-[#000000] font-normal">(keep it brief)</span></label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder={`e.g. ${category} needed for 3-bed house`}
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Job description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={6}
                      placeholder="Describe the job in detail. Include measurements, materials, access, and any other relevant information that will help builders quote accurately..."
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] resize-none focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all"
                    />
                    <p className="text-[11px] text-[#000000] mt-1.5">Detailed descriptions receive 2× more quotes on average.</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Add photos <span className="text-[#000000] font-normal">(optional but recommended)</span></label>
                    <label className="block border-2 border-dashed border-[#90CAF9] rounded-xl p-8 text-center hover:border-[#2196F3] transition-all cursor-pointer">
                      <svg className="w-8 h-8 mx-auto text-black/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-[13px] text-[#000000]">Click to upload or drag &amp; drop</p>
                      <p className="text-[11px] text-[#90CAF9] mt-1">JPG, PNG up to 10MB each</p>
                      <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => setPhotos(Array.from(event.target.files ?? []).slice(0, 8))} />
                    </label>
                    {photos.length ? <p className="mt-2 text-[12px] font-semibold text-[#0D47A1]">{photos.length} photo{photos.length === 1 ? "" : "s"} selected</p> : null}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: Location & timing ── */}
            {step === 3 && (
              <>
                <h2 className="text-[20px] font-bold text-[#0D47A1] mb-1.5">Location &amp; timing</h2>
                <p className="text-[13px] text-[#000000] mb-6">Help us match you with builders in your area.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Your postcode</label>
                    <input
                      value={postcode}
                      onChange={e => setPostcode(e.target.value)}
                      placeholder="e.g. M1 1AB"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-3">When do you need the work done?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIMELINE_OPTIONS.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => setTimeline(o.label)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            timeline === o.label ? "border-[#2196F3] bg-[#E3F2FD]" : "border-[#90CAF9] hover:border-[#2196F3] hover:bg-[#E3F2FD]"
                          }`}
                        >
                          <span className="text-[20px]">{o.icon}</span>
                          <span className="text-[13px] font-semibold text-[#000000]">{o.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-3">What&apos;s your budget?</label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_OPTIONS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={`px-4 py-2 rounded-full border-2 text-[13px] font-semibold transition-all ${
                            budget === b ? "border-[#2196F3] bg-[#0D47A1] text-white" : "border-[#90CAF9] text-[#000000] hover:border-[#2196F3] hover:text-[#0D47A1]"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 4: Contact details ── */}
            {step === 4 && (
              <>
                <h2 className="text-[20px] font-bold text-[#0D47A1] mb-1.5">Your contact details</h2>
                <p className="text-[13px] text-[#000000] mb-6">{signedIn ? "Your hirer account is signed in." : "Create your secure hirer account and receive quotes in one place."}</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">First name</label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane"
                        className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Last name</label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe"
                        className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                    <p className="text-[11px] text-[#000000] mt-1.5">We&apos;ll send quotes to this email address.</p>
                  </div>
                  {!signedIn ? <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Create a password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" placeholder="10+ characters with upper, lower, number and symbol"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div> : null}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Phone number <span className="text-[#000000] font-normal">(optional)</span></label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07700 900123"
                      className="w-full px-4 py-3 border border-[#90CAF9] rounded-xl text-[14px] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all" />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer mt-2">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#2196F3] flex-shrink-0" />
                    <span className="text-[13px] text-[#000000] leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#0D47A1] hover:underline">Terms of Service</Link> and{" "}
                      <Link href="/privacy" className="text-[#0D47A1] hover:underline">Privacy Policy</Link>.
                      I understand up to 3 builders may contact me.
                    </span>
                  </label>
                </div>
              </>
            )}

            {error ? <p role="alert" className="mt-6 rounded-xl bg-[#E3F2FD] px-4 py-3 text-[13px] font-medium text-[#0D47A1]">{error}</p> : null}

            {/* Navigation */}
            {step > 1 && (
              <div className="flex justify-between mt-8 gap-3">
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-6 py-3 border border-[#90CAF9] text-[#000000] font-semibold text-[14px] rounded-xl hover:border-[#90CAF9] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                {step < 4 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[14px] rounded-xl transition-all shadow-sm"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={submitJob}
                    disabled={!agreed || pending}
                    className="flex items-center gap-2 px-8 py-3 bg-[#0D47A1] hover:bg-[#000000] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[14px] rounded-xl transition-all shadow-sm"
                  >
                    {pending ? "Posting securely…" : "Post my job — it’s free"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-[12px] text-[#0D47A1] mt-6">
            100% free · No obligations · Up to 3 quotes
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
