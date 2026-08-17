import { ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, readJson } from "@/lib/http/api";
import { serialise } from "@/lib/platform/serialise";
export async function GET() { try { const user = await apiUser(); const notifications = await (await collections()).notifications.find({ userId: new ObjectId(user.id) }).sort({ createdAt: -1 }).limit(50).toArray(); return Response.json({ notifications: serialise(notifications) }); } catch (error) { return jsonError(error); } }
export async function PATCH(request: Request) { try { assertTrustedOrigin(request); const user = await apiUser(); const body = await readJson(request) as { id?: string; all?: boolean }; const c = await collections(); const filter: Record<string, unknown> = { userId: new ObjectId(user.id), readAt: { $exists: false } }; if (!body.all && body.id && ObjectId.isValid(body.id)) filter._id = new ObjectId(body.id); await c.notifications.updateMany(filter, { $set: { readAt: new Date() } }); return Response.json({ ok: true }); } catch (error) { return jsonError(error); } }
