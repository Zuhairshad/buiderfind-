"use client";

import Link from "next/link";
import { useState } from "react";

export default function PasswordRecoveryForm({ token }: { token: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try {
      const response = await fetch(token ? "/api/auth/reset-password" : "/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(token ? { token, password } : { email }) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error || "Unable to process this request");
      setMessage(result.message || (token ? "Your password has been updated." : "If the account exists, a secure reset link has been sent."));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to process this request"); }
    finally { setPending(false); }
  }
  return <section className="w-full max-w-lg rounded-3xl border border-[#90CAF9] bg-white p-8 shadow-[0_20px_60px_rgba(13,71,161,0.10)]"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0D47A1]">Account recovery</p><h1 className="mt-4 text-3xl font-bold text-[#0D47A1]">{token ? "Choose a new password" : "Reset your password"}</h1><p className="mt-3 text-sm leading-6 text-[#000000]">{token ? "Use a strong, unique password. Completing this reset signs out every existing session." : "Enter your account email. For privacy, BuilderFind always returns the same response whether or not an account exists."}</p><form onSubmit={submit} className="mt-7 grid gap-4">{token ? <label className="grid gap-1.5 text-sm font-bold text-[#0D47A1]">New password<input required minLength={10} autoComplete="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="10+ characters with upper, lower, number and symbol" className="rounded-xl border border-[#90CAF9] px-4 py-3 font-normal"/></label> : <label className="grid gap-1.5 text-sm font-bold text-[#0D47A1]">Email address<input required autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.co.uk" className="rounded-xl border border-[#90CAF9] px-4 py-3 font-normal"/></label>}{error ? <p role="alert" className="rounded-xl bg-[#E3F2FD] p-3 text-sm font-semibold text-[#0D47A1]">{error}</p> : null}{message ? <p role="status" className="rounded-xl bg-[#E3F2FD] p-3 text-sm font-semibold text-[#0D47A1]">{message}</p> : null}<button disabled={pending} className="rounded-full bg-[#0D47A1] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Please wait…" : token ? "Update password" : "Send reset link"}</button></form><Link href="/login" className="mt-5 inline-block text-sm font-bold text-[#0D47A1]">← Back to sign in</Link></section>;
}
