import "server-only";
import { collections } from "./collections";
import { FEATURE_FLAG_KEYS } from "@/lib/platform/types";

export async function ensurePlatformIndexes() {
  const c = await collections();
  await Promise.all([
    c.users.createIndexes([{ key: { email: 1 }, unique: true }, { key: { role: 1, status: 1, createdAt: -1 } }]),
    c.sessions.createIndexes([{ key: { userId: 1, revokedAt: 1 } }, { key: { expiresAt: 1 }, expireAfterSeconds: 0 }, { key: { refreshJtiHash: 1 }, unique: true }]),
    c.builderProfiles.createIndexes([{ key: { userId: 1 }, unique: true }, { key: { slug: 1 }, unique: true }, { key: { trades: 1, verificationStatus: 1, profileVisible: 1 } }, { key: { location: "2dsphere" } }, { key: { featuredUntil: -1, ratingAverage: -1 } }]),
    c.jobs.createIndexes([{ key: { customerId: 1, createdAt: -1 } }, { key: { trade: 1, status: 1, createdAt: -1 } }, { key: { location: "2dsphere" } }, { key: { status: 1, expiresAt: 1 } }]),
    c.quotes.createIndexes([{ key: { jobId: 1, builderId: 1 }, unique: true }, { key: { builderId: 1, createdAt: -1 } }, { key: { customerId: 1, status: 1, createdAt: -1 } }]),
    c.bookings.createIndexes([{ key: { jobId: 1 }, unique: true }, { key: { customerId: 1, updatedAt: -1 } }, { key: { builderId: 1, updatedAt: -1 } }]),
    c.conversations.createIndexes([{ key: { jobId: 1, builderId: 1 }, unique: true }, { key: { participantIds: 1, lastMessageAt: -1 } }]),
    c.messages.createIndexes([{ key: { conversationId: 1, createdAt: -1 } }, { key: { recipientId: 1, readAt: 1 } }]),
    c.reviews.createIndexes([{ key: { bookingId: 1 }, unique: true }, { key: { builderId: 1, status: 1, createdAt: -1 } }]),
    c.notifications.createIndexes([{ key: { userId: 1, readAt: 1, createdAt: -1 } }]),
    c.realtimeEvents.createIndexes([{ key: { sequence: 1 }, unique: true }, { key: { audienceUserIds: 1, sequence: 1 } }, { key: { audienceRoles: 1, sequence: 1 } }, { key: { expiresAt: 1 }, expireAfterSeconds: 0 }]),
    c.auditLogs.createIndex({ entityType: 1, entityId: 1, createdAt: -1 }),
    c.rateLimits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    c.passwordResets.createIndexes([{ key: { tokenHash: 1 }, unique: true }, { key: { expiresAt: 1 }, expireAfterSeconds: 0 }]),
    c.media.createIndex({ ownerId: 1, purpose: 1, createdAt: -1 }),
  ]);

  const now = new Date();
  await Promise.all(FEATURE_FLAG_KEYS.map((key) => c.featureFlags.updateOne(
    { key },
    { $setOnInsert: { key, enabled: false, pricePence: 0, updatedAt: now } },
    { upsert: true },
  )));
}
