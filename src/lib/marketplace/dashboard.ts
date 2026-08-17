import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db/collections";
import type { AuthenticatedUser } from "@/lib/auth/session";
import { serialise } from "@/lib/platform/serialise";

export async function getDashboardSnapshot(user: AuthenticatedUser) {
  const c = await collections();
  const userId = new ObjectId(user.id);
  const notificationsPromise = c.notifications.find({ userId }).sort({ createdAt: -1 }).limit(8).toArray();
  const unreadPromise = c.notifications.countDocuments({ userId, readAt: { $exists: false } });

  if (user.role === "customer") {
    const [jobs, quotes, bookings, conversations, notifications, unread] = await Promise.all([
      c.jobs.find({ customerId: userId }).sort({ createdAt: -1 }).limit(30).toArray(),
      c.quotes.find({ customerId: userId }).sort({ createdAt: -1 }).limit(40).toArray(),
      c.bookings.find({ customerId: userId }).sort({ updatedAt: -1 }).limit(30).toArray(),
      c.conversations.find({ customerId: userId }).sort({ lastMessageAt: -1 }).limit(20).toArray(),
      notificationsPromise, unreadPromise,
    ]);
    const profiles = await c.builderProfiles.find({ _id: { $in: quotes.map((quote) => quote.builderProfileId) } }, { projection: { businessName: 1, ratingAverage: 1, reviewCount: 1, verificationStatus: 1 } }).toArray();
    const profileById = new Map(profiles.map((profile) => [profile._id.toHexString(), profile]));
    const comparableQuotes = quotes.map((quote) => { const profile = profileById.get(quote.builderProfileId.toHexString()); return { ...quote, builderBusinessName: profile?.businessName ?? "Builder", builderRating: profile?.ratingAverage ?? 0, builderReviewCount: profile?.reviewCount ?? 0, builderVerified: profile?.verificationStatus === "verified" }; });
    return serialise({ role: user.role, user, stats: { openJobs: jobs.filter((job) => ["open", "quoting"].includes(job.status)).length, quotesReceived: quotes.filter((quote) => quote.status === "submitted").length, activeBookings: bookings.filter((booking) => ["pending", "confirmed", "in_progress"].includes(booking.status)).length, unreadNotifications: unread }, jobs, quotes: comparableQuotes, bookings, conversations, notifications });
  }

  if (user.role === "builder") {
    const profile = await c.builderProfiles.findOne({ userId });
    const leadFilter: Record<string, unknown> = { status: { $in: ["open", "quoting"] }, expiresAt: { $gt: new Date() }, trade: { $in: profile?.trades ?? [] } };
    if (profile?.location) leadFilter.location = { $near: { $geometry: profile.location, $maxDistance: profile.coverageMiles * 1609.344 } };
    const [leads, quotes, bookings, conversations, notifications, unread, profileViews] = await Promise.all([
      profile?.verificationStatus === "verified" && profile.profileVisible ? c.jobs.find(leadFilter).limit(40).toArray() : Promise.resolve([]),
      c.quotes.find({ builderId: userId }).sort({ createdAt: -1 }).limit(40).toArray(),
      c.bookings.find({ builderId: userId }).sort({ updatedAt: -1 }).limit(30).toArray(),
      c.conversations.find({ builderId: userId }).sort({ lastMessageAt: -1 }).limit(20).toArray(),
      notificationsPromise, unreadPromise,
      c.auditLogs.countDocuments({ entityType: "builderProfile", entityId: profile?._id, action: "profile.viewed", createdAt: { $gte: new Date(Date.now() - 7 * 86_400_000) } }),
    ]);
    return serialise({ role: user.role, user, stats: { newLeads: leads.length, quotesSent: quotes.length, jobsWon: bookings.length, profileViews, unreadNotifications: unread }, profile, leads, quotes, bookings, conversations, notifications });
  }

  const [usersByRole, jobCounts, quoteCounts, verificationRequests, recentUsers, recentJobs, featureFlags, notifications, unread] = await Promise.all([
    c.users.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$role", count: { $sum: 1 } } }]).toArray(),
    c.jobs.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
    c.quotes.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
    c.verificationRequests.find({ status: "pending" }).sort({ createdAt: 1 }).limit(30).toArray(),
    c.users.find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).limit(20).toArray(),
    c.jobs.find({}).sort({ createdAt: -1 }).limit(20).toArray(),
    c.featureFlags.find({}).sort({ key: 1 }).toArray(), notificationsPromise, unreadPromise,
  ]);
  return serialise({ role: user.role, user, stats: { totalUsers: usersByRole.reduce((sum, item) => sum + item.count, 0), openJobs: jobCounts.filter((item) => ["open", "quoting"].includes(item._id)).reduce((sum, item) => sum + item.count, 0), submittedQuotes: quoteCounts.find((item) => item._id === "submitted")?.count ?? 0, pendingVerification: verificationRequests.length, unreadNotifications: unread, usersByRole, jobCounts, quoteCounts }, verificationRequests, recentUsers, recentJobs, featureFlags, notifications });
}
