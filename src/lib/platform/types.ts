import type { ObjectId } from "mongodb";

export type UserRole = "customer" | "builder" | "admin";
export type AccountStatus = "active" | "suspended" | "deleted";
export type JobStatus = "draft" | "open" | "quoting" | "awarded" | "in_progress" | "completed" | "cancelled" | "closed";
export type QuoteStatus = "submitted" | "withdrawn" | "accepted" | "rejected" | "expired";
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
export type VerificationStatus = "unsubmitted" | "pending" | "verified" | "rejected" | "suspended";
export type DeliveryStatus = "pending" | "sent" | "failed" | "provider_missing";
export const FEATURE_FLAG_KEYS = ["payments", "subscriptions", "lead_charging", "featured_profiles", "featured_jobs", "booking_fees"] as const;
export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

export type NotificationPreferences = {
  email: boolean;
  sms: boolean;
  inApp: boolean;
  weeklySummary: boolean;
};

export interface UserDocument {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: AccountStatus;
  emailVerifiedAt?: Date;
  notificationPreferences: NotificationPreferences;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionDocument {
  _id: ObjectId;
  userId: ObjectId;
  refreshJtiHash: string;
  familyId: string;
  userAgent?: string;
  ipHash?: string;
  expiresAt: Date;
  rotatedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
}

export interface BuilderProfileDocument {
  _id: ObjectId;
  userId: ObjectId;
  slug: string;
  businessName: string;
  trades: string[];
  services: string[];
  basePostcode: string;
  location?: { type: "Point"; coordinates: [number, number] };
  coverageMiles: number;
  yearsExperience: number;
  bio: string;
  website?: string;
  insurance?: { provider?: string; policyNumber?: string; expiresAt?: Date; mediaId?: ObjectId };
  qualifications: Array<{ name: string; issuer?: string; expiresAt?: Date; mediaId?: ObjectId }>;
  portfolioMediaIds: ObjectId[];
  verificationStatus: VerificationStatus;
  profileVisible: boolean;
  featuredUntil?: Date;
  ratingAverage: number;
  reviewCount: number;
  completedJobCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobDocument {
  _id: ObjectId;
  customerId: ObjectId;
  trade: string;
  title: string;
  description: string;
  postcode: string;
  location?: { type: "Point"; coordinates: [number, number] };
  budgetMin?: number;
  budgetMax?: number;
  budgetLabel: string;
  preferredStart: string;
  mediaIds: ObjectId[];
  status: JobStatus;
  quoteCount: number;
  awardedQuoteId?: ObjectId;
  bookingId?: ObjectId;
  featuredUntil?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteDocument {
  _id: ObjectId;
  jobId: ObjectId;
  customerId: ObjectId;
  builderId: ObjectId;
  builderProfileId: ObjectId;
  amount: number;
  message: string;
  scope: string[];
  exclusions: string[];
  estimatedDurationDays: number;
  availableFrom: Date;
  validUntil: Date;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDocument {
  _id: ObjectId;
  jobId: ObjectId;
  quoteId: ObjectId;
  customerId: ObjectId;
  builderId: ObjectId;
  status: BookingStatus;
  agreedAmount: number;
  scheduledStart: Date;
  scheduledEnd?: Date;
  completedAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDocument {
  _id: ObjectId;
  jobId: ObjectId;
  customerId: ObjectId;
  builderId: ObjectId;
  participantIds: ObjectId[];
  lastMessageAt: Date;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument {
  _id: ObjectId;
  conversationId: ObjectId;
  senderId: ObjectId;
  recipientId: ObjectId;
  body: string;
  mediaIds: ObjectId[];
  readAt?: Date;
  createdAt: Date;
}

export interface ReviewDocument {
  _id: ObjectId;
  bookingId: ObjectId;
  jobId: ObjectId;
  customerId: ObjectId;
  builderId: ObjectId;
  rating: number;
  title: string;
  body: string;
  status: "published" | "hidden" | "flagged";
  builderReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDocument {
  _id: ObjectId;
  userId: ObjectId;
  type: string;
  title: string;
  body: string;
  href?: string;
  readAt?: Date;
  emailStatus?: DeliveryStatus;
  smsStatus?: DeliveryStatus;
  createdAt: Date;
}

export interface VerificationRequestDocument {
  _id: ObjectId;
  builderId: ObjectId;
  profileId: ObjectId;
  status: Exclude<VerificationStatus, "unsubmitted">;
  documentMediaIds: ObjectId[];
  notes?: string;
  reviewedBy?: ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaDocument {
  _id: ObjectId;
  ownerId: ObjectId;
  purpose: "job" | "portfolio" | "verification" | "avatar" | "message";
  access: "public" | "private";
  blobUrl: string;
  pathname: string;
  contentType: string;
  size: number;
  createdAt: Date;
}

export interface RealtimeEventDocument {
  _id: ObjectId;
  sequence: number;
  type: string;
  entityId?: ObjectId;
  audienceRoles: UserRole[];
  audienceUserIds: ObjectId[];
  payload: Record<string, string | number | boolean | null>;
  createdAt: Date;
  expiresAt: Date;
}

export interface AuditLogDocument {
  _id: ObjectId;
  actorId?: ObjectId;
  action: string;
  entityType: string;
  entityId?: ObjectId;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: Date;
}

export interface FeatureFlagDocument {
  _id: ObjectId;
  key: FeatureFlagKey;
  enabled: boolean;
  pricePence: number;
  updatedAt: Date;
}
