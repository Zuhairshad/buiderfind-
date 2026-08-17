import { ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { jsonError } from "@/lib/http/api";
import { serialise } from "@/lib/platform/serialise";
export async function GET() { try { const user = await apiUser(); const conversations = await (await collections()).conversations.find({ participantIds: new ObjectId(user.id) }).sort({ lastMessageAt: -1 }).limit(50).toArray(); return Response.json({ conversations: serialise(conversations) }); } catch (error) { return jsonError(error); } }
