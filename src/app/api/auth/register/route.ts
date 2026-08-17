import { MongoServerError, ObjectId } from "mongodb";
import { builderRegistrationSchema, customerRegistrationSchema } from "@/lib/platform/schemas";
import { collections } from "@/lib/db/collections";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { assertTrustedOrigin, jsonError, readJson, ApiError } from "@/lib/http/api";
import { audit } from "@/lib/platform/events";
import { geocodePostcode } from "@/lib/location/postcodes";
import type { UserRole } from "@/lib/platform/types";

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const body = await readJson(request) as Record<string, unknown>;
    const role = body.role;
    if (role !== "customer" && role !== "builder") throw new ApiError(400, "Choose an account type", "INVALID_ROLE");
    const accountRole: UserRole = role;
    const data = role === "builder" ? builderRegistrationSchema.parse(body) : customerRegistrationSchema.parse(body);
    const c = await collections();
    const userId = new ObjectId();
    const now = new Date();
    const user = { _id: userId, email: data.email, passwordHash: await hashPassword(data.password), firstName: data.firstName, lastName: data.lastName, phone: data.phone || undefined, role: accountRole, status: "active" as const, notificationPreferences: { email: true, sms: Boolean(data.phone), inApp: true, weeklySummary: false }, tokenVersion: 0, createdAt: now, updatedAt: now };
    await c.users.insertOne(user);
    try {
      if (role === "builder") {
        const builder = builderRegistrationSchema.parse(body);
        const slugBase = builder.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70) || "builder";
        await c.builderProfiles.insertOne({ _id: new ObjectId(), userId, slug: `${slugBase}-${userId.toHexString().slice(-6)}`, businessName: builder.businessName, trades: builder.trades, services: [], basePostcode: builder.basePostcode, location: await geocodePostcode(builder.basePostcode), coverageMiles: builder.coverageMiles, yearsExperience: builder.yearsExperience, bio: builder.bio, website: builder.website || undefined, qualifications: [], portfolioMediaIds: [], verificationStatus: "unsubmitted", profileVisible: false, ratingAverage: 0, reviewCount: 0, completedJobCount: 0, createdAt: now, updatedAt: now });
      }
    } catch (error) { await c.users.deleteOne({ _id: userId }); throw error; }
    await Promise.all([createSession(user, request), audit({ actorId: userId, action: "account.created", entityType: "user", entityId: userId, metadata: { role: accountRole } })]);
    return Response.json({ user: { id: userId.toHexString(), email: user.email, firstName: user.firstName, lastName: user.lastName, role } }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return jsonError(new ApiError(409, "An account already exists for that email", "EMAIL_EXISTS"));
    return jsonError(error);
  }
}
