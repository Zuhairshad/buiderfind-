import "server-only";
import type { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { AuditLogDocument, BookingDocument, BuilderProfileDocument, ConversationDocument, FeatureFlagDocument, JobDocument, MediaDocument, MessageDocument, NotificationDocument, QuoteDocument, RealtimeEventDocument, ReviewDocument, SessionDocument, UserDocument, VerificationRequestDocument } from "@/lib/platform/types";

export async function collections() {
  const db = await getDb();
  return {
    db,
    users: db.collection<UserDocument>("users"), sessions: db.collection<SessionDocument>("sessions"), builderProfiles: db.collection<BuilderProfileDocument>("builderProfiles"), jobs: db.collection<JobDocument>("jobs"), quotes: db.collection<QuoteDocument>("quotes"), bookings: db.collection<BookingDocument>("bookings"), conversations: db.collection<ConversationDocument>("conversations"), messages: db.collection<MessageDocument>("messages"), reviews: db.collection<ReviewDocument>("reviews"), notifications: db.collection<NotificationDocument>("notifications"), verificationRequests: db.collection<VerificationRequestDocument>("verificationRequests"), media: db.collection<MediaDocument>("media"), realtimeEvents: db.collection<RealtimeEventDocument>("realtimeEvents"), auditLogs: db.collection<AuditLogDocument>("auditLogs"), featureFlags: db.collection<FeatureFlagDocument>("featureFlags"), counters: db.collection<{ _id: string; value: number }>("counters"), rateLimits: db.collection<{ _id: string; count: number; expiresAt: Date }>("rateLimits"), passwordResets: db.collection<{ _id: ObjectId; userId: ObjectId; tokenHash: string; expiresAt: Date; usedAt?: Date; createdAt: Date }>("passwordResets"),
  };
}

export type PlatformCollections = Awaited<ReturnType<typeof collections>>;
