import { collections } from "@/lib/db/collections";
import { ApiError, jsonError } from "@/lib/http/api";
import { id } from "@/lib/marketplace/access";

export async function GET(_: Request, context: RouteContext<"/api/media/public/[id]">) {
  try {
    const media = await (await collections()).media.findOne({ _id: id((await context.params).id), access: "public" });
    if (!media) throw new ApiError(404, "Media not found", "NOT_FOUND");
    const source = await fetch(media.blobUrl);
    if (!source.ok || !source.body) throw new ApiError(502, "Media is temporarily unavailable", "MEDIA_UNAVAILABLE");
    return new Response(source.body, { headers: { "Content-Type": media.contentType, "Content-Length": String(media.size), "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch (error) { return jsonError(error); }
}
