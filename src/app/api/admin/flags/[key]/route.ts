import { ObjectId } from "mongodb";
import { z } from "zod";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { audit, publishEvent } from "@/lib/platform/events";
import { FEATURE_FLAG_KEYS, type FeatureFlagKey } from "@/lib/platform/types";

const flagSchema = z.object({ enabled: z.boolean(), pricePence: z.number().int().nonnegative().max(10_000_000) });
const keys = new Set<string>(FEATURE_FLAG_KEYS);
export async function PATCH(request: Request, context: RouteContext<"/api/admin/flags/[key]">) { try { assertTrustedOrigin(request); const admin = await apiUser("admin"); const { key } = await context.params; if (!keys.has(key)) throw new ApiError(404, "Feature flag not found", "NOT_FOUND"); const featureKey: FeatureFlagKey = FEATURE_FLAG_KEYS.find((candidate) => candidate === key)!; const data = flagSchema.parse(await readJson(request)); await (await collections()).featureFlags.updateOne({ key: featureKey }, { $set: { ...data, updatedAt: new Date() } }, { upsert: true }); await Promise.all([audit({ actorId: new ObjectId(admin.id), action: "feature_flag.updated", entityType: "featureFlag", metadata: { key: featureKey, enabled: data.enabled, pricePence: data.pricePence } }), publishEvent({ type: "feature_flag.updated", audienceRoles: ["admin"], payload: { key: featureKey, enabled: data.enabled } })]); return Response.json({ ok: true }); } catch (error) { return jsonError(error); } }
