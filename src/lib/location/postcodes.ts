import "server-only";

export async function geocodePostcode(postcode: string) {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.replace(/\s/g, ""))}`, { signal: AbortSignal.timeout(2500), cache: "no-store" });
    if (!response.ok) return undefined;
    const data = await response.json() as { result?: { longitude?: number; latitude?: number } };
    if (typeof data.result?.longitude !== "number" || typeof data.result.latitude !== "number") return undefined;
    return { type: "Point" as const, coordinates: [data.result.longitude, data.result.latitude] as [number, number] };
  } catch { return undefined; }
}
