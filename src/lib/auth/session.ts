import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { SignJWT, jwtVerify, errors as joseErrors, type JWTPayload } from "jose";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getCoreEnv } from "@/lib/config/env";
import { collections } from "@/lib/db/collections";
import type { UserDocument, UserRole } from "@/lib/platform/types";

const ACCESS_COOKIE = "bf_access";
const REFRESH_COOKIE = "bf_refresh";
const ISSUER = "builderfind";
const AUDIENCE = "builderfind-web";
const ACCESS_SECONDS = 15 * 60;
const REFRESH_SECONDS = 30 * 24 * 60 * 60;

type AuthClaims = JWTPayload & { type: "access" | "refresh"; userId: string; role: UserRole; sessionId: string; tokenVersion: number };
export type AuthenticatedUser = Pick<UserDocument, "email" | "firstName" | "lastName" | "phone" | "role" | "status" | "notificationPreferences" | "tokenVersion"> & { id: string; sessionId: string };

function accessKey() { return new TextEncoder().encode(getCoreEnv().JWT_ACCESS_SECRET); }
function refreshKey() { return new TextEncoder().encode(getCoreEnv().JWT_REFRESH_SECRET); }
function tokenHash(value: string) { return createHash("sha256").update(value).digest("hex"); }

async function signToken(user: UserDocument, sessionId: string, type: "access" | "refresh", jti: string, seconds: number) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ type, userId: user._id.toHexString(), role: user.role, sessionId, tokenVersion: user.tokenVersion })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" }).setIssuer(ISSUER).setAudience(AUDIENCE).setSubject(user._id.toHexString()).setJti(jti).setIssuedAt(now).setExpirationTime(now + seconds).sign(type === "access" ? accessKey() : refreshKey());
}

async function verifyToken(token: string, type: "access" | "refresh") {
  const result = await jwtVerify(token, type === "access" ? accessKey() : refreshKey(), { algorithms: ["HS256"], issuer: ISSUER, audience: AUDIENCE });
  const payload = result.payload as AuthClaims;
  if (payload.type !== type || !payload.userId || !payload.sessionId || !payload.jti) throw new joseErrors.JWTClaimValidationFailed("Invalid token type", payload, "type", "check_failed");
  return payload;
}

function cookieOptions(maxAge: number) { return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge, priority: "high" as const }; }

export async function createSession(user: UserDocument, request: Request, remember = true) {
  const { sessions } = await collections();
  const sessionId = new ObjectId();
  const refreshJti = randomUUID();
  const familyId = randomUUID();
  const lifetime = remember ? REFRESH_SECONDS : 24 * 60 * 60;
  const createdAt = new Date();
  await sessions.insertOne({ _id: sessionId, userId: user._id, refreshJtiHash: tokenHash(refreshJti), familyId, userAgent: request.headers.get("user-agent")?.slice(0, 300), expiresAt: new Date(createdAt.getTime() + lifetime * 1000), createdAt });
  const [access, refresh] = await Promise.all([signToken(user, sessionId.toHexString(), "access", randomUUID(), ACCESS_SECONDS), signToken(user, sessionId.toHexString(), "refresh", refreshJti, lifetime)]);
  const store = await cookies();
  store.set(ACCESS_COOKIE, access, cookieOptions(ACCESS_SECONDS));
  store.set(REFRESH_COOKIE, refresh, cookieOptions(lifetime));
}

async function hydrateUser(claims: AuthClaims): Promise<AuthenticatedUser | null> {
  if (!ObjectId.isValid(claims.userId) || !ObjectId.isValid(claims.sessionId)) return null;
  const { users, sessions } = await collections();
  const [user, session] = await Promise.all([
    users.findOne({ _id: new ObjectId(claims.userId), status: "active" }, { projection: { passwordHash: 0 } }),
    sessions.findOne({ _id: new ObjectId(claims.sessionId), userId: new ObjectId(claims.userId), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } }),
  ]);
  if (!user || !session || user.tokenVersion !== claims.tokenVersion || user.role !== claims.role) return null;
  return { id: user._id.toHexString(), sessionId: session._id.toHexString(), email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, status: user.status, notificationPreferences: user.notificationPreferences, tokenVersion: user.tokenVersion };
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (access) {
    try { return await hydrateUser(await verifyToken(access, "access")); } catch { /* try refresh */ }
  }
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;
  try {
    const claims = await verifyToken(refresh, "refresh");
    const { sessions } = await collections();
    const session = await sessions.findOne({ _id: new ObjectId(claims.sessionId), refreshJtiHash: tokenHash(claims.jti!), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } });
    return session ? hydrateUser(claims) : null;
  } catch { return null; }
}

export async function requireUser(...roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (roles.length && !roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}

export async function rotateSession() {
  const store = await cookies();
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;
  const claims = await verifyToken(refresh, "refresh");
  const { sessions, users } = await collections();
  const sessionId = new ObjectId(claims.sessionId);
  const session = await sessions.findOne({ _id: sessionId, userId: new ObjectId(claims.userId), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } });
  if (!session || session.refreshJtiHash !== tokenHash(claims.jti!)) {
    if (session) await sessions.updateMany({ familyId: session.familyId }, { $set: { revokedAt: new Date() } });
    return null;
  }
  const user = await users.findOne({ _id: session.userId, status: "active" });
  if (!user || user.tokenVersion !== claims.tokenVersion) return null;
  const jti = randomUUID();
  const lifetime = session.expiresAt.getTime() - session.createdAt.getTime() > 2 * 24 * 60 * 60_000 ? REFRESH_SECONDS : 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + lifetime * 1000);
  const rotation = await sessions.updateOne({ _id: sessionId, refreshJtiHash: session.refreshJtiHash, revokedAt: { $exists: false } }, { $set: { refreshJtiHash: tokenHash(jti), rotatedAt: new Date(), expiresAt } });
  if (!rotation.modifiedCount) return null;
  const [accessToken, refreshToken] = await Promise.all([signToken(user, claims.sessionId, "access", randomUUID(), ACCESS_SECONDS), signToken(user, claims.sessionId, "refresh", jti, lifetime)]);
  store.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_SECONDS));
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions(lifetime));
  return hydrateUser({ ...claims, jti, tokenVersion: user.tokenVersion });
}

export async function revokeCurrentSession() {
  const store = await cookies();
  const tokens = [store.get(ACCESS_COOKIE)?.value, store.get(REFRESH_COOKIE)?.value].filter(Boolean) as string[];
  for (const token of tokens) {
    try {
      const claims = await verifyToken(token, token === tokens[0] && store.get(ACCESS_COOKIE)?.value === token ? "access" : "refresh");
      if (ObjectId.isValid(claims.sessionId)) await (await collections()).sessions.updateOne({ _id: new ObjectId(claims.sessionId) }, { $set: { revokedAt: new Date() } });
      break;
    } catch { /* continue */ }
  }
  store.set(ACCESS_COOKIE, "", cookieOptions(0));
  store.set(REFRESH_COOKIE, "", cookieOptions(0));
}
