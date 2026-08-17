import { ObjectId } from "mongodb";
import { z } from "zod";
import { apiUser } from "@/lib/auth/api-auth";
import { verifyPassword } from "@/lib/auth/password";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, ApiError, jsonError, readJson } from "@/lib/http/api";
import { audit, publishEvent } from "@/lib/platform/events";
import { phoneSchema } from "@/lib/platform/schemas";

const updateSchema = z.object({
  firstName: z.string().trim().min(2).max(60), lastName: z.string().trim().min(2).max(60), phone: phoneSchema,
  notificationPreferences: z.object({ email: z.boolean(), sms: z.boolean(), inApp: z.boolean(), weeklySummary: z.boolean() }),
});
const deleteSchema = z.object({ password: z.string().min(1).max(128), confirmation: z.literal("DELETE") });

export async function PATCH(request: Request) {
  try { assertTrustedOrigin(request); const user = await apiUser(); const data = updateSchema.parse(await readJson(request)); const userId = new ObjectId(user.id); const { phone, ...fields } = data; await (await collections()).users.updateOne({ _id: userId }, { $set: { ...fields, ...(phone ? { phone } : {}), updatedAt: new Date() }, ...(phone ? {} : { $unset: { phone: "" } }) }); await audit({ actorId: userId, action: "account.updated", entityType: "user", entityId: userId }); return Response.json({ ok: true }); } catch (error) { return jsonError(error); }
}

export async function DELETE(request: Request) {
  try { assertTrustedOrigin(request); const current = await apiUser(); const data = deleteSchema.parse(await readJson(request)); const c = await collections(); const userId = new ObjectId(current.id); const user = await c.users.findOne({ _id: userId }); if (!user || !(await verifyPassword(data.password, user.passwordHash))) throw new ApiError(403, "Password confirmation failed", "INVALID_PASSWORD"); const now = new Date(); await Promise.all([c.users.updateOne({ _id: userId }, { $set: { status: "deleted", email: `deleted-${userId.toHexString()}@invalid.builderfind`, updatedAt: now }, $unset: { phone: "" }, $inc: { tokenVersion: 1 } }), c.sessions.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: now } }), audit({ actorId: userId, action: "account.deleted", entityType: "user", entityId: userId }), publishEvent({ type: "account.deleted", entityId: userId, audienceRoles: ["admin"], payload: {} })]); return Response.json({ ok: true }); } catch (error) { return jsonError(error); }
}
