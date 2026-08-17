import { collections } from "@/lib/db/collections";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/platform/schemas";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { enforceRateLimit, privacyHash } from "@/lib/platform/rate-limit";
import { audit } from "@/lib/platform/events";

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const data = loginSchema.parse(await readJson(request));
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    await enforceRateLimit(`login:${privacyHash(`${ip}:${data.email}`)}`, 8, 15 * 60_000);
    const { users } = await collections();
    const user = await users.findOne({ email: data.email, status: "active" });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) throw new ApiError(401, "Email or password is incorrect", "INVALID_CREDENTIALS");
    if (data.expectedRole && user.role !== data.expectedRole && user.role !== "admin") throw new ApiError(403, `This account is registered as ${user.role}`, "ROLE_MISMATCH");
    await Promise.all([createSession(user, request, data.remember), audit({ actorId: user._id, action: "account.login", entityType: "user", entityId: user._id })]);
    return Response.json({ user: { id: user._id.toHexString(), firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (error) { return jsonError(error); }
}
