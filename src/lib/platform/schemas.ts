import { z } from "zod";

const strongPassword = z.string().min(10).max(128)
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a symbol");

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const phoneSchema = z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/).optional().or(z.literal(""));
export const postcodeSchema = z.string().trim().toUpperCase().regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/, "Enter a valid UK postcode");
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier");

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(128), remember: z.boolean().default(false), expectedRole: z.enum(["customer", "builder"]).optional() });

export const customerRegistrationSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: emailSchema,
  phone: phoneSchema,
  password: strongPassword,
  acceptedTerms: z.literal(true),
});

export const builderRegistrationSchema = customerRegistrationSchema.extend({
  businessName: z.string().trim().min(2).max(120),
  trades: z.array(z.string().trim().min(2).max(80)).min(1).max(12),
  yearsExperience: z.number().int().min(0).max(80),
  website: z.string().trim().url().max(250).optional().or(z.literal("")),
  basePostcode: postcodeSchema,
  coverageMiles: z.number().int().min(1).max(250),
  bio: z.string().trim().min(40).max(2000),
});

const jobBaseSchema = z.object({
  trade: z.string().trim().min(2).max(80),
  title: z.string().trim().min(10).max(140),
  description: z.string().trim().min(40).max(5000),
  postcode: postcodeSchema,
  budgetLabel: z.string().trim().min(2).max(80),
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().positive().optional(),
  preferredStart: z.string().trim().min(2).max(80),
});

export const jobCreateSchema = jobBaseSchema.refine((v) => v.budgetMin === undefined || v.budgetMax === undefined || v.budgetMax >= v.budgetMin, { message: "Maximum budget must be at least the minimum" });

export const jobUpdateSchema = jobBaseSchema.partial().extend({ status: z.enum(["draft", "open", "quoting", "awarded", "in_progress", "completed", "cancelled", "closed"]).optional() }).refine((v) => v.budgetMin === undefined || v.budgetMax === undefined || v.budgetMax >= v.budgetMin, { message: "Maximum budget must be at least the minimum" });

export const quoteCreateSchema = z.object({
  amount: z.number().positive().max(10_000_000),
  message: z.string().trim().min(20).max(3000),
  scope: z.array(z.string().trim().min(2).max(240)).min(1).max(30),
  exclusions: z.array(z.string().trim().min(2).max(240)).max(30).default([]),
  estimatedDurationDays: z.number().int().min(1).max(1500),
  availableFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
}).refine((v) => v.validUntil > new Date(), { message: "Quote validity must be in the future" });

export const bookingUpdateSchema = z.object({ status: z.enum(["confirmed", "in_progress", "completed", "cancelled", "disputed"]), cancellationReason: z.string().trim().min(5).max(500).optional() });
export const messageCreateSchema = z.object({ body: z.string().trim().min(1).max(4000) });
export const reviewCreateSchema = z.object({ bookingId: objectIdSchema, rating: z.number().int().min(1).max(5), title: z.string().trim().min(3).max(100), body: z.string().trim().min(20).max(2000) });
export const profileUpdateSchema = z.object({ businessName: z.string().trim().min(2).max(120).optional(), trades: z.array(z.string().min(2).max(80)).min(1).max(12).optional(), services: z.array(z.string().min(2).max(120)).max(30).optional(), basePostcode: postcodeSchema.optional(), coverageMiles: z.number().int().min(1).max(250).optional(), yearsExperience: z.number().int().min(0).max(80).optional(), bio: z.string().trim().min(40).max(2000).optional(), website: z.string().url().max(250).optional().or(z.literal("")), profileVisible: z.boolean().optional() });
export const resetRequestSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({ token: z.string().min(20).max(4000), password: strongPassword });

export type LoginInput = z.infer<typeof loginSchema>;
export type JobCreateInput = z.infer<typeof jobCreateSchema>;
