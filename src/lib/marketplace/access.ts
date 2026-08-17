import { ObjectId } from "mongodb";
import type { AuthenticatedUser } from "@/lib/auth/session";
import { ApiError } from "@/lib/http/api";

export function id(value: string) { if (!ObjectId.isValid(value)) throw new ApiError(400, "Invalid identifier", "INVALID_ID"); return new ObjectId(value); }
export function owns(user: AuthenticatedUser, ownerId: ObjectId) { if (user.role !== "admin" && ownerId.toHexString() !== user.id) throw new ApiError(403, "You do not have access to this record", "FORBIDDEN"); }
export function isWithinCoverage(origin: [number, number], target: [number, number], miles: number) { const radians = (degrees: number) => degrees * Math.PI / 180; const [lon1, lat1] = origin; const [lon2, lat2] = target; const dLat = radians(lat2 - lat1); const dLon = radians(lon2 - lon1); const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2; const metres = 6_371_000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)); return metres <= miles * 1609.344; }
