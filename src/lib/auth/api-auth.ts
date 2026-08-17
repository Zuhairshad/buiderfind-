import { ApiError } from "@/lib/http/api";
import { requireUser, type AuthenticatedUser } from "./session";
import type { UserRole } from "@/lib/platform/types";

export async function apiUser(...roles: UserRole[]): Promise<AuthenticatedUser> {
  try { return await requireUser(...roles); }
  catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") throw new ApiError(401, "Sign in to continue", "UNAUTHENTICATED");
    if (error instanceof Error && error.message === "FORBIDDEN") throw new ApiError(403, "You do not have access to this action", "FORBIDDEN");
    throw error;
  }
}
