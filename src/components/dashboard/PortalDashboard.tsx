"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "customer" | "builder" | "admin";
type DataRecord = Record<string, unknown>;

function record(value: unknown): DataRecord { return value && typeof value === "object" && !Array.isArray(value) ? value as DataRecord : {}; }
function list(value: unknown): DataRecord[] { return Array.isArray(value) ? value.map(record) : []; }
function stringList(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function text(value: unknown, fallback = "—") { return typeof value === "string" && value ? value : fallback; }
function number(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value : 0; }
function idOf(value: DataRecord) { return text(value.id, ""); }
function money(value: unknown) { return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(number(value)); }
function date(value: unknown) { const parsed = typeof value === "string" ? new Date(value) : null; return parsed && !Number.isNaN(parsed.valueOf()) ? parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"; }
function label(value: unknown) { return text(value).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }

const ROLE_COPY: Record<Role, { eyebrow: string; title: string; intro: string }> = {
  customer: { eyebrow: "Hirer portal", title: "Manage your home projects", intro: "Compare quotes, agree work, message your builder and keep every milestone in one place." },
  builder: { eyebrow: "Trade dashboard", title: "Turn local leads into booked work", intro: "Review matched jobs, send complete quotes and keep customers updated from first message to review." },
  admin: { eyebrow: "Operations console", title: "Keep the marketplace trusted", intro: "Review verification evidence, monitor marketplace activity and control launch-ready commercial features." },
};

const PREVIEW_SNAPSHOTS: Record<"customer" | "builder", DataRecord> = {
  customer: {
    role: "customer",
    user: { id: "preview-customer", firstName: "Amelia", lastName: "Hughes", email: "amelia.hughes@example.com" },
    stats: { active_jobs: 2, quotes_received: 5, booked_projects: 1, unread_messages: 2 },
    jobs: [
      { id: "preview-job-1", trade: "Extensions", postcode: "M20 4BX", title: "Single-storey kitchen extension", budgetLabel: "£45,000–£60,000", quoteCount: 3, status: "quoting" },
      { id: "preview-job-2", trade: "Plumbing", postcode: "M20 4BX", title: "Replace an ageing combi boiler", budgetLabel: "£2,000–£3,000", quoteCount: 2, status: "open" },
    ],
    quotes: [
      { id: "preview-quote-1", builderBusinessName: "North & Stone Build Co.", builderVerified: true, builderRating: 4.9, builderReviewCount: 38, amount: 52400, estimatedDurationDays: 42, validUntil: "2026-09-12", message: "A detailed, staged proposal covering foundations, steelwork, insulation, plastering and final decoration.", status: "submitted" },
      { id: "preview-quote-2", builderBusinessName: "Riverside Projects", builderVerified: true, builderRating: 4.8, builderReviewCount: 24, amount: 57800, estimatedDurationDays: 39, validUntil: "2026-09-15", message: "Includes a dedicated site manager, weekly progress notes and a clear schedule of payment stages.", status: "accepted" },
    ],
    notifications: [],
  },
  builder: {
    role: "builder",
    user: { id: "preview-builder", firstName: "Daniel", lastName: "Evans", email: "daniel@evans-building.example" },
    stats: { matched_leads: 4, quotes_sent: 8, booked_jobs: 3, profile_views: 42 },
    profile: { businessName: "Evans Building & Joinery", trades: ["Builders", "Carpenters"], basePostcode: "LS6 2AB", coverageMiles: 25, verificationStatus: "verified", bio: "A small Leeds team delivering extensions, renovations and joinery with clear scopes and tidy sites.", services: ["House extensions", "Kitchen renovations", "Structural alterations"] },
    leads: [
      { id: "preview-lead-1", trade: "Builders", postcode: "LS17 8QJ", title: "Rear extension and kitchen renovation", description: "Homeowner has drawings ready and is looking for an itemised quote for a 24m² rear extension.", status: "open" },
      { id: "preview-lead-2", trade: "Carpentry", postcode: "LS8 4HT", title: "Bespoke staircase and landing", description: "A measured staircase replacement with oak handrail, newel posts and decoration required this autumn.", status: "open" },
    ],
    quotes: [{ id: "preview-builder-quote-1", amount: 18600, createdAt: "2026-08-11", status: "submitted" }, { id: "preview-builder-quote-2", amount: 9200, createdAt: "2026-08-06", status: "accepted" }],
    notifications: [],
  },
};

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers });
  const result: unknown = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(text(record(result).error, "Something went wrong"));
  return record(result);
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function Status({ value }: { value: unknown }) {
  const state = text(value, "unknown");
  let cls = "";
  if (["verified", "accepted", "confirmed", "completed"].includes(state)) {
    cls = "bg-[#0D47A1] text-white";
  } else if (["awarded", "in_progress", "quoting", "active"].includes(state)) {
    cls = "bg-[#2196F3] text-white";
  } else if (["open", "submitted", "pending", "unsubmitted"].includes(state)) {
    cls = "border border-[#2196F3] text-[#2196F3]";
  } else if (["draft", "rejected", "declined", "expired", "withdrawn", "suspended"].includes(state)) {
    cls = "border border-black/10 dark:border-white/10 text-black dark:text-white";
  } else if (["customer", "builder"].includes(state)) {
    cls = "border border-[#2196F3]/30 text-[#2196F3]";
  } else {
    cls = "border border-black/10 dark:border-white/10 text-black dark:text-white";
  }
  return (
    <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold capitalize ${cls}`}>
      {state.replaceAll("_", " ")}
    </span>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

function Panel({ title, action, children, id }: { title: string; action?: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="overflow-hidden border border-black dark:border-white/[0.12] bg-white dark:bg-[#1a1a1a]">
      <div className="flex items-center justify-between gap-4 border-b border-black dark:border-white/[0.12] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function Empty({ title, body, cta }: { title: string; body?: string; cta?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-black/10 dark:border-white/10 px-6 py-10 text-center">
      <p className="text-sm font-medium text-black dark:text-white">{title}</p>
      {body ? <p className="mt-1.5 text-xs leading-5 text-black dark:text-white">{body}</p> : null}
      {cta ? <div className="mt-4">{cta}</div> : null}
    </div>
  );
}

// ─── ActionButton ─────────────────────────────────────────────────────────────

function ActionButton({ children, onClick, tone = "blue", disabled = false }: { children: React.ReactNode; onClick: () => Promise<void>; tone?: "blue" | "red" | "dark"; disabled?: boolean }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const cls = tone === "red" || tone === "dark"
    ? "bg-black dark:bg-[#2a2a2a] hover:bg-[#0D47A1] text-white"
    : "bg-[#2196F3] hover:bg-[#0D47A1] text-white";
  return (
    <button
      disabled={disabled || pending}
      onClick={async () => { setPending(true); setFailed(false); try { await onClick(); } catch { setFailed(true); } finally { setPending(false); } }}
      className={`${cls} px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40`}
      aria-live="polite"
    >
      {pending ? "Working…" : failed ? "Failed — retry" : children}
    </button>
  );
}

// ─── StageProgress ────────────────────────────────────────────────────────────

const JOB_STAGES = ["draft", "open", "quoting", "awarded", "in_progress", "completed"] as const;

function StageProgress({ status }: { status: unknown }) {
  const current = text(status, "draft");
  const currentIndex = JOB_STAGES.indexOf(current as typeof JOB_STAGES[number]);
  const stageLabels: Record<string, string> = { draft: "Draft", open: "Open", quoting: "Quoting", awarded: "Awarded", in_progress: "In progress", completed: "Complete" };
  return (
    <div className="mt-4 flex items-center gap-1" aria-label={`Job stage: ${stageLabels[current] ?? current}`}>
      {JOB_STAGES.map((stage, index) => (
        <div key={stage} className="flex flex-1 items-center gap-1">
          <div className={`h-2 w-2 shrink-0 ${index < currentIndex ? "bg-[#2196F3]" : index === currentIndex ? "bg-[#2196F3] ring-2 ring-[#2196F3]/25" : "bg-black/10 dark:bg-white/10"}`} title={stageLabels[stage]} />
          {index < JOB_STAGES.length - 1 && <div className={`h-px flex-1 ${index < currentIndex ? "bg-[#2196F3]/40" : "bg-black/[0.06] dark:bg-white/[0.1]"}`} />}
        </div>
      ))}
      <span className="ml-2 text-[10px] font-medium text-black dark:text-white">{stageLabels[current] ?? label(current)}</span>
    </div>
  );
}

// ─── QuoteComposer ────────────────────────────────────────────────────────────

function QuoteComposer({ job, onDone }: { job: DataRecord; onDone: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState("");
  const [duration, setDuration] = useState("1");
  if (!open) return (
    <button onClick={() => setOpen(true)} className="bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0D47A1]">
      Quote this job
    </button>
  );
  const inputCls = "border border-black dark:border-white/[0.12] bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-black dark:text-white outline-none focus:border-[#2196F3] dark:placeholder:text-white/30";
  return (
    <form
      className="mt-4 grid gap-3 border border-black dark:border-white/[0.12] bg-white dark:bg-[#1a1a1a] p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        try {
          const availableFrom = new Date(Date.now() + 86_400_000);
          const validUntil = new Date(Date.now() + 14 * 86_400_000);
          await request(`/api/jobs/${idOf(job)}/quotes`, { method: "POST", body: JSON.stringify({ amount: Number(amount), message, scope: scope.split("\n").map((item) => item.trim()).filter(Boolean), exclusions: [], estimatedDurationDays: Number(duration), availableFrom, validUntil }) });
          setOpen(false);
          await onDone();
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Could not send quote");
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input required min="1" step="1" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Total quote (£)" className={inputCls} />
        <input required min="1" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Working days" className={inputCls} />
      </div>
      <textarea required minLength={20} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Explain your approach, timing and assumptions" className={`min-h-24 ${inputCls}`} />
      <textarea required value={scope} onChange={(e) => setScope(e.target.value)} placeholder="Included work — one item per line" className={`min-h-20 ${inputCls}`} />
      {error ? <p role="alert" className="text-xs text-[#2196F3]">{error}</p> : null}
      <div className="flex gap-2">
        <button disabled={pending} className="bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">{pending ? "Sending…" : "Submit quote"}</button>
        <button type="button" onClick={() => setOpen(false)} className="border border-black dark:border-white/[0.12] px-4 py-2 text-xs font-semibold text-black dark:text-white hover:text-black dark:hover:text-white">Cancel</button>
      </div>
    </form>
  );
}

// ─── BuilderProfileEditor ─────────────────────────────────────────────────────

function BuilderProfileEditor({ profile, onDone }: { profile: DataRecord; onDone: () => Promise<void> }) {
  const [editing, setEditing] = useState(false); const [pending, setPending] = useState(false); const [message, setMessage] = useState("");
  const [businessName, setBusinessName] = useState(text(profile.businessName, "")); const [bio, setBio] = useState(text(profile.bio, "")); const [postcode, setPostcode] = useState(text(profile.basePostcode, "")); const [coverage, setCoverage] = useState(String(number(profile.coverageMiles) || 10)); const [services, setServices] = useState(stringList(profile.services).join("\n")); const [files, setFiles] = useState<File[]>([]);
  const inputCls = "border border-black dark:border-white/[0.12] bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-black dark:text-white outline-none focus:border-[#2196F3]";
  async function save(event: React.FormEvent) { event.preventDefault(); setPending(true); setMessage(""); try { await request("/api/profile", { method: "PATCH", body: JSON.stringify({ businessName, bio, basePostcode: postcode, coverageMiles: Number(coverage), services: services.split("\n").map((item) => item.trim()).filter(Boolean) }) }); setMessage("Profile saved"); setEditing(false); await onDone(); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Profile update failed"); } finally { setPending(false); } }
  async function submitVerification() { setPending(true); setMessage(""); try { if (!files.length) throw new Error("Choose at least one insurance or qualification document"); const mediaIds: string[] = []; for (const file of files) { const form = new FormData(); form.set("file", file); form.set("purpose", "verification"); const response = await fetch("/api/uploads", { method: "POST", body: form }); const result = record(await response.json()); if (!response.ok) throw new Error(text(result.error, "Document upload failed")); mediaIds.push(idOf(record(result.media))); } await request("/api/profile/verification", { method: "POST", body: JSON.stringify({ mediaIds }) }); setFiles([]); setMessage("Verification submitted for review"); await onDone(); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Verification submission failed"); } finally { setPending(false); } }
  return (
    <div className="mt-4 border-t border-black dark:border-white/[0.12] pt-4">
      {editing ? (
        <form onSubmit={save} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className={inputCls} />
            <input required value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="Base postcode" className={inputCls} />
          </div>
          <textarea required minLength={40} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Business profile" className={`min-h-28 ${inputCls}`} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required min="1" max="250" type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} placeholder="Coverage miles" className={inputCls} />
            <textarea value={services} onChange={(e) => setServices(e.target.value)} placeholder="Services — one per line" className={`min-h-20 ${inputCls}`} />
          </div>
          <div className="flex gap-2">
            <button disabled={pending} className="bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white">Save profile</button>
            <button type="button" onClick={() => setEditing(false)} className="border border-black dark:border-white/[0.12] px-4 py-2 text-xs font-semibold text-black dark:text-white">Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setEditing(true)} className="border border-[#2196F3] px-4 py-2 text-xs font-semibold text-[#2196F3] transition hover:bg-[#2196F3] hover:text-white">Edit public profile</button>
      )}
      {["unsubmitted", "rejected"].includes(text(profile.verificationStatus, "unsubmitted")) ? (
        <div className="mt-4 border border-black dark:border-white/[0.12] p-4">
          <label className="block text-xs font-semibold text-black dark:text-white">Insurance or qualification evidence
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 8))} className="mt-2 block w-full text-xs dark:text-white" />
          </label>
          <button disabled={pending || !files.length} onClick={() => void submitVerification()} className="mt-3 bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">Submit verification</button>
        </div>
      ) : null}
      {message ? <p role="status" className="mt-3 text-xs font-semibold text-[#2196F3]">{message}</p> : null}
    </div>
  );
}

// ─── ReviewComposer ───────────────────────────────────────────────────────────

function ReviewComposer({ booking, onDone }: { booking: DataRecord; onDone: () => Promise<void> }) {
  const [open, setOpen] = useState(false); const [rating, setRating] = useState("5"); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  const inputCls = "border border-black dark:border-white/[0.12] bg-white dark:bg-[#111] px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-[#2196F3]";
  if (!open) return <button onClick={() => setOpen(true)} className="border border-[#2196F3] px-4 py-2 text-xs font-semibold text-[#2196F3] transition hover:bg-[#2196F3] hover:text-white">Leave review</button>;
  return (
    <form onSubmit={async (event) => { event.preventDefault(); setPending(true); setMessage(""); try { await request("/api/reviews", { method: "POST", body: JSON.stringify({ bookingId: idOf(booking), rating: Number(rating), title, body }) }); setOpen(false); await onDone(); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Review failed"); } finally { setPending(false); } }} className="mt-3 grid w-full gap-2 border border-black dark:border-white/[0.12] p-4">
      <select value={rating} onChange={(e) => setRating(e.target.value)} className={inputCls}>
        <option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Satisfactory</option><option value="2">2 — Poor</option><option value="1">1 — Very poor</option>
      </select>
      <input required minLength={3} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title" className={inputCls} />
      <textarea required minLength={20} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe the completed work and your experience" className={`min-h-20 ${inputCls}`} />
      {message ? <p className="text-xs text-[#2196F3]">{message}</p> : null}
      <button disabled={pending} className="bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white">Publish review</button>
    </form>
  );
}

// ─── AccountSettings ──────────────────────────────────────────────────────────

function AccountSettings({ user, onDone }: { user: DataRecord; onDone: () => Promise<void> }) {
  const preferences = record(user.notificationPreferences); const [open, setOpen] = useState(false); const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const [firstName, setFirstName] = useState(text(user.firstName, "")); const [lastName, setLastName] = useState(text(user.lastName, "")); const [phone, setPhone] = useState(text(user.phone, "")); const [emailAlerts, setEmailAlerts] = useState(preferences.email !== false); const [smsAlerts, setSmsAlerts] = useState(preferences.sms === true); const [weekly, setWeekly] = useState(preferences.weeklySummary === true);
  const inputCls = "border border-black dark:border-white/[0.12] bg-white dark:bg-[#111] px-3 py-2.5 text-sm text-black dark:text-white outline-none focus:border-[#2196F3]";
  if (!open) return (
    <Panel title="Account settings" id="account">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-black dark:text-white">{text(user.email)}</p>
          <p className="mt-0.5 text-xs text-black dark:text-white">Manage contact details and notification delivery.</p>
        </div>
        <button onClick={() => setOpen(true)} className="border border-[#2196F3] px-4 py-2 text-xs font-semibold text-[#2196F3] transition hover:bg-[#2196F3] hover:text-white">Edit settings</button>
      </div>
    </Panel>
  );
  return (
    <Panel title="Account settings" id="account">
      <form onSubmit={async (event) => { event.preventDefault(); setPending(true); setMessage(""); try { await request("/api/account", { method: "PATCH", body: JSON.stringify({ firstName, lastName, phone, notificationPreferences: { email: emailAlerts, sms: smsAlerts, inApp: true, weeklySummary: weekly } }) }); setMessage("Settings saved"); setOpen(false); await onDone(); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Settings update failed"); } finally { setPending(false); } }} className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputCls} />
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputCls} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" className={inputCls} />
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2 text-black dark:text-white"><input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="accent-[#2196F3]" /> Email alerts</label>
          <label className="flex items-center gap-2 text-black dark:text-white"><input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="accent-[#2196F3]" /> SMS alerts</label>
          <label className="flex items-center gap-2 text-black dark:text-white"><input type="checkbox" checked={weekly} onChange={(e) => setWeekly(e.target.checked)} className="accent-[#2196F3]" /> Weekly summary</label>
        </div>
        {message ? <p role="status" className="text-xs text-[#2196F3]">{message}</p> : null}
        <div className="flex gap-2">
          <button disabled={pending} className="bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white">Save settings</button>
          <button type="button" onClick={() => setOpen(false)} className="border border-black dark:border-white/[0.12] px-4 py-2 text-xs font-semibold text-black dark:text-white">Cancel</button>
        </div>
      </form>
    </Panel>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({ label: navLabel, href, active }: { label: string; href: string; active?: boolean }) {
  return (
    <a href={href} className={`flex items-center px-3 py-2 text-sm transition ${active ? "bg-[#2196F3]/[0.08] dark:bg-[#2196F3]/[0.15] font-semibold text-[#2196F3]" : "font-medium text-black dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white"}`}>
      {navLabel}
    </a>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function PortalDashboard({ expectedRole, preview = false }: { expectedRole: Role; preview?: boolean }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [snapshot, setSnapshot] = useState<DataRecord | null>(() => preview && expectedRole !== "admin" ? PREVIEW_SNAPSHOTS[expectedRole] : null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [connected, setConnected] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const load = useCallback(async () => { try { const next = await request("/api/dashboard"); if (next.role !== expectedRole) { router.replace(`/${text(next.role, "customer")}/dashboard`); return; } setSnapshot(next); setError(""); } catch (caught) { setError(caught instanceof Error ? caught.message : "Dashboard unavailable"); } }, [expectedRole, router]);
  const mutate = useCallback(async (path: string, body: DataRecord) => { setNotice(""); try { await request(path, { method: "PATCH", body: JSON.stringify(body) }); setNotice("Saved"); await load(); } catch (caught) { setNotice(caught instanceof Error ? caught.message : "Action failed"); } }, [load]);

  useEffect(() => { if (preview) return; const initial = window.setTimeout(() => void load(), 0); const fallback = window.setInterval(() => void load(), 30_000); return () => { window.clearTimeout(initial); window.clearInterval(fallback); }; }, [load, preview]);
  useEffect(() => {
    if (preview || process.env.NEXT_PUBLIC_REALTIME_ENABLED === "false") return;
    let socket: WebSocket | null = null; let retry: ReturnType<typeof setTimeout> | null = null; let stopped = false; let attempts = 0;
    const connect = () => { const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"; socket = new WebSocket(`${protocol}//${window.location.host}/api/realtime`); socket.addEventListener("open", () => { attempts = 0; setConnected(true); socket?.send(JSON.stringify({ type: "resume", lastSequence: Number(sessionStorage.getItem("bf-last-event") ?? 0) })); }); socket.addEventListener("message", (event) => { try { const incoming = record(JSON.parse(String(event.data))); if (typeof incoming.sequence === "number" && incoming.sequence > 0) sessionStorage.setItem("bf-last-event", String(incoming.sequence)); if (refreshTimer.current) clearTimeout(refreshTimer.current); refreshTimer.current = setTimeout(() => void load(), 250); } catch { /* ignore */ } }); socket.addEventListener("close", () => { setConnected(false); if (!stopped) retry = setTimeout(connect, Math.min(30_000, 1_000 * 2 ** attempts++)); }); socket.addEventListener("error", () => socket?.close()); };
    connect(); return () => { stopped = true; if (retry) clearTimeout(retry); if (refreshTimer.current) clearTimeout(refreshTimer.current); socket?.close(); };
  }, [load, preview]);

  const data = snapshot ?? {};
  const user = record(data.user);
  const stats = record(data.stats);
  const jobs = list(data.jobs);
  const leads = list(data.leads);
  const quotes = list(data.quotes);
  const bookings = list(data.bookings);
  const verifications = list(data.verificationRequests);
  const recentUsers = list(data.recentUsers);
  const flags = list(data.featureFlags);
  const profile = record(data.profile);
  const copy = ROLE_COPY[expectedRole];
  const statEntries = useMemo(() => Object.entries(stats).filter(([, value]) => typeof value === "number").slice(0, 4), [stats]);
  const builderProfileStrength = useMemo(() => {
    if (expectedRole !== "builder") return 0;
    const checks = [profile.businessName, profile.bio, profile.basePostcode, profile.coverageMiles, stringList(profile.services).length, stringList(profile.trades).length, profile.verificationStatus === "verified"];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [expectedRole, profile]);

  async function logout() { await request("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); }
  function toggleTheme() { setIsDark((prev) => !prev); }

  // Loading
  if (!snapshot && !error) {
    return (
      <div className={`flex min-h-screen bg-white dark:bg-[#111]${isDark ? " dark" : ""}`}>
        <aside className="hidden w-56 shrink-0 border-r border-black dark:border-white/[0.12] lg:block" aria-hidden="true" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin border-2 border-black dark:border-white/[0.12] border-t-[#2196F3]" aria-hidden="true" />
            <p className="text-sm font-medium text-black dark:text-white">Loading your dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  const firstName = text(user.firstName, "");
  const lastName = text(user.lastName, "");
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

  const customerNav = [
    { label: "Overview", href: "#", active: true },
    { label: "Projects", href: "#projects" },
    { label: "Quotes", href: "#quotes" },
    { label: "Account", href: "#account" },
  ];
  const builderNav = [
    { label: "Overview", href: "#", active: true },
    { label: "Lead inbox", href: "#leads" },
    { label: "My quotes", href: "#quotes" },
    { label: "Profile", href: "#profile" },
    { label: "Account", href: "#account" },
  ];
  const adminNav = [
    { label: "Overview", href: "#", active: true },
    { label: "Verifications", href: "#verifications" },
    { label: "Accounts", href: "#accounts" },
    { label: "Features", href: "#features" },
  ];
  const navItems = expectedRole === "builder" ? builderNav : expectedRole === "admin" ? adminNav : customerNav;

  return (
    <div className={`flex min-h-screen bg-white dark:bg-[#111]${isDark ? " dark" : ""}`}>

      {/* ── Sidebar (desktop) ───────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-black dark:border-white/[0.12] bg-white dark:bg-[#111] lg:flex">
        <div className="flex h-14 items-center px-5 border-b border-black dark:border-white/[0.12]">
          <Link href="/" className="text-lg font-black" aria-label="BuilderFind home">
            <span className="text-[#0D47A1] dark:text-[#90CAF9]">Builder</span><span className="text-[#2196F3]">Find</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <NavItem key={item.label} label={item.label} href={item.href} active={item.active} />
          ))}
        </nav>

        <div className="border-t border-black dark:border-white/[0.12] p-3 space-y-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-black dark:text-white hover:text-black dark:hover:text-white transition"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="text-base leading-none" aria-hidden="true">{isDark ? "☀" : "☾"}</span>
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>

          {!preview ? (
            <>
              <div className="flex items-center gap-2.5 px-2 py-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#2196F3] text-[11px] font-bold text-white" aria-hidden="true">{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-black dark:text-white">{firstName} {lastName}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 ${connected ? "bg-[#2196F3]" : "bg-black dark:bg-white"}`} aria-hidden="true" />
                    <span className="text-[10px] text-black dark:text-white">{connected ? "Live" : "Offline"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => void logout()} className="w-full px-2 py-1.5 text-left text-xs text-black dark:text-white transition hover:text-black dark:hover:text-white">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="flex w-full items-center justify-center bg-[#2196F3] py-2 text-xs font-semibold text-white">Sign in</Link>
          )}
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-black dark:border-white/[0.12] bg-white dark:bg-[#111] px-4 lg:hidden" style={{ height: "52px" }}>
        <Link href="/" className="text-lg font-black" aria-label="BuilderFind home">
          <span className="text-[#0D47A1] dark:text-[#90CAF9]">Builder</span><span className="text-[#2196F3]">Find</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-base text-black dark:text-white"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀" : "☾"}
          </button>
          {preview
            ? <Link href="/login" className="bg-[#2196F3] px-3 py-1.5 text-xs font-semibold text-white">Sign in</Link>
            : <div className="flex h-7 w-7 items-center justify-center bg-[#2196F3] text-[11px] font-bold text-white" aria-label={`${firstName} ${lastName}`}>{initials}</div>}
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col lg:pl-56">
        <main className="flex-1 px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-8">

          {/* Page header */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2196F3]">{copy.eyebrow}</p>
              <h1 className="mt-1 text-xl font-bold text-[#0D47A1] dark:text-[#90CAF9] sm:text-2xl">
                {expectedRole === "customer" && !preview ? `Welcome back, ${firstName}` : copy.title}
              </h1>
              <p className="mt-1 max-w-xl text-xs leading-5 text-black dark:text-white">{copy.intro}</p>
            </div>
            <div className="flex items-center gap-2">
              {preview && <span className="border border-[#2196F3]/30 px-3 py-1.5 text-xs font-medium text-[#2196F3]">Read-only preview</span>}
              {expectedRole === "customer" && (
                <Link href="/post-a-job" className="bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0D47A1]">+ Post a job</Link>
              )}
            </div>
          </div>

          {/* Alerts */}
          {preview && (
            <div role="note" className="mb-5 border border-[#2196F3]/20 bg-[#2196F3]/[0.04] dark:bg-[#2196F3]/[0.08] px-4 py-3 text-xs font-medium text-[#2196F3]">
              Viewing sample data — read-only preview. <Link href="/login" className="underline">Sign in</Link> to use live jobs, quotes and messages.
            </div>
          )}
          {error && <div role="alert" className="mb-5 border border-black dark:border-white/[0.12] px-4 py-3 text-xs font-medium text-black dark:text-white">{error}</div>}
          {notice && <div role="status" aria-live="polite" className="mb-5 border border-[#2196F3]/20 bg-[#2196F3]/[0.04] dark:bg-[#2196F3]/[0.08] px-4 py-3 text-xs font-medium text-[#2196F3]">{notice}</div>}

          {/* Stats row */}
          {statEntries.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statEntries.map(([key, value]) => (
                <div key={key} className="border border-black dark:border-white/[0.12] bg-white dark:bg-[#1a1a1a] p-4">
                  <p className="text-2xl font-bold text-[#0D47A1] dark:text-[#90CAF9]">{number(value)}</p>
                  <p className="mt-0.5 text-[11px] text-black dark:text-white">{label(key)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4">

            {/* ══ CUSTOMER ═══════════════════════════════════════════════════ */}
            {expectedRole === "customer" && <>

              <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start">
                {/* Projects */}
                <Panel title="Your projects" id="projects" action={<Link href="/post-a-job" className="text-xs font-medium text-[#2196F3] hover:underline">+ Add project</Link>}>
                  {jobs.length ? (
                    <div className="grid gap-3">
                      {jobs.map((job) => (
                        <article key={idOf(job)} className="border border-black dark:border-white/[0.12] p-4 transition hover:border-[#2196F3]/50">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2196F3]">{text(job.trade)} · {text(job.postcode)}</p>
                              <h3 className="mt-1 text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{text(job.title)}</h3>
                              <p className="mt-1 text-xs text-black dark:text-white">{text(job.budgetLabel)} · {number(job.quoteCount)} quote{number(job.quoteCount) === 1 ? "" : "s"} received</p>
                            </div>
                            <Status value={job.status} />
                          </div>
                          <StageProgress status={job.status} />
                        </article>
                      ))}
                    </div>
                  ) : (
                    <Empty title="No projects yet" body="Post a clear brief and local verified builders can quote." cta={<Link href="/post-a-job" className="inline-flex bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white">Post your first job →</Link>} />
                  )}
                </Panel>

                {/* Next steps sidebar */}
                <aside className="border border-black dark:border-white/[0.12] bg-white dark:bg-[#1a1a1a] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2196F3]">Next steps</p>
                  <h2 className="mt-2 text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">Keep things moving</h2>
                  <div className="mt-4 space-y-4">
                    {[
                      { step: "1", title: "Compare the detail", body: "Review scope, timing and assumptions — not just the price." },
                      { step: "2", title: "Ask a question", body: "Message a builder before accepting a quote." },
                      { step: "3", title: "Choose with confidence", body: "Accept the quote that fits your project best." },
                    ].map(({ step, title, body: bodyText }) => (
                      <div key={step} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#2196F3] text-[10px] font-bold text-white">{step}</span>
                        <div>
                          <p className="text-xs font-semibold text-black dark:text-white">{title}</p>
                          <p className="mt-0.5 text-[11px] leading-4 text-black dark:text-white">{bodyText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              {/* Quotes */}
              <Panel title="Quotes to compare" id="quotes" action={quotes.length ? <span className="text-xs text-black dark:text-white">{quotes.length} received</span> : undefined}>
                {quotes.length ? (
                  <div className="grid gap-3">
                    {quotes.map((quote, index) => (
                      <article key={idOf(quote)} className={`border p-4 ${quote.status === "accepted" ? "border-l-[3px] border-l-[#2196F3] border-r-black dark:border-r-white/[0.12] border-t-black dark:border-t-white/[0.12] border-b-black dark:border-b-white/[0.12]" : "border-black dark:border-white/[0.12]"}`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center bg-[#2196F3] text-[10px] font-bold text-white">{index + 1}</span>
                              <h3 className="text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{text(quote.builderBusinessName)}</h3>
                              {!!quote.builderVerified && <span className="border border-[#2196F3]/30 px-2 py-0.5 text-[10px] font-semibold text-[#2196F3]">Verified</span>}
                            </div>
                            <p className="mt-3 text-2xl font-bold text-black dark:text-white">{money(quote.amount)}</p>
                            <p className="mt-0.5 text-xs text-black dark:text-white">{number(quote.estimatedDurationDays)} working days · valid until {date(quote.validUntil)}</p>
                            <p className="mt-3 text-xs leading-5 text-black dark:text-white">{text(quote.message)}</p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <p className="text-sm font-bold text-[#0D47A1] dark:text-[#90CAF9]">{number(quote.builderRating).toFixed(1)} <span className="text-[#2196F3]">★</span> <span className="text-xs font-normal text-black dark:text-white">({number(quote.builderReviewCount)})</span></p>
                            <Status value={quote.status} />
                            {!preview && quote.status === "submitted" && (
                              <ActionButton onClick={() => mutate(`/api/quotes/${idOf(quote)}`, { action: "accept" })}>Accept quote</ActionButton>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty title="No quotes yet" body="Quotes will appear here as soon as builders submit them." />
                )}
              </Panel>
            </>}

            {/* ══ BUILDER ════════════════════════════════════════════════════ */}
            {expectedRole === "builder" && <>

              {/* Verification callout */}
              {text(profile.verificationStatus, "unsubmitted") !== "verified" && (
                <div className="border border-[#2196F3]/20 bg-[#2196F3]/[0.03] dark:bg-[#2196F3]/[0.07] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[#2196F3]">Action needed</p>
                      <p className="mt-1 text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">Get verified to build trust</p>
                      <p className="mt-1 text-xs leading-5 text-black dark:text-white">Upload your insurance or qualification evidence to earn your verification badge and stand out to homeowners.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 xl:grid-cols-[1fr_280px] xl:items-start">
                {/* Lead inbox */}
                <Panel title="Matched local leads" id="leads" action={<span className="bg-[#2196F3]/[0.08] dark:bg-[#2196F3]/[0.15] px-2.5 py-1 text-xs font-semibold text-[#2196F3]">{leads.length} to review</span>}>
                  {leads.length ? (
                    <div className="grid gap-3">
                      {leads.map((job) => {
                        const budgetLine = text(job.budgetLabel, "");
                        const preferredStart = text(job.preferredStart, "");
                        return (
                          <article key={idOf(job)} className="border border-black dark:border-white/[0.12] p-4 transition hover:border-[#2196F3]/50">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2196F3]">{text(job.trade)} · {text(job.postcode)}</p>
                                <h3 className="mt-1 text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{text(job.title)}</h3>
                                <p className="mt-1.5 text-xs leading-5 text-black dark:text-white">{text(job.description)}</p>
                                {budgetLine && <p className="mt-1.5 text-[11px] text-black dark:text-white">Budget: {budgetLine}</p>}
                                {preferredStart && <p className="mt-0.5 text-[11px] text-black dark:text-white">Start: {preferredStart}</p>}
                              </div>
                              <Status value={job.status} />
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black dark:border-white/[0.12] pt-3">
                              <span className="text-[11px] text-black dark:text-white">Matched to your trade and coverage area</span>
                              {!preview ? <QuoteComposer job={job} onDone={load} /> : <span className="text-[11px] text-[#2196F3]">Sign in to quote</span>}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <Empty title="No matched leads yet" body="As your profile and verification are confirmed, local job matches will appear here instantly." />
                  )}
                </Panel>

                {/* Right column */}
                <div className="grid content-start gap-4">
                  {/* Trade profile */}
                  <Panel title="Trade profile" id="profile" action={!preview ? <span className="cursor-pointer text-xs text-[#2196F3] hover:underline">Public profile</span> : undefined}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{text(profile.businessName)}</p>
                        <p className="mt-0.5 text-xs text-black dark:text-white">{stringList(profile.trades).join(", ") || text(profile.basePostcode)}</p>
                        <p className="mt-1 text-[11px] text-black dark:text-white">Serving {text(profile.basePostcode)} · {number(profile.coverageMiles)} mile radius</p>
                      </div>
                      <Status value={profile.verificationStatus} />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-black dark:text-white">Profile strength</p>
                        <p className="text-[11px] font-semibold text-[#2196F3]">{builderProfileStrength}%</p>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-black/[0.06] dark:bg-white/[0.1]">
                        <div className="h-full bg-[#2196F3] transition-all" style={{ width: `${builderProfileStrength}%` }} />
                      </div>
                    </div>
                    {!preview ? <BuilderProfileEditor profile={profile} onDone={load} /> : <p className="mt-4 border-t border-black dark:border-white/[0.12] pt-4 text-xs text-black dark:text-white">Your public profile and verification status appear here.</p>}
                  </Panel>

                  {/* Quote pipeline */}
                  <Panel title="My quotes" id="quotes" action={<span className="text-xs text-black dark:text-white">{quotes.length} total</span>}>
                    {quotes.length ? (
                      <div className="grid gap-2">
                        {quotes.map((quote) => (
                          <div key={idOf(quote)} className="flex items-center justify-between gap-3 border border-black dark:border-white/[0.12] p-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{money(quote.amount)}</p>
                              <p className="mt-0.5 text-[11px] text-black dark:text-white">Sent {date(quote.createdAt)}</p>
                            </div>
                            <Status value={quote.status} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty title="No quotes submitted yet" body="Your submitted quotes and their response status will be tracked here." />
                    )}
                  </Panel>
                </div>
              </div>
            </>}

            {/* ── Booked work ──────────────────────────────────────────────── */}
            {bookings.length > 0 && (
              <Panel title="Booked work">
                <div className="grid gap-2">
                  {bookings.map((booking) => (
                    <article key={idOf(booking)} className="flex flex-wrap items-center justify-between gap-3 border border-black dark:border-white/[0.12] p-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{money(booking.agreedAmount)}</p>
                        <p className="mt-0.5 text-[11px] text-black dark:text-white">Starts {date(booking.scheduledStart)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Status value={booking.status} />
                        {expectedRole === "builder" && booking.status === "pending" && <ActionButton onClick={() => mutate(`/api/bookings/${idOf(booking)}`, { status: "confirmed" })}>Confirm</ActionButton>}
                        {expectedRole === "builder" && booking.status === "confirmed" && <ActionButton onClick={() => mutate(`/api/bookings/${idOf(booking)}`, { status: "in_progress" })}>Start work</ActionButton>}
                        {booking.status === "in_progress" && <ActionButton onClick={() => mutate(`/api/bookings/${idOf(booking)}`, { status: "completed" })}>Mark complete</ActionButton>}
                        {expectedRole === "customer" && booking.status === "completed" && <ReviewComposer booking={booking} onDone={load} />}
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {/* ══ ADMIN ══════════════════════════════════════════════════════ */}
            {expectedRole === "admin" && <>
              <Panel title="Pending builder verification" id="verifications">{verifications.length ? <div className="grid gap-3">{verifications.map((verification) => <article key={idOf(verification)} className="flex flex-wrap items-center justify-between gap-4 border border-black dark:border-white/[0.12] p-4"><div><p className="font-semibold text-[#0D47A1] dark:text-[#90CAF9]">Request {idOf(verification).slice(-6).toUpperCase()}</p><p className="text-xs text-black dark:text-white">{stringList(verification.documentMediaIds).length} evidence file(s) · {date(verification.createdAt)}</p><div className="mt-2 flex flex-wrap gap-2">{stringList(verification.documentMediaIds).map((mediaId, index) => <a key={mediaId} href={`/api/media/${mediaId}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#2196F3] underline">Evidence {index + 1}</a>)}</div></div><div className="flex gap-2"><ActionButton onClick={() => mutate(`/api/admin/verifications/${idOf(verification)}`, { action: "approve" })}>Approve</ActionButton><ActionButton tone="red" onClick={() => mutate(`/api/admin/verifications/${idOf(verification)}`, { action: "reject", notes: "Evidence needs updating before approval." })}>Reject</ActionButton></div></article>)}</div> : <Empty title="No verification requests are waiting." />}</Panel>
              <Panel title="Recent accounts" id="accounts">{recentUsers.length ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs text-black dark:text-white"><tr><th className="pb-3">Account</th><th className="pb-3">Role</th><th className="pb-3">Joined</th><th className="pb-3 text-right">Control</th></tr></thead><tbody>{recentUsers.map((account) => <tr key={idOf(account)} className="border-t border-black dark:border-white/[0.12]"><td className="py-3"><p className="font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{text(account.firstName)} {text(account.lastName, "")}</p><p className="text-xs text-black dark:text-white">{text(account.email)}</p></td><td><Status value={account.role} /></td><td className="text-xs text-black dark:text-white">{date(account.createdAt)}</td><td className="text-right">{account.role !== "admin" ? <ActionButton tone={account.status === "active" ? "red" : "blue"} onClick={() => mutate(`/api/admin/users/${idOf(account)}`, { status: account.status === "active" ? "suspended" : "active" })}>{account.status === "active" ? "Suspend" : "Restore"}</ActionButton> : null}</td></tr>)}</tbody></table></div> : <Empty title="No accounts yet." />}</Panel>
              <Panel title="Commercial feature controls" id="features"><p className="mb-4 text-xs text-black dark:text-white">All revenue features launch disabled. Enabling a flag only exposes code paths; provider billing still requires a separate approved integration.</p><div className="grid gap-3 sm:grid-cols-2">{flags.map((flag) => <div key={idOf(flag)} className="flex items-center justify-between border border-black dark:border-white/[0.12] p-3"><div><p className="text-sm font-semibold text-[#0D47A1] dark:text-[#90CAF9]">{label(flag.key)}</p><p className="text-xs text-black dark:text-white">{money(number(flag.pricePence) / 100)}</p></div><ActionButton tone={flag.enabled ? "red" : "blue"} onClick={() => mutate(`/api/admin/flags/${text(flag.key)}`, { enabled: !flag.enabled, pricePence: number(flag.pricePence) })}>{flag.enabled ? "Disable" : "Enable"}</ActionButton></div>)}</div></Panel>
            </>}

            {/* ── Account settings ──────────────────────────────────────────── */}
            {!preview && <AccountSettings user={user} onDone={load} />}

          </div>
        </main>
      </div>
    </div>
  );
}
