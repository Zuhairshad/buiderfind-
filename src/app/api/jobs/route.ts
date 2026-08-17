import { after } from "next/server";
import { ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson } from "@/lib/http/api";
import { jobCreateSchema } from "@/lib/platform/schemas";
import { geocodePostcode } from "@/lib/location/postcodes";
import { audit, publishEvent } from "@/lib/platform/events";
import { serialise } from "@/lib/platform/serialise";
import { createNotification } from "@/lib/notifications/delivery";

export async function GET(request: Request) {
  try {
    const user = await apiUser();
    const c = await collections();
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const filter: Record<string, unknown> = cursor && ObjectId.isValid(cursor) ? { _id: { $lt: new ObjectId(cursor) } } : {};
    if (user.role === "customer") filter.customerId = new ObjectId(user.id);
    if (user.role === "builder") {
      const profile = await c.builderProfiles.findOne({ userId: new ObjectId(user.id), verificationStatus: "verified", profileVisible: true });
      filter.status = { $in: ["open", "quoting"] };
      filter.expiresAt = { $gt: new Date() };
      filter.trade = { $in: profile?.trades ?? [] };
      if (profile?.location) filter.location = { $near: { $geometry: profile.location, $maxDistance: profile.coverageMiles * 1609.344 } };
    }
    const jobs = await c.jobs.find(filter).sort({ _id: -1 }).limit(25).toArray();
    return Response.json({ jobs: serialise(jobs), nextCursor: jobs.at(-1)?._id.toHexString() ?? null });
  } catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const user = await apiUser("customer", "admin");
    const data = jobCreateSchema.parse(await readJson(request));
    const c = await collections();
    const now = new Date();
    const job = { _id: new ObjectId(), customerId: new ObjectId(user.id), ...data, location: await geocodePostcode(data.postcode), mediaIds: [], status: "open" as const, quoteCount: 0, expiresAt: new Date(now.getTime() + 45 * 86_400_000), createdAt: now, updatedAt: now };
    await c.jobs.insertOne(job);
    await Promise.all([audit({ actorId: new ObjectId(user.id), action: "job.created", entityType: "job", entityId: job._id, metadata: { trade: job.trade } }), publishEvent({ type: "job.created", entityId: job._id, audienceRoles: ["builder", "admin"], audienceUserIds: [job.customerId], payload: { trade: job.trade, postcode: job.postcode } })]);
    after(async () => notifyMatchingBuilders(job._id, job.trade, job.title, job.postcode, job.location));
    return Response.json({ job: serialise(job) }, { status: 201 });
  } catch (error) { return jsonError(error); }
}

async function notifyMatchingBuilders(jobId: ObjectId, trade: string, title: string, postcode: string, location?: { type: "Point"; coordinates: [number, number] }) {
  const c = await collections();
  const filter: Record<string, unknown> = { trades: trade, verificationStatus: "verified", profileVisible: true };
  if (location) filter.location = { $near: { $geometry: location, $maxDistance: 80_467 } };
  const profiles = await c.builderProfiles.find(filter).limit(100).toArray();
  const users = await c.users.find({ _id: { $in: profiles.map((p) => p.userId) }, status: "active" }).toArray();
  await Promise.all(users.map((builder) => createNotification({ userId: builder._id, type: "job.matched", title: "New job lead", body: `${title} · ${postcode}`, href: `/builder/dashboard?job=${jobId.toHexString()}`, email: builder.notificationPreferences.email ? { to: builder.email, subject: `New ${trade} job near you`, text: `${title}\n${postcode}` } : undefined, sms: builder.notificationPreferences.sms && builder.phone ? { to: builder.phone, body: `BuilderFind: New ${trade} lead — ${title}, ${postcode}.` } : undefined })));
}
