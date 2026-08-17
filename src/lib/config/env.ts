import "server-only";
import { z } from "zod";

const coreSchema = z.object({
  MONGODB_URI: z.string().min(10),
  MONGODB_DB: z.string().min(1).default("builderfind"),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  APP_ORIGIN: z.string().url().default("http://localhost:3000"),
});

export function getCoreEnv() {
  const parsed = coreSchema.safeParse(process.env);
  if (!parsed.success) throw new Error(`BuilderFind configuration is incomplete: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
  return parsed.data;
}

export function getOptionalIntegrations() {
  return {
    blobToken: process.env.BLOB_READ_WRITE_TOKEN,
    resendKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioFromNumber: process.env.TWILIO_FROM_NUMBER,
  };
}
