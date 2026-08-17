import { ObjectId } from "mongodb";
import { put } from "@vercel/blob";
import { apiUser } from "@/lib/auth/api-auth";
import { collections } from "@/lib/db/collections";
import { assertTrustedOrigin, jsonError, ApiError } from "@/lib/http/api";
import { getOptionalIntegrations } from "@/lib/config/env";
import { serialise } from "@/lib/platform/serialise";
import type { MediaDocument } from "@/lib/platform/types";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const PURPOSES: MediaDocument["purpose"][] = ["job", "portfolio", "verification", "avatar", "message"];
function isUploadPurpose(value: FormDataEntryValue | null): value is MediaDocument["purpose"] {
  return typeof value === "string" && PURPOSES.some((purpose) => purpose === value);
}
export async function POST(request: Request) {
  try { assertTrustedOrigin(request); const user = await apiUser(); const env = getOptionalIntegrations(); if (!env.blobToken) throw new ApiError(503, "File uploads are not configured. Add BLOB_READ_WRITE_TOKEN.", "UPLOADS_NOT_CONFIGURED"); const form = await request.formData(); const file = form.get("file"); const purpose = form.get("purpose"); if (!(file instanceof File)) throw new ApiError(400, "Choose a file", "FILE_REQUIRED"); if (!ALLOWED.has(file.type)) throw new ApiError(415, "Use JPG, PNG, WebP or PDF files", "INVALID_FILE_TYPE"); if (file.size > 10 * 1024 * 1024) throw new ApiError(413, "Files must be 10MB or smaller", "FILE_TOO_LARGE"); if (!isUploadPurpose(purpose)) throw new ApiError(400, "Invalid upload purpose", "INVALID_PURPOSE"); const isPublic = purpose === "portfolio" || purpose === "avatar"; const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(-100); const pathname = `${purpose}/${user.id}/${crypto.randomUUID()}-${safeName}`; const blob = await put(pathname, file, { access: isPublic ? "public" : "private", addRandomSuffix: false, contentType: file.type, token: env.blobToken }); const media: MediaDocument = { _id: new ObjectId(), ownerId: new ObjectId(user.id), purpose, access: isPublic ? "public" : "private", blobUrl: blob.url, pathname: blob.pathname, contentType: file.type, size: file.size, createdAt: new Date() }; await (await collections()).media.insertOne(media); return Response.json({ media: serialise(media) }, { status: 201 }); } catch (error) { return jsonError(error); }
}
