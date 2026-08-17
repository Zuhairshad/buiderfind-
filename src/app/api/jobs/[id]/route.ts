import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { id, isWithinCoverage, owns } from "@/lib/marketplace/access";
import { jobUpdateSchema } from "@/lib/platform/schemas";
import { canTransitionJob } from "@/lib/platform/state";
import { serialise } from "@/lib/platform/serialise";
import { audit, publishEvent } from "@/lib/platform/events";
import { geocodePostcode } from "@/lib/location/postcodes";

export async function GET(_: Request, context: RouteContext<"/api/jobs/[id]">) {
  try { const user = await apiUser(); const jobId = id((await context.params).id); const c = await collections(); const job = await c.jobs.findOne({ _id: jobId }); if (!job) throw new ApiError(404, "Job not found", "NOT_FOUND"); if (user.role === "customer") owns(user, job.customerId); if (user.role === "builder") { const profile = await c.builderProfiles.findOne({ userId: new (await import("mongodb")).ObjectId(user.id), verificationStatus: "verified", profileVisible: true, trades: job.trade }); if (!profile || (profile.location && job.location && !isWithinCoverage(profile.location.coordinates, job.location.coordinates, profile.coverageMiles))) throw new ApiError(403, "This lead is not available to your verified trade profile", "FORBIDDEN"); } return Response.json({ job: serialise(job) }); } catch (error) { return jsonError(error); }
}
export async function PATCH(request: Request, context: RouteContext<"/api/jobs/[id]">) {
  try {
    assertTrustedOrigin(request); const user = await apiUser("customer", "admin"); const jobId = id((await context.params).id); const c = await collections(); const job = await c.jobs.findOne({ _id: jobId }); if (!job) throw new ApiError(404, "Job not found", "NOT_FOUND"); owns(user, job.customerId); const data = jobUpdateSchema.parse(await readJson(request));
    if (data.status && data.status !== job.status && !canTransitionJob(job.status, data.status)) throw new ApiError(409, `A ${job.status} job cannot become ${data.status}`, "INVALID_STATE");
    const location = data.postcode ? await geocodePostcode(data.postcode) : undefined; const update = { ...data, ...(location ? { location } : {}), updatedAt: new Date() }; await c.jobs.updateOne({ _id: jobId, status: job.status }, { $set: update, ...(data.postcode && !location ? { $unset: { location: "" } } : {}) }); await Promise.all([audit({ actorId: new (await import("mongodb")).ObjectId(user.id), action: "job.updated", entityType: "job", entityId: jobId, metadata: { status: data.status ?? job.status } }), publishEvent({ type: "job.updated", entityId: jobId, audienceRoles: ["builder", "admin"], audienceUserIds: [job.customerId], payload: { status: data.status ?? job.status } })]); return Response.json({ job: serialise({ ...job, ...update }) });
  } catch (error) { return jsonError(error); }
}
