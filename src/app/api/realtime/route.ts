import { experimental_upgradeWebSocket, type WebSocketData } from "@vercel/functions";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth/session";
import { collections } from "@/lib/db/collections";
import { serialise } from "@/lib/platform/serialise";

export const maxDuration = 300;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in to connect" }, { status: 401 });
  const c = await collections();
  const userId = new ObjectId(user.id);
  const audience = { $or: [{ audienceUserIds: userId }, { audienceRoles: user.role }] };

  return experimental_upgradeWebSocket(async (ws) => {
    let lastSequence = 0;
    const send = (value: unknown) => { if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(serialise(value))); };
    send({ type: "realtime.connected", sequence: 0, payload: { role: user.role } });

    ws.on("message", async (data: WebSocketData) => {
      try {
        const message = JSON.parse(data.toString()) as { type?: string; lastSequence?: number };
        if (message.type === "resume" && Number.isSafeInteger(message.lastSequence) && Number(message.lastSequence) >= 0) {
          lastSequence = Number(message.lastSequence);
          const missed = await c.realtimeEvents.find({ ...audience, sequence: { $gt: lastSequence } }).sort({ sequence: 1 }).limit(200).toArray();
          missed.forEach(send);
        }
        if (message.type === "ping") send({ type: "pong", sequence: lastSequence });
      } catch { send({ type: "realtime.error", payload: { message: "Invalid realtime message" } }); }
    });

    try {
      const stream = c.realtimeEvents.watch([{ $match: { operationType: "insert", $or: [{ "fullDocument.audienceUserIds": userId }, { "fullDocument.audienceRoles": user.role }] } }], { fullDocument: "updateLookup" });
      stream.on("change", (change) => { if ("fullDocument" in change && change.fullDocument) { lastSequence = change.fullDocument.sequence; send(change.fullDocument); } });
      stream.on("error", (error) => { console.error("Realtime change stream failed", error); send({ type: "realtime.unavailable", payload: { fallbackSeconds: 30 } }); });
      ws.on("close", () => void stream.close());
      ws.on("error", () => void stream.close());
    } catch (error) {
      console.error("Realtime connection failed", error);
      send({ type: "realtime.unavailable", payload: { fallbackSeconds: 30 } });
    }
  }, { maxPayload: 16 * 1024 });
}
