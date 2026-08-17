import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
const KEY_LENGTH = 64;
const COST = 1 << 15;

function derive(password: string, salt: Buffer, length: number, options: { N: number; r: number; p: number; maxmem: number }) {
  return new Promise<Buffer>((resolve, reject) => scrypt(password, salt, length, options, (error, key) => error ? reject(error) : resolve(key)));
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, KEY_LENGTH, { N: COST, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${COST}$8$1$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, cost, r, p, saltValue, keyValue] = encoded.split("$");
  if (algorithm !== "scrypt" || !cost || !r || !p || !saltValue || !keyValue) return false;
  const expected = Buffer.from(keyValue, "base64url");
  const actual = await derive(password, Buffer.from(saltValue, "base64url"), expected.length, { N: Number(cost), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024 });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
