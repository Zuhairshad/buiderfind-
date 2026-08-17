import type { BookingStatus, JobStatus, QuoteStatus } from "./types";

const JOB_TRANSITIONS: Record<JobStatus, readonly JobStatus[]> = {
  draft: ["open", "cancelled"], open: ["quoting", "cancelled", "closed"], quoting: ["awarded", "cancelled", "closed"], awarded: ["in_progress", "cancelled"], in_progress: ["completed", "cancelled"], completed: ["closed"], cancelled: [], closed: [],
};
const QUOTE_TRANSITIONS: Record<QuoteStatus, readonly QuoteStatus[]> = { submitted: ["withdrawn", "accepted", "rejected", "expired"], withdrawn: [], accepted: [], rejected: [], expired: [] };
const BOOKING_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = { pending: ["confirmed", "cancelled"], confirmed: ["in_progress", "cancelled", "disputed"], in_progress: ["completed", "cancelled", "disputed"], completed: ["disputed"], cancelled: [], disputed: ["completed", "cancelled"] };

export function canTransitionJob(from: JobStatus, to: JobStatus) { return JOB_TRANSITIONS[from].includes(to); }
export function canTransitionQuote(from: QuoteStatus, to: QuoteStatus) { return QUOTE_TRANSITIONS[from].includes(to); }
export function canTransitionBooking(from: BookingStatus, to: BookingStatus) { return BOOKING_TRANSITIONS[from].includes(to); }
