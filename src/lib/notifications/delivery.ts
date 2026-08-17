import "server-only";
import { ObjectId } from "mongodb";
import { Resend } from "resend";
import twilio from "twilio";
import { getOptionalIntegrations } from "@/lib/config/env";
import { collections } from "@/lib/db/collections";
import { publishEvent } from "@/lib/platform/events";
import type { DeliveryStatus } from "@/lib/platform/types";

export async function createNotification(input: { userId: ObjectId; type: string; title: string; body: string; href?: string; email?: { to: string; subject: string; text: string }; sms?: { to: string; body: string } }) {
  const c = await collections();
  const notificationId = new ObjectId();
  const emailStatus: DeliveryStatus | undefined = input.email ? "pending" : undefined;
  const smsStatus: DeliveryStatus | undefined = input.sms ? "pending" : undefined;
  await c.notifications.insertOne({ _id: notificationId, userId: input.userId, type: input.type, title: input.title, body: input.body, href: input.href, emailStatus, smsStatus, createdAt: new Date() });
  await publishEvent({ type: "notification.created", entityId: notificationId, audienceUserIds: [input.userId], payload: { title: input.title, href: input.href ?? null } });
  await Promise.all([
    input.email ? deliverEmail(notificationId, input.email) : Promise.resolve(),
    input.sms ? deliverSms(notificationId, input.sms) : Promise.resolve(),
  ]);
  return notificationId;
}

async function deliverEmail(id: ObjectId, message: { to: string; subject: string; text: string }) {
  const c = await collections();
  const env = getOptionalIntegrations();
  if (!env.resendKey || !env.emailFrom) { await c.notifications.updateOne({ _id: id }, { $set: { emailStatus: "provider_missing" } }); return; }
  try { await new Resend(env.resendKey).emails.send({ from: env.emailFrom, to: message.to, subject: message.subject, text: message.text }); await c.notifications.updateOne({ _id: id }, { $set: { emailStatus: "sent" } }); }
  catch (error) { console.error("Email delivery failed", error); await c.notifications.updateOne({ _id: id }, { $set: { emailStatus: "failed" } }); }
}

async function deliverSms(id: ObjectId, message: { to: string; body: string }) {
  const c = await collections();
  const env = getOptionalIntegrations();
  if (!env.twilioAccountSid || !env.twilioAuthToken || !env.twilioFromNumber) { await c.notifications.updateOne({ _id: id }, { $set: { smsStatus: "provider_missing" } }); return; }
  try { await twilio(env.twilioAccountSid, env.twilioAuthToken).messages.create({ from: env.twilioFromNumber, to: message.to, body: message.body }); await c.notifications.updateOne({ _id: id }, { $set: { smsStatus: "sent" } }); }
  catch (error) { console.error("SMS delivery failed", error); await c.notifications.updateOne({ _id: id }, { $set: { smsStatus: "failed" } }); }
}
