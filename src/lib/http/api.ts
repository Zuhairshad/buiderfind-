import { ZodError } from "zod";

export class ApiError extends Error { constructor(public status: number, message: string, public code = "REQUEST_FAILED") { super(message); } }
export function jsonError(error: unknown) {
  if (error instanceof ApiError) return Response.json({ error: error.message, code: error.code }, { status: error.status });
  if (error instanceof ZodError) return Response.json({ error: "Check the highlighted fields", code: "VALIDATION_ERROR", fields: error.flatten().fieldErrors }, { status: 400 });
  if (error instanceof Error && error.message === "RATE_LIMITED") return Response.json({ error: "Too many attempts. Please try again later.", code: "RATE_LIMITED" }, { status: 429 });
  console.error("Unhandled API error", error);
  return Response.json({ error: "Something went wrong", code: "INTERNAL_ERROR" }, { status: 500 });
}

export function assertTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const expected = process.env.APP_ORIGIN;
  const requestOrigin = new URL(request.url).origin;
  if (origin !== requestOrigin && (!expected || origin !== expected)) throw new ApiError(403, "Untrusted request origin", "CSRF_REJECTED");
}

export async function readJson(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new ApiError(415, "JSON request body required", "UNSUPPORTED_MEDIA_TYPE");
  return request.json().catch(() => { throw new ApiError(400, "Invalid JSON", "INVALID_JSON"); });
}
