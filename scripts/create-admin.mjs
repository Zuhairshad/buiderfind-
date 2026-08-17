import { randomBytes, scrypt } from "node:crypto";
import { MongoClient, ObjectId } from "mongodb";

const { MONGODB_URI, MONGODB_DB = "builderfind", ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_BOOTSTRAP_EMAIL || !ADMIN_BOOTSTRAP_PASSWORD) throw new Error("MONGODB_URI, ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD are required");
if (ADMIN_BOOTSTRAP_PASSWORD.length < 10) throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 10 characters");
const derive = (password, salt) => new Promise((resolve, reject) => scrypt(password, salt, 64, { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
const salt = randomBytes(16); const key = await derive(ADMIN_BOOTSTRAP_PASSWORD, salt); const passwordHash = `scrypt$${1 << 15}$8$1$${salt.toString("base64url")}$${key.toString("base64url")}`;
const client = new MongoClient(MONGODB_URI);
try {
  await client.connect();
  const now = new Date();
  const users = client.db(MONGODB_DB).collection("users");
  const email = ADMIN_BOOTSTRAP_EMAIL.trim().toLowerCase();
  const existing = await users.findOne({ email }, { projection: { _id: 1 } });
  const result = await users.updateOne(
    { email },
    {
      $set: { passwordHash, firstName: "BuilderFind", lastName: "Admin", role: "admin", status: "active", notificationPreferences: { email: true, sms: false, inApp: true, weeklySummary: false }, updatedAt: now },
      $setOnInsert: { _id: new ObjectId(), tokenVersion: 0, createdAt: now },
      ...(existing ? { $inc: { tokenVersion: 1 } } : {}),
    },
    { upsert: true },
  );
  if (existing) await client.db(MONGODB_DB).collection("sessions").updateMany({ userId: existing._id, revokedAt: { $exists: false } }, { $set: { revokedAt: now } });
  console.log(result.upsertedCount ? "Admin account created." : "Admin account updated and existing sessions revoked.");
} finally { await client.close(); }
