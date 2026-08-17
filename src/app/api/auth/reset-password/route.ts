import { createHash } from "node:crypto";
import { collections } from "@/lib/db/collections";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/platform/schemas";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { audit } from "@/lib/platform/events";

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const data = resetPasswordSchema.parse(await readJson(request));
    const c = await collections();
    const reset = await c.passwordResets.findOneAndUpdate({ tokenHash: createHash("sha256").update(data.token).digest("hex"), usedAt: { $exists: false }, expiresAt: { $gt: new Date() } }, { $set: { usedAt: new Date() } }, { returnDocument: "after" });
    if (!reset) throw new ApiError(400, "This reset link is invalid or has expired", "INVALID_RESET_TOKEN");
    await Promise.all([c.users.updateOne({ _id: reset.userId }, { $set: { passwordHash: await hashPassword(data.password), updatedAt: new Date() }, $inc: { tokenVersion: 1 } }), c.sessions.updateMany({ userId: reset.userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } }), audit({ actorId: reset.userId, action: "account.password_reset", entityType: "user", entityId: reset.userId })]);
    return Response.json({ ok: true });
  } catch (error) { return jsonError(error); }
}
