import { ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { profileUpdateSchema } from "@/lib/platform/schemas";
import { geocodePostcode } from "@/lib/location/postcodes";
import { serialise } from "@/lib/platform/serialise";
import { audit, publishEvent } from "@/lib/platform/events";

export async function GET() { try { const user = await apiUser("builder", "admin"); const profile = await (await collections()).builderProfiles.findOne({ userId: new ObjectId(user.id) }); if (!profile) throw new ApiError(404, "Builder profile not found", "NOT_FOUND"); return Response.json({ profile: serialise(profile) }); } catch (error) { return jsonError(error); } }
export async function PATCH(request: Request) { try { assertTrustedOrigin(request); const user = await apiUser("builder"); const data = profileUpdateSchema.parse(await readJson(request)); const c = await collections(); const userId = new ObjectId(user.id); const location = data.basePostcode ? await geocodePostcode(data.basePostcode) : undefined; const update = { ...data, ...(location ? { location } : {}), updatedAt: new Date() }; const profile = await c.builderProfiles.findOneAndUpdate({ userId }, { $set: update, ...(data.basePostcode && !location ? { $unset: { location: "" } } : {}) }, { returnDocument: "after" }); if (!profile) throw new ApiError(404, "Builder profile not found", "NOT_FOUND"); await Promise.all([audit({ actorId: userId, action: "profile.updated", entityType: "builderProfile", entityId: profile._id }), publishEvent({ type: "profile.updated", entityId: profile._id, audienceRoles: ["admin"], audienceUserIds: [userId], payload: { verificationStatus: profile.verificationStatus } })]); return Response.json({ profile: serialise(profile) }); } catch (error) { return jsonError(error); } }
