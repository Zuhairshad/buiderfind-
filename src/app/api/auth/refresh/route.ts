import { rotateSession } from "@/lib/auth/session";
import { assertTrustedOrigin, jsonError, ApiError } from "@/lib/http/api";
export async function POST(request: Request) { try { assertTrustedOrigin(request); const user = await rotateSession(); if (!user) throw new ApiError(401, "Session expired", "SESSION_EXPIRED"); return Response.json({ user }); } catch (error) { return jsonError(error); } }
