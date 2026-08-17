"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"customer" | "builder">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, remember, expectedRole: tab }) });
      const result = await response.json() as { error?: string; user?: { role: "customer" | "builder" | "admin" } };
      if (!response.ok || !result.user) throw new Error(result.error || "Unable to sign in");
      router.push(result.user.role === "admin" ? "/admin/dashboard" : result.user.role === "builder" ? "/builder/dashboard" : "/customer/dashboard");
      router.refresh();
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to sign in"); }
    finally { setPending(false); }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex flex-col w-[44%] bg-gradient-to-br from-[#0D47A1] via-[#0D47A1] to-[#2196F3] p-14 text-white">
        <Link href="/" className="text-[28px] font-bold tracking-tight mb-auto">
          <span className="text-white">Builder</span><span className="text-[#2196F3]">Find</span>
        </Link>

        <div className="my-auto">
          <h2 className="text-[38px] font-bold leading-[1.15] mb-8 tracking-tight">
            The UK&apos;s easiest way<br />to find a trusted builder.
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { stat: "3", label: "Quotes maximum" },
              { stat: "£0", label: "To post a job" },
              { stat: "Live", label: "Job updates" },
            ].map((s) => (
              <div key={s.stat} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className="text-[22px] font-bold">{s.stat}</div>
                <div className="text-[11px] text-[#90CAF9] mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#90CAF9]">One secure workspace</p><ul className="mt-4 grid gap-3 text-[14px] text-[#E3F2FD]"><li>✓ Compare itemised quotes side by side</li><li>✓ Keep job messages and booking updates together</li><li>✓ Review only after completed BuilderFind work</li></ul></div>
        </div>

        <p className="text-[12px] text-[#90CAF9] mt-auto">© 2026 BuilderFind Ltd · Registered in England &amp; Wales</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-14 lg:px-16">
        <Link href="/" className="lg:hidden text-[26px] font-bold mb-10">
          <span className="text-[#0D47A1]">Builder</span><span className="text-[#2196F3]">Find</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <h1 className="text-[28px] font-bold text-[#0D47A1] mb-1.5 tracking-tight">Welcome back</h1>
          <p className="text-[14px] text-[#000000] mb-8">Sign in to your BuilderFind account</p>

          {/* Role tabs */}
          <div className="flex bg-[#E3F2FD] rounded-full p-1 mb-8">
            {(["customer", "builder"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                  tab === t ? "bg-white shadow-sm text-[#0D47A1]" : "text-[#000000]"
                }`}
              >
                {t === "customer" ? "I need a builder" : "I am a builder"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#000000] mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 border border-[#90CAF9] rounded-xl text-[14px] placeholder:text-black/50 focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-semibold text-[#000000]">Password</label>
                <Link href="/forgot-password" className="text-[12px] text-[#0D47A1] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 border border-[#90CAF9] rounded-xl text-[14px] placeholder:text-black/50 focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 hover:text-black/70 transition-colors"
                >
                  {showPw ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-[#2196F3] rounded"
              />
              <span className="text-[13px] text-[#000000]">Remember me for 30 days</span>
            </label>

            {error ? <p role="alert" className="rounded-xl bg-[#E3F2FD] px-4 py-3 text-[13px] font-medium text-[#0D47A1]">{error}</p> : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold py-4 rounded-xl text-[15px] transition-all shadow-sm mt-2"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-[#90CAF9] bg-[#E3F2FD] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0D47A1]">Explore the portals</p>
            <p className="mt-1 text-xs leading-5 text-black/70">Use these read-only previews while your account and MongoDB environment are being connected.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/dashboard/preview/customer" className="rounded-full border border-[#2196F3] bg-white px-3 py-2 text-xs font-bold text-[#0D47A1]">Hirer preview</Link>
              <Link href="/dashboard/preview/builder" className="rounded-full border border-[#2196F3] bg-white px-3 py-2 text-xs font-bold text-[#0D47A1]">Builder preview</Link>
            </div>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#90CAF9]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[12px] text-black/50">Don&apos;t have an account?</span>
            </div>
          </div>

          {tab === "builder" ? (
            <Link
              href="/builder-signup"
              className="block w-full text-center border-2 border-[#2196F3] text-[#0D47A1] hover:bg-[#000000] hover:text-white font-semibold py-3.5 rounded-xl text-[14px] transition-all"
            >
              Join as a builder — it&apos;s free →
            </Link>
          ) : (
            <Link
              href="/post-a-job"
              className="block w-full text-center border-2 border-[#2196F3] text-[#0D47A1] hover:bg-[#000000] hover:text-white font-semibold py-3.5 rounded-xl text-[14px] transition-all"
            >
              Post your first job — it&apos;s free →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
