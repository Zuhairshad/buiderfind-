import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const client = new MongoClient(uri, { maxPoolSize: 5 });
const db = client.db(process.env.MONGODB_DB || "builderfind");

try {
  await client.connect();
  await Promise.all([
    db.collection("users").createIndexes([{ key: { email: 1 }, unique: true }, { key: { role: 1, status: 1, createdAt: -1 } }]),
    db.collection("sessions").createIndexes([{ key: { userId: 1, revokedAt: 1 } }, { key: { expiresAt: 1 }, expireAfterSeconds: 0 }, { key: { refreshJtiHash: 1 }, unique: true }]),
    db.collection("builderProfiles").createIndexes([{ key: { userId: 1 }, unique: true }, { key: { slug: 1 }, unique: true }, { key: { trades: 1, verificationStatus: 1, profileVisible: 1 } }, { key: { location: "2dsphere" } }, { key: { featuredUntil: -1, ratingAverage: -1 } }]),
    db.collection("jobs").createIndexes([{ key: { customerId: 1, createdAt: -1 } }, { key: { trade: 1, status: 1, createdAt: -1 } }, { key: { location: "2dsphere" } }, { key: { status: 1, expiresAt: 1 } }]),
    db.collection("quotes").createIndexes([{ key: { jobId: 1, builderId: 1 }, unique: true }, { key: { builderId: 1, createdAt: -1 } }, { key: { customerId: 1, status: 1, createdAt: -1 } }]),
    db.collection("bookings").createIndexes([{ key: { jobId: 1 }, unique: true }, { key: { customerId: 1, updatedAt: -1 } }, { key: { builderId: 1, updatedAt: -1 } }]),
    db.collection("conversations").createIndexes([{ key: { jobId: 1, builderId: 1 }, unique: true }, { key: { participantIds: 1, lastMessageAt: -1 } }]),
    db.collection("messages").createIndexes([{ key: { conversationId: 1, createdAt: -1 } }, { key: { recipientId: 1, readAt: 1 } }]),
    db.collection("reviews").createIndexes([{ key: { bookingId: 1 }, unique: true }, { key: { builderId: 1, status: 1, createdAt: -1 } }]),
    db.collection("notifications").createIndex({ userId: 1, readAt: 1, createdAt: -1 }),
    db.collection("realtimeEvents").createIndexes([{ key: { sequence: 1 }, unique: true }, { key: { audienceUserIds: 1, sequence: 1 } }, { key: { audienceRoles: 1, sequence: 1 } }, { key: { expiresAt: 1 }, expireAfterSeconds: 0 }]),
    db.collection("auditLogs").createIndex({ entityType: 1, entityId: 1, createdAt: -1 }),
    db.collection("rateLimits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("passwordResets").createIndexes([{ key: { tokenHash: 1 }, unique: true }, { key: { expiresAt: 1 }, expireAfterSeconds: 0 }]),
    db.collection("media").createIndex({ ownerId: 1, purpose: 1, createdAt: -1 }),
  ]);
  const now = new Date();
  await Promise.all(["payments", "subscriptions", "lead_charging", "featured_profiles", "featured_jobs", "booking_fees"].map((key) => db.collection("featureFlags").updateOne({ key }, { $setOnInsert: { key, enabled: false, pricePence: 0, updatedAt: now } }, { upsert: true })));
  console.log("BuilderFind MongoDB indexes and launch feature flags are ready.");
} finally { await client.close(); }
