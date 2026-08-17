import { get } from "@vercel/blob";
import { ObjectId } from "mongodb";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { jsonError, ApiError } from "@/lib/http/api";
import { id } from "@/lib/marketplace/access";
import { getOptionalIntegrations } from "@/lib/config/env";

export async function GET(request: Request, context: RouteContext<"/api/media/[id]">) {
  try {
    const mediaId = id((await context.params).id);
    const c = await collections();
    const media = await c.media.findOne({ _id: mediaId });
    if (!media) throw new ApiError(404, "File not found", "NOT_FOUND");
    if (media.access === "public") return Response.redirect(media.blobUrl);

    const user = await apiUser();
    if (user.role !== "admin" && media.ownerId.toHexString() !== user.id) {
      const userId = new ObjectId(user.id);
      const [job, message] = await Promise.all([
        c.jobs.findOne({ mediaIds: mediaId, customerId: userId }),
        c.messages.findOne({ mediaIds: mediaId, $or: [{ senderId: userId }, { recipientId: userId }] }),
      ]);
      if (!job && !message) throw new ApiError(403, "You cannot access this file", "FORBIDDEN");
    }

    const token = getOptionalIntegrations().blobToken;
    if (!token) throw new ApiError(503, "File storage is not configured", "UPLOADS_NOT_CONFIGURED");
    const result = await get(media.blobUrl, { access: "private", token, ifNoneMatch: request.headers.get("if-none-match") ?? undefined });
    if (!result) throw new ApiError(404, "File not found", "NOT_FOUND");
    if (result.statusCode === 304) return new Response(null, { status: 304, headers: { ETag: result.blob.etag } });
    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Content-Length": String(result.blob.size),
        "Cache-Control": "private, max-age=300",
        ETag: result.blob.etag,
        "Content-Disposition": result.blob.contentDisposition,
      },
    });
  } catch (error) { return jsonError(error); }
}
