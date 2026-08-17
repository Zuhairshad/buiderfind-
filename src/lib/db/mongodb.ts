import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { MongoClient, type Db } from "mongodb";
import { getCoreEnv } from "@/lib/config/env";

declare global { var __builderFindMongoPromise: Promise<MongoClient> | undefined; }

export function getMongoClient(): Promise<MongoClient> {
  if (!globalThis.__builderFindMongoPromise) {
    const { MONGODB_URI } = getCoreEnv();
    const client = new MongoClient(MONGODB_URI, { maxPoolSize: 20, minPoolSize: 0, maxIdleTimeMS: 10_000, waitQueueTimeoutMS: 5_000, retryReads: true, retryWrites: true });
    attachDatabasePool(client);
    globalThis.__builderFindMongoPromise = client.connect().catch((error) => { globalThis.__builderFindMongoPromise = undefined; throw error; });
  }
  return globalThis.__builderFindMongoPromise;
}

export async function getDb(): Promise<Db> {
  const [{ MONGODB_DB }, client] = await Promise.all([Promise.resolve(getCoreEnv()), getMongoClient()]);
  return client.db(MONGODB_DB);
}
