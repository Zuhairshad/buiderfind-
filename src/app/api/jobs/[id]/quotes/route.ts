import { MongoServerError, ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { id, isWithinCoverage, owns } from "@/lib/marketplace/access";
import { quoteCreateSchema } from "@/lib/platform/schemas";
import { audit, publishEvent } from "@/lib/platform/events";
import { serialise } from "@/lib/platform/serialise";
import { createNotification } from "@/lib/notifications/delivery";

export async function GET(_: Request, context: RouteContext<"/api/jobs/[id]/quotes">) {
  try { const user = await apiUser(); const jobId = id((await context.params).id); const c = await collections(); const job = await c.jobs.findOne({ _id: jobId }); if (!job) throw new ApiError(404, "Job not found", "NOT_FOUND"); if (user.role === "customer") owns(user, job.customerId); const filter = user.role === "builder" ? { jobId, builderId: new ObjectId(user.id) } : { jobId }; const quotes = await c.quotes.find(filter).sort({ createdAt: 1 }).toArray(); return Response.json({ quotes: serialise(quotes) }); } catch (error) { return jsonError(error); }
}
export async function POST(request: Request, context: RouteContext<"/api/jobs/[id]/quotes">) {
  try {
    assertTrustedOrigin(request); const user = await apiUser("builder"); const jobId = id((await context.params).id); const data = quoteCreateSchema.parse(await readJson(request)); const c = await collections(); const builderId = new ObjectId(user.id); const profile = await c.builderProfiles.findOne({ userId: builderId, verificationStatus: "verified", profileVisible: true }); if (!profile) throw new ApiError(403, "Your builder profile must be verified before you can quote", "VERIFICATION_REQUIRED");
    const candidate = await c.jobs.findOne({ _id: jobId, trade: { $in: profile.trades }, status: { $in: ["open", "quoting"] }, expiresAt: { $gt: new Date() } }); if (!candidate || (profile.location && candidate.location && !isWithinCoverage(profile.location.coordinates, candidate.location.coordinates, profile.coverageMiles))) throw new ApiError(409, "This job is unavailable or outside your coverage area", "LEAD_UNAVAILABLE");
    const job = await c.jobs.findOneAndUpdate({ _id: jobId, trade: candidate.trade, postcode: candidate.postcode, status: { $in: ["open", "quoting"] }, expiresAt: { $gt: new Date() }, quoteCount: { $lt: 3 } }, { $inc: { quoteCount: 1 }, $set: { status: "quoting", updatedAt: new Date() } }, { returnDocument: "after" }); if (!job) throw new ApiError(409, "This job changed, closed, or already has three quotes", "QUOTE_LIMIT_REACHED");
    const quote = { _id: new ObjectId(), jobId, customerId: job.customerId, builderId, builderProfileId: profile._id, ...data, status: "submitted" as const, createdAt: new Date(), updatedAt: new Date() };
    try { await c.quotes.insertOne(quote); } catch (error) { await c.jobs.updateOne({ _id: jobId }, { $inc: { quoteCount: -1 } }); if (error instanceof MongoServerError && error.code === 11000) throw new ApiError(409, "You have already quoted for this job", "QUOTE_EXISTS"); throw error; }
    await c.conversations.updateOne({ jobId, builderId }, { $setOnInsert: { _id: new ObjectId(), jobId, customerId: job.customerId, builderId, participantIds: [job.customerId, builderId], lastMessageAt: new Date(), lastMessagePreview: "Quote submitted", createdAt: new Date(), updatedAt: new Date() } }, { upsert: true });
    const customer = await c.users.findOne({ _id: job.customerId, status: "active" });
    await Promise.all([audit({ actorId: builderId, action: "quote.created", entityType: "quote", entityId: quote._id, metadata: { amount: data.amount } }), publishEvent({ type: "quote.created", entityId: quote._id, audienceRoles: ["admin"], audienceUserIds: [job.customerId, builderId], payload: { jobId: jobId.toHexString(), amount: data.amount } }), createNotification({ userId: job.customerId, type: "quote.received", title: "New quote received", body: `${profile.businessName} sent a £${data.amount.toLocaleString("en-GB")} quote.`, href: `/customer/dashboard?job=${jobId.toHexString()}`, email: customer?.notificationPreferences.email ? { to: customer.email, subject: "New BuilderFind quote", text: `${profile.businessName} sent a quote for ${job.title}. Sign in to BuilderFind to review it.` } : undefined })]);
    return Response.json({ quote: serialise(quote) }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
