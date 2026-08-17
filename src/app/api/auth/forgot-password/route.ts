import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db/collections";
import { resetRequestSchema } from "@/lib/platform/schemas";
import { assertTrustedOrigin, jsonError, readJson } from "@/lib/http/api";
import { enforceRateLimit, privacyHash } from "@/lib/platform/rate-limit";
import { createNotification } from "@/lib/notifications/delivery";

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const { email } = resetRequestSchema.parse(await readJson(request));
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    await enforceRateLimit(`reset:${privacyHash(`${ip}:${email}`)}`, 4, 60 * 60_000);
    const c = await collections();
    const user = await c.users.findOne({ email, status: "active" });
    if (user) {
      const token = randomBytes(32).toString("base64url");
      await c.passwordResets.insertOne({ _id: new ObjectId(), userId: user._id, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: new Date(Date.now() + 30 * 60_000), createdAt: new Date() });
      const origin = process.env.APP_ORIGIN ?? new URL(request.url).origin;
      await createNotification({ userId: user._id, type: "account.password_reset", title: "Password reset requested", body: "A password reset link was requested for your account.", email: { to: user.email, subject: "Reset your BuilderFind password", text: `Hello ${user.firstName},\n\nReset your password: ${origin}/forgot-password?token=${encodeURIComponent(token)}\n\nThis link expires in 30 minutes.` } });
    }
    return Response.json({ ok: true, message: "If that account exists, reset instructions have been sent." });
  } catch (error) { return jsonError(error); }
}
