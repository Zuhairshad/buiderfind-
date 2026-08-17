import { revokeCurrentSession } from "@/lib/auth/session";
import { assertTrustedOrigin, jsonError } from "@/lib/http/api";
export async function POST(request: Request) { try { assertTrustedOrigin(request); await revokeCurrentSession(); return Response.json({ ok: true }); } catch (error) { return jsonError(error); } }
