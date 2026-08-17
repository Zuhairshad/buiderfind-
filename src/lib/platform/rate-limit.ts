import "server-only";
import { createHash } from "node:crypto";
import { collections } from "@/lib/db/collections";

export function privacyHash(value: string) { return createHash("sha256").update(value).digest("hex"); }

export async function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const { rateLimits } = await collections();
  const bucket = Math.floor(Date.now() / windowMs);
  const expiresAt = new Date((bucket + 2) * windowMs);
  const result = await rateLimits.findOneAndUpdate({ _id: `${key}:${bucket}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, returnDocument: "after" });
  if (Number(result?.count ?? 0) > limit) throw new Error("RATE_LIMITED");
}
