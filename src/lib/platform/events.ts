import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db/collections";
import type { UserRole } from "./types";

export async function publishEvent(input: { type: string; entityId?: ObjectId; audienceRoles?: UserRole[]; audienceUserIds?: ObjectId[]; payload?: Record<string, string | number | boolean | null> }) {
  const c = await collections();
  const counter = await c.counters.findOneAndUpdate({ _id: "realtime" }, { $inc: { value: 1 } }, { upsert: true, returnDocument: "after" });
  const createdAt = new Date();
  await c.realtimeEvents.insertOne({ _id: new ObjectId(), sequence: counter?.value ?? 1, type: input.type, entityId: input.entityId, audienceRoles: input.audienceRoles ?? [], audienceUserIds: input.audienceUserIds ?? [], payload: input.payload ?? {}, createdAt, expiresAt: new Date(createdAt.getTime() + 7 * 86_400_000) });
}

export async function audit(input: { actorId?: ObjectId; action: string; entityType: string; entityId?: ObjectId; metadata?: Record<string, string | number | boolean | null> }) {
  const { auditLogs } = await collections();
  await auditLogs.insertOne({ _id: new ObjectId(), actorId: input.actorId, action: input.action, entityType: input.entityType, entityId: input.entityId, metadata: input.metadata ?? {}, createdAt: new Date() });
}
