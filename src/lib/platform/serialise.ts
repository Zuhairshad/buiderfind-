import { ObjectId } from "mongodb";

export type Jsonify<T> = T extends ObjectId ? string : T extends Date ? string : T extends Array<infer Item> ? Jsonify<Item>[] : T extends object ? { [Key in keyof T as Key extends "_id" ? "id" : Key]: Jsonify<T[Key]> } : T;

export function serialise<T>(value: T): Jsonify<T> {
  if (value instanceof ObjectId) return value.toHexString() as Jsonify<T>;
  if (value instanceof Date) return value.toISOString() as Jsonify<T>;
  if (Array.isArray(value)) return value.map(serialise) as Jsonify<T>;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key === "_id" ? "id" : key, serialise(item)])) as Jsonify<T>;
  return value as Jsonify<T>;
}
