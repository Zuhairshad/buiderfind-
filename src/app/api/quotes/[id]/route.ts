import { ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { getMongoClient } from "@/lib/db/mongodb";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { id } from "@/lib/marketplace/access";
import { createNotification } from "@/lib/notifications/delivery";
import { audit, publishEvent } from "@/lib/platform/events";

export async function PATCH(request: Request, context: RouteContext<"/api/quotes/[id]">) {
  try {
    assertTrustedOrigin(request); const user = await apiUser("customer", "builder", "admin"); const quoteId = id((await context.params).id); const body = await readJson(request) as { action?: string }; const c = await collections(); const quote = await c.quotes.findOne({ _id: quoteId }); if (!quote) throw new ApiError(404, "Quote not found", "NOT_FOUND");
    if (body.action === "withdraw") { if (quote.builderId.toHexString() !== user.id && user.role !== "admin") throw new ApiError(403, "Only the quoting builder can withdraw", "FORBIDDEN"); const result = await c.quotes.updateOne({ _id: quoteId, status: "submitted" }, { $set: { status: "withdrawn", updatedAt: new Date() } }); if (!result.modifiedCount) throw new ApiError(409, "This quote can no longer be withdrawn", "INVALID_STATE"); await c.jobs.updateOne({ _id: quote.jobId, quoteCount: { $gt: 0 }, status: "quoting" }, { $inc: { quoteCount: -1 }, $set: { updatedAt: new Date() } }); await publishEvent({ type: "quote.withdrawn", entityId: quoteId, audienceRoles: ["admin"], audienceUserIds: [quote.customerId, quote.builderId], payload: { jobId: quote.jobId.toHexString() } }); return Response.json({ ok: true }); }
    if (body.action !== "accept") throw new ApiError(400, "Unknown quote action", "INVALID_ACTION");
    if (quote.customerId.toHexString() !== user.id && user.role !== "admin") throw new ApiError(403, "Only the hirer can accept a quote", "FORBIDDEN");
    if (quote.status !== "submitted" || quote.validUntil <= new Date()) throw new ApiError(409, "This quote is no longer available", "INVALID_STATE");
    const client = await getMongoClient(); const session = client.startSession(); let bookingId: ObjectId | undefined;
    try { await session.withTransaction(async () => { const now = new Date(); const job = await c.jobs.findOneAndUpdate({ _id: quote.jobId, customerId: quote.customerId, status: { $in: ["open", "quoting"] }, awardedQuoteId: { $exists: false } }, { $set: { status: "awarded", awardedQuoteId: quote._id, updatedAt: now } }, { returnDocument: "after", session }); if (!job) throw new ApiError(409, "This job has already been awarded or closed", "INVALID_STATE"); await c.quotes.updateOne({ _id: quote._id, status: "submitted" }, { $set: { status: "accepted", updatedAt: now } }, { session }); await c.quotes.updateMany({ jobId: quote.jobId, _id: { $ne: quote._id }, status: "submitted" }, { $set: { status: "rejected", updatedAt: now } }, { session }); bookingId = new ObjectId(); await c.bookings.insertOne({ _id: bookingId, jobId: quote.jobId, quoteId: quote._id, customerId: quote.customerId, builderId: quote.builderId, status: "pending", agreedAmount: quote.amount, scheduledStart: quote.availableFrom, createdAt: now, updatedAt: now }, { session }); await c.jobs.updateOne({ _id: quote.jobId }, { $set: { bookingId } }, { session }); }); } finally { await session.endSession(); }
    await Promise.all([audit({ actorId: new ObjectId(user.id), action: "quote.accepted", entityType: "quote", entityId: quoteId }), publishEvent({ type: "quote.accepted", entityId: quoteId, audienceRoles: ["admin"], audienceUserIds: [quote.customerId, quote.builderId], payload: { bookingId: bookingId!.toHexString() } }), createNotification({ userId: quote.builderId, type: "quote.accepted", title: "Your quote was accepted", body: "The hirer selected your quote. Confirm the booking details next.", href: "/builder/dashboard" })]);
    return Response.json({ ok: true, bookingId: bookingId!.toHexString() });
  } catch (error) { return jsonError(error); }
}
